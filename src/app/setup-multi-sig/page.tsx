import { useState } from 'react'
import { setupMultiSigWallet } from '../utils/setupMultiSigWallet'

const SetupMultiSigWallet = () => {
	const [account, setAccount] = useState('')
	const [secret, setSecret] = useState('')
	const [signers, setSigners] = useState([{ account: '', weight: 1 }])

	const handleSetupMultiSigWallet = async () => {
		const result = await setupMultiSigWallet(account, secret, signers)
		console.log('Multi-Sig Wallet Setup:', result)
	}

	return (
		<div className='container mx-auto p-4'>
			<input
				type='text'
				placeholder='Account'
				value={account}
				onChange={(e) => setAccount(e.target.value)}
				className='input input-primary'
			/>
			<input
				type='text'
				placeholder='Secret'
				value={secret}
				onChange={(e) => setSecret(e.target.value)}
				className='input input-primary'
			/>
			<button onClick={handleSetupMultiSigWallet} className='btn btn-primary'>
				Setup Multi-Sig Wallet
			</button>
		</div>
	)
}

export default SetupMultiSigWallet
