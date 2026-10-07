import express from "express"
import pool from "../database/db.js"
import authMiddleware from "../middleware/auth.js"

const router = express.Router()

router.get('/',  async (req, res) => {
    try {
        const result = await pool.query("SELECT title, content , users.name FROM post JOIN users ON post.user_id = users.id")

        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: "failed to retrive data" })
    }
}).post('/', authMiddleware, async (req, res) => {
    const { title, content, user_id } = req.body
    if (!title || !user_id) {
        return res.status(400).json({ error: "In-complete information" })
    }
    try {
        const result = await pool.query("INSERT INTO post (title , content,user_id) VALUES ($1,$2,$3)", [title, content, user_id])

        res.status(200).json({
            success: true,
            message: "data saved successfully",
            data: { title, content }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "failed to svae the data" })
    }
})


export default router