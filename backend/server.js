const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser')
require("dotenv").config({path:"./config.env"});
const port = process.env.PORT || 5000;
app.use(cookieParser());
app.use(cors());
app.use(express.json());


const dbo = require("./db/conn");
const {registerRouter}  = require("./routes/register");
const {loginRouter,} = require("./routes/login")

app.listen(port,()=>{
    dbo.connectToServer(function(err){
        if(err) console.error(err);
    });
    console.log(`Server is running on port :${port}`);
});

app.get("/",async(req,res)=>{
    res.send("HI");
})

app.use("/register",registerRouter)
app.use("/login",loginRouter);

