import { ECPairFactory } from 'ecpair'
import * as secp256k1 from 'secp256k1'
import { DIDDocument } from 'did-resolver'

const ECPair = ECPairFactory(secp256k1)

export const generateDID = async () => {
	const keyPair = ECPair.makeRandom()
	const publicKey = keyPair.publicKey.toString('hex')
	const privateKey = keyPair.privateKey.toString('hex')
	const did = `did:xrpl:${publicKey}`

	const didDocument = {
		'@context': 'https://w3id.org/did/v1',
		id: did,
		publicKey: [
			{
				id: `${did}#keys-1`,
				type: ['CryptographicKey', 'EcdsaKoblitzPublicKey'],
				curve: 'secp256k1',
				publicKeyHex: publicKey,
			},
		],
	}

	return { did, didDocument, publicKey, privateKey }
}
