import { Transaction, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js'
import axios from 'axios'

const SendSOL = async (toAddress: String, amount: number) => {

    const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/ep5RWlEUIWdHY4jnQBpu1q3lQunOmLwE", "confirmed")
    const txn = new Transaction()
    const fromPubkey = new PublicKey("84baPrsugmK18FLE8hu7SCQs9Tj64bzxZH8whUGHbPZn")
    const ix = SystemProgram.transfer({
        fromPubkey,
        toPubkey: new PublicKey(toAddress),
        lamports: amount * LAMPORTS_PER_SOL
    })
    txn.add(ix)

    const { blockhash } = await connection.getLatestBlockhash()
    txn.recentBlockhash = blockhash
    txn.feePayer = fromPubkey

    const serializedTxn = txn.serialize({
        requireAllSignatures: false,
        verifySignatures: false
    })
    console.log(serializedTxn)
    await axios.post('http://localhost:3000/api/v1/txn/sign', {
        message: serializedTxn,
        retry: 5
    })
}

export default SendSOL;