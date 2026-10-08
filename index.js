import express from "express"
import cookieParser from "cookie-parser"
import  pool  from "./database/db.js"
import authroutes from "./routes/auth.js"
import authMiddleware from "./middleware/auth.js"
import postroute from "./routes/post.js"
import "dotenv/config"


const app = express()


app.use(express.json()) 
app.use(cookieParser())
app.use(express.static("public"))

app.use('/post',postroute)
app.use('/auth', authroutes)



const port = process.env.PORT || 3000


app.get("/", (req, res) => {
    res.json({
        message: "Backend is running"
    });
});


app.get('/users', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users")
        res.status(200).json({
            success:true,
            message:"retrived data",
            data:{ id, name, email}
        })


    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "failed to read the users file" })
    }
}).post('/users', authMiddleware, async (req, res) => {
    try {

        const { name, email } = req.body
        if (!name || !email) {
            return res.status(400).json({ error: "give the complete info with email and name" })
        }
        await pool.query("INSERT INTO users (name,email) VALUES ($1,$2)", [name, email])

        res.status(200).json({
            success: true,
            message: `data recieved of ${name}`,
            data: { name, email }
        })
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: "failed to save data of users" })
    }
}).put('/users/:id', authMiddleware,async (req, res) => {
    try {
        const id = req.params.id
        const { name, email } = req.body
        if (!name || !email) {
            return res.status(400).json({ error: "give email and name of the users" })
        }
        const result = await pool.query("UPDATE users SET name =$1, email = $2 WHERE id =$3", [name, email, id])

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "there is no users from this id exist" })
        }
        res.status(200).json({
            success: true,
            message: `data recieved of ${name}`,
            data: { name, email }
        })
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: "failed to save the data" })
    }
}).delete('/users/:id',authMiddleware ,async (req, res) => {
    try {
        const id = req.params.id


        const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [id])
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "there is no users from this id exist" })
        }
        res.status(200).json({
            success: true,
            message: `user deleted succesfully`,
            data: result.rows[0]
        })
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: "failed to save the data" })
    }


})


app.listen(port, () => {
    console.log(`app is listning on port ${port}`)
})