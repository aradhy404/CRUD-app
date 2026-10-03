
import express from "express"
import fs from "fs/promises"


const app = express()

app.use(express.static("public"))

app.use(express.json())

const port = 3000


app.get('/users',async(req,res)=>{
    try{
        const data = await fs.readFile("users.json","utf-8")
        const user = JSON.parse(data)

        res.json(user)

    }catch(err){
        console.error(err)
        res.status(500).json({error: "failed to read the user file"})
    }
}).post('/users',async (req,res)=>{
    try{

        const{name,email} = req.body
        if(!name||!email){
            return res.status(400).json({error:"give the complete info with email and name"})
        }
        const data = await fs.readFile("users.json","utf-8")
        const user = JSON.parse(data)
        user.push({name, email})

        await fs.writeFile("users.json", JSON.stringify(user,null,2))
        

        res.status(200).json({
            success:true,
            message:`data recieved of ${name}`,
            data: {name,email}
        })
    }catch(err){
        console.error(err)
        res.status(400).json({error: "failed to save data of user"})
    }
})

app.listen(port,()=>{
    console.log(`app is listning on port ${port}`)
})