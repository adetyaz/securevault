'use client'
import { useState } from 'react'
import {
	generateDID,
	createDIDDocument,
	generateSignature,
	verifySignature,
} from '../utils/generateDID'

const DIDComponent: React.FC = () => {
	const [did, setDID] = useState('')
	const [wallet, setWallet] = useState<{
		publicKey: string
		privateKey: string
	} | null>(null)
	const [didDocument, setDIDDocument] = useState<any>(null)
	const [signature, setSignature] = useState('')
	const [message, setMessage] = useState('Hello, this is a test message.')
	const [isValid, setIsValid] = useState<boolean | null>(null)

	const handleGenerateDID = async () => {
		const { did, wallet } = await generateDID()
		setDID(did)
		setWallet(wallet)
		const document = createDIDDocument(did, wallet.publicKey)
		setDIDDocument(document)
	}

	const handleSignMessage = () => {
		if (wallet) {
			const sig = generateSignature(message, wallet.privateKey)
			setSignature(sig)
		}
	}

	const handleVerifySignature = () => {
		if (wallet) {
			const valid = verifySignature(message, signature, wallet.publicKey)
			setIsValid(valid)
		}
	}

	return (
		<div className='p-4'>
			<h1 className='text-2xl font-bold mb-4'>
				Decentralized Identity (DID) Demo
			</h1>
			<button
				className='bg-blue-500 text-white px-4 py-2 rounded'
				onClick={handleGenerateDID}
			>
				Generate DID
			</button>

			{did && (
				<div className='mt-4'>
					<h2 className='text-xl font-bold'>DID:</h2>
					<p>{did}</p>

					<h2 className='text-xl font-bold mt-4'>DID Document:</h2>
					<pre className='bg-gray-100 p-2 rounded'>
						{JSON.stringify(didDocument, null, 2)}
					</pre>

					<h2 className='text-xl font-bold mt-4'>Sign and Verify</h2>
					<div>
						<label className='block font-bold'>Message:</label>
						<input
							className='border p-2 rounded w-full'
							type='text'
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
					</div>
					<button
						className='bg-green-500 text-white px-4 py-2 rounded mt-2'
						onClick={handleSignMessage}
					>
						Sign Message
					</button>
					{signature && (
						<div className='mt-2'>
							<h2 className='text-xl font-bold'>Signature:</h2>
							<p>{signature}</p>
						</div>
					)}

					<button
						className='bg-purple-500 text-white px-4 py-2 rounded mt-2'
						onClick={handleVerifySignature}
					>
						Verify Signature
					</button>
					{isValid !== null && (
						<div className='mt-2'>
							<h2 className='text-xl font-bold'>Signature Verification:</h2>
							<p className={isValid ? 'text-green-500' : 'text-red-500'}>
								{isValid ? 'Valid' : 'Invalid'}
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default DIDComponent
