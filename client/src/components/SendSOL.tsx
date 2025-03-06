import { Transaction, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js'
import axios from 'axios'

const SendSOL = async (toAddress: string, amount: number) => {
    const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/ep5RWlEUIWdHY4jnQBpu1q3lQunOmLwE", "confirmed");
    const txn = new Transaction();
    const fromPubkey = new PublicKey("7keD8tuUJJBGRozKcoGxHDPdp9k2vvxX6RukkYzJT7i3");
    const ix = SystemProgram.transfer({
        fromPubkey,
        toPubkey: new PublicKey(toAddress),
        lamports: amount * LAMPORTS_PER_SOL
    });
    txn.add(ix);

    const { blockhash } = await connection.getLatestBlockhash();
    txn.recentBlockhash = blockhash;
    txn.feePayer = fromPubkey;

    const serializedTxn = txn.serialize({
        requireAllSignatures: false,
        verifySignatures: false
    }).toString('base64');
    console.log("Serialized transaction:", serializedTxn);
    try {
        const response = await axios.post('http://localhost:3000/api/v1/txn/sign', {
            message: serializedTxn,
            username: "rohitvkgdg",
        });
        console.log("Transaction sign response:", response.data);
    } catch (error) {
        console.error("Error sending transaction for signing:", error);
    }
};

export default SendSOL;