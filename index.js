const express = require("express");
const path = require("path")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express()
const UserModel = require("./models/user")
const PostModel = require("./models/post")

app.set("view engine","ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

function isLoggedIn(req,res,next){
    if(req.cookies.token === "") res.redirect("/login")
    else{
        const data = jwt.verify(req.cookies.token,"dummy")
        req.user = data;
    }
    next()
}

app.get("/",(req,res)=>{
    res.render("index")
})

app.post("/register",async(req,res)=>{
    const {name ,username,password,age,email} = req.body
    const user = await UserModel.findOne({email})
    if(user) return res.status(500).send("User is Alredy Registerd")

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
          const user = await UserModel.create({
                name,
                username,
                email,
                password:hash,
                age,
            });

            const token = jwt.sign({email:email,userid:user._id},"dummy")
            res.cookie("token",token)
            res.send("regesiterd")

        })
    })

   
})
app.get("/login",async(req,res)=>{
    res.render('login')
})

app.post("/login",async(req,res)=>{
    const {email,password} = req.body
    const user = await UserModel.findOne({email})
    if(!user) return res.status(500).send("Something Went Wrong")

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            const Token = jwt.sign({email:email,userid:user._id},"dummy")
            res.cookie("token",Token)
            res.status(200).redirect("/userprofile")

        }else res.redirect("/login")
    })
   
})

app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("/login")
})
app.get("/userprofile",isLoggedIn,async(req,res)=>{
    const user = await UserModel.findOne({email:req.user.email})
    console.log(user)
    res.render("userprofile",{user})
})

app.listen(8000,()=>{
    console.log(`server is running`)
})