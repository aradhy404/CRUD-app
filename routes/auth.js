import express from "express"
import pool from "../database/db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"




const router = express.Router()




router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ error: "give the complete information of the user" })
        }

        const hashedPass = await bcrypt.hash(password, 10)

        const result = await pool.query("INSERT INTO users (name, email, password) VALUES ($1,$2,$3)", [name, email, hashedPass])
        res.status(201).json({
            success: true,
            message: "user registered",
            data: { email, name }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "failed to register user" })

    }

}).post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "password or email is invalid" })
        }

        const emailInDatabase = await pool.query("SELECT * FROM users WHERE email = $1", [email])
        const user = emailInDatabase.rows[0]

        if (emailInDatabase.rowCount === 0) {
            return res.status(400).json({ error: "invalid credentials" })
        }

        const pass = await bcrypt.compare(password, user.password)
         if (!pass) {
            return res.status(401).json({ error: "invalid credentials" })
        }


        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "10h"}
        )
        res.status(200).json({ success: true, token })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "failed to login" })

    }

})




export default router