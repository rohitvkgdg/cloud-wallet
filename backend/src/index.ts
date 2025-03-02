import express from "express";
import { PrismaClient } from "@prisma/client";
import zod from "zod";
const jwt = require("jsonwebtoken");
import { Keypair } from "@solana/web3.js";

const app = express();
app.use(express.json());
const prisma = new PrismaClient();
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
    if(!prisma.user.findUnique({ where: { username, password } })) {
        res.status(400).send("Invalid username or password");
    }
    const token = jwt.sign({
        id: user
    }, JWT_SECRET);

    res.json(token);
    
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
    if(await prisma.user.findUnique({ where: { username } })) {
        res.status(400).send("Username already exists, please login");
    }
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
});

app.post("/api/v1/txn/sign", (req, res) => {

    res.send("Transaction sign successful");
});

app.get("/api/v1/txn/:id", (req, res) => {

    res.send("Transaction successful");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});