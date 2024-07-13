import { Client, Wallet, sign } from 'xrpl'

const client = new Client('wss://s.altnet.rippletest.net:51233') // Testnet URL

export const submitMultiSigTransaction = async (transaction, signers) => {
	await client.connect()

	// Prepare the transaction
	const prepared = await client.autofill(transaction)

	// Sign the transaction with each signer's wallet
	const signedTx = signers.reduce((acc, signer) => {
		const wallet = Wallet.fromSeed(signer.secret)
		const signed = wallet.sign(prepared)
		acc.push(signed)
		return acc
	}, [])

	// Combine all signatures
	const combined = signedTx.reduce((acc, tx) => {
		acc.signatures.push(...tx.signatures)
		return acc
	}, signedTx[0])

	// Submit the transaction
	const result = await client.submitAndWait(combined.tx_blob)

	await client.disconnect()
	return result
}
