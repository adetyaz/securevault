import { Resolver } from 'did-resolver'

// Define XRPL DID Resolver options
type XrplDIDResolverOptions = {
	rpcUrl: string
}

function getResolver(options: XrplDIDResolverOptions) {
	async function resolve(did: string): Promise<{
		didResolutionMetadata: any
		didDocument: any | null
		didDocumentMetadata: any
	}> {
		const didResolutionMetadata = {}
		const didDocumentMetadata = {}

		let didDocument = null

		try {
			const address = did.split(':')[3]

			const verificationMethods = await xrplGetVerificationMethods(
				options.rpcUrl,
				address
			)
			const serviceEndpoints = await xrplGetServiceEndpoints(
				options.rpcUrl,
				address
			)
			const controller = await xrplGetController(options.rpcUrl, address)
			const alsoKnownAs = await xrplGetAlsoKnownAs(options.rpcUrl, address)

			didDocument = {
				'@context': 'https://www.w3.org/ns/did/v1',
				id: did,
				verificationMethod: verificationMethods,
				service: serviceEndpoints,
				controller: controller,
				alsoKnownAs: alsoKnownAs,
			}
		} catch (error) {
			console.error(`Failed to resolve DID document for ${did}`, error)
		}

		return {
			didResolutionMetadata,
			didDocument,
			didDocumentMetadata,
		}
	}

	return { xrpl: resolve }
}

export function getResolverRegistry(options: XrplDIDResolverOptions) {
	return new Resolver(getResolver(options))
}
