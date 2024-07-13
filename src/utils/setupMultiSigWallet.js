import { Client, Wallet } from 'xrpl'

const client = new Client('wss://s.altnet.rippletest.net:51233') // Testnet URL

export const setupMultiSigWallet = async (account, secret, signers) => {
	await client.connect()
	const wallet = Wallet.fromSeed(secret)

	const signerListSet = {
		TransactionType: 'SignerListSet',
		Account: account,
		SignerQuorum: signers.length, // Adjust quorum as needed
		SignerEntries: signers.map((signer) => ({
			SignerEntry: {
				Account: signer.account,
				SignerWeight: signer.weight,
			},
		})),
	}

	const prepared = await client.autofill(signerListSet)
	const signed = wallet.sign(prepared)
	const result = await client.submitAndWait(signed.tx_blob)

	await client.disconnect()
	return result
}
