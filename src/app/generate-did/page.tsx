'use client'

import { useState } from 'react'
import { generateDID, storeDIDDocument } from '../utils/generateDID'

const GenerateDID = () => {
	const [did, setDID] = useState(null)
	const [didDocument, setDIDDocument] = useState(null)

	const handleGenerateDID = async () => {
		const { did, didDocument, privateKey } = await generateDID()
		await storeDIDDocument(did, privateKey, didDocument)
		setDID(did)
		setDIDDocument(didDocument)
	}

	return (
		<div className='container mx-auto p-4'>
			<button onClick={handleGenerateDID} className='btn btn-primary'>
				Generate DID
			</button>
			{did && (
				<div>
					<h3>Your DID:</h3>
					<p>{did}</p>
					<h3>DID Document:</h3>
					<pre>{JSON.stringify(didDocument, null, 2)}</pre>
				</div>
			)}
		</div>
	)
}

export default GenerateDID
