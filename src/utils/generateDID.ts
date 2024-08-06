// import { ECPairFactory } from 'ecpair'
// import * as secp256k1 from 'secp256k1'
// import { DIDDocument } from 'did-resolver'
import { Wallet } from 'xrpl'
import { randomBytes } from 'crypto'
import { ec as EC } from 'elliptic'
import { SHA256 } from 'crypto-js'

const ec = new EC('secp256k1')

/**
 * Generates a new DID using the XRPL.
 * @returns {Promise<{ did: string; publicKey: string }>} The generated DID.
 */

// const ECPair = ECPairFactory(secp256k1)

export const generateDID = async () => {
	// Generate a new wallet
	const wallet = Wallet.generate()

	// DID format for XRPL
	const did = `did:xrpl:1:${wallet.address}`

	return { did, wallet }
}

/**
 * Creates a DID Document for a given DID.
 * @param {string} did - The DID to create a document for.
 * @returns {object} The DID Document.
 */

export function createDIDDocument(did: string, publicKey: string) {
	return {
		'@context': 'https://w3id.org/did/v1',
		id: did,
		publicKey: [
			{
				id: `${did}#keys-1`,
				type: 'EcdsaSecp256k1VerificationKey2019',
				curve: 'secp256k1',
				publicKeyHex: publicKey,
			},
		],
	}
}

/**
 * Verifies a signature using the DID's public key.
 * @returns {boolean} True if the signature is valid, false otherwise.
 */
export function verifySignature(): boolean {
	// Message and signature to verify
	const message = 'This is a test message.'

	// Sample signing using a wallet's key (for demonstration purposes)
	const wallet = Wallet.generate() // This should be your existing wallet
	const messageHash = SHA256(message).toString()
	const key = ec.keyFromPrivate(wallet.privateKey.substring(2), 'hex')
	const signature = key.sign(messageHash)

	const signatureHex = {
		r: signature.r.toString(16),
		s: signature.s.toString(16),
	}

	// Verify signature using the public key
	const publicKey = wallet.publicKey
	const keyPublic = ec.keyFromPublic(publicKey.substring(2), 'hex')

	return keyPublic.verify(messageHash, signatureHex)
}
