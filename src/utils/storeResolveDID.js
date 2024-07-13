import { Client, Wallet } from 'xrpl'
import { generateDID } from './generateDID'

const client = new Client('wss://s.altnet.rippletest.net:51233') // Testnet URL

export const storeDIDDocument = async (account, secret, didDocument) => {
	await client.connect()
	const wallet = Wallet.fromSeed(secret)

	const transaction = {
		TransactionType: 'AccountSet',
		Account: account,
		Domain: 'example.com', // Add your domain
		SetFlag: 5, // Fully canonical signature
		Memos: [
			{
				Memo: {
					MemoType: Buffer.from('DIDDocument', 'utf-8')
						.toString('hex')
						.toUpperCase(),
					MemoData: Buffer.from(JSON.stringify(didDocument), 'utf-8')
						.toString('hex')
						.toUpperCase(),
				},
			},
		],
	}

	const prepared = await client.autofill(transaction)
	const signed = wallet.sign(prepared)
	const result = await client.submitAndWait(signed.tx_blob)

	await client.disconnect()
	return result
}

export const resolveDIDDocument = async (did) => {
	await client.connect()
	const account = did.split(':')[3] // Extract account from DID
	const accountInfo = await client.request({
		command: 'account_info',
		account,
	})

	const memo = accountInfo.result.account_data.Memos.find(
		(memo) => memo.Memo.MemoType === '444944446F63756D656E74' // 'DIDDocument' in hex
	)

	await client.disconnect()
	return memo
		? JSON.parse(Buffer.from(memo.Memo.MemoData, 'hex').toString('utf-8'))
		: null
}
