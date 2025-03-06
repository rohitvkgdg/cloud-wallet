import express from "express";
import { PrismaClient } from "@prisma/client";
import zod from "zod";
import jwt from "jsonwebtoken";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();
const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/ep5RWlEUIWdHY4jnQBpu1q3lQunOmLwE")
const JWT_SECRET = "secret";

app.post("/api/v1/login", async (req, res) => {
    const { username, password } = req.body;
    const schema = zod.object({
        username: zod.string(),
        password: zod.string(),
    });
    if(!schema.safeParse(req.body)) {
        res.status(400).send("Invalid input");
    }
    const user = await prisma.user.findUnique({ where: { username } })
    if(!user) {
        res.status(400).send("User not found, please register");
    }
    const checkPassword = await prisma.user.findFirst({ where: { username, password } })
    if(checkPassword) {
        const token = jwt.sign({ username }, JWT_SECRET);
        res.send("Login successful\nToken: " + token);
    }
    else{
        res.status(400).send("Invalid username or password");
    }
    
});

app.post("/api/v1/register", async (req, res) => {
    const { username, password } = req.body;
    const schema = zod.object({
        username: zod.string(),
        password: zod.string(),
    });
    if(!schema.safeParse(req.body)) {
        res.status(400).send("Invalid input");
    }
    const user = await prisma.user.findUnique({ where: { username } })
    if(user) {
        res.status(400).send("Username already exists, please login");
    }
    else{
        const keypair = new Keypair();
        await prisma.user.create({
            data: {
                username,
                password,
                publicKey: keypair.publicKey.toString(),
                privateKey: keypair.secretKey.toString(),
            },
        });
        res.send("Registration successful\nPublic Key: " + keypair.publicKey.toString());
    }
});

app.post("/api/v1/txn/sign", async (req, res) => {
    try {
        const serializedTxn = Buffer.from(req.body.message, 'base64'); // Decode base64 string
        const txn = Transaction.from(serializedTxn);
        const user = await prisma.user.findFirst({
            where: {
                username: req.body.username
            },
            select: {
                privateKey: true
            }
        });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        const privateKeyArray = user.privateKey.split(',').map(num => parseInt(num));
        const secretKey = new Uint8Array(privateKeyArray);
        const keypair = Keypair.fromSecretKey(secretKey);

        const { blockhash } = await connection.getLatestBlockhash();
        txn.recentBlockhash = blockhash;
        txn.feePayer = keypair.publicKey;

        txn.sign(keypair);

        // Log the transaction details for debugging
        console.log("Transaction details:", txn);

        const signature = await connection.sendTransaction(txn, [keypair]);

        res.send("Transaction sign successful\nSignature: " + signature);
    } catch (error) {
        console.error("Error signing transaction:", error);
        res.status(500).send("Error signing transaction message");
    }
});

app.get("/api/v1/txn/:id", (req, res) => {

    res.send("Transaction successful");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});