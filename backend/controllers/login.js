// const dbo = require("../db/conn");
// const login = async(req,res)=>{
//     try{
//         let db_connect = dbo.getDb();
//         let myobj ={
//         email: req.body.email,
//         password: req.body.password,
//         };
//         const useremail = await db_connect.collection("login").findOne({
//             email: myobj.email,
//             // password:myobj.password,
//           });
//       if(useremail?.email === myobj.email ){
//           console.log(useremail.email)
//         res.send({message: "Login Successfull"})
//       }
//     }catch(e){
//         res.send(e.message).status(400);
//     }
// };
const mongoose = require('mongoose');
const fs = require("fs");
const loginModel = require("../model/login");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbo = require("../db/conn");
const Secret_Key = "my";
const login = async (req, res) => {
  try {
    // console.log(req.body)
    let db_connect = dbo.getDb();
    const hashedPassword = bcrypt.hashSync(req.body.password);
    const Model = new loginModel({
      email: req.body.email,
      password: hashedPassword,
    });
    // console.log(Model);

    let useremail = await db_connect.collection("login").findOne({
      email: Model.email,
    });

    // console.log(useremail)
    if(useremail=== undefined || useremail===null){
      return res.send({message:"User does not exist"});
    }

   
    if(!bcrypt.compareSync(req.body.password,useremail?.password)){
        return res.send({message:"Incorrect password"})
    }

  
   
    const token = jwt.sign({ id: useremail._id }, Secret_Key, {
      expiresIn: "1hr",
    }); 
    const writeDatta = {
      user:useremail,
      token:token
    }
    fs.writeFile("./controllers/data.json",JSON.stringify(writeDatta),(e)=>{
      console.log(e)
    });
    res.cookie(String(useremail._id),token,{
      path:'/',
      expires:new Date(Date.now() + 1000 * 3600),
      httpOnly:true,
      sameSite:'lax'
    });
    return res.send({ message: "Login Successfull", user: useremail.email, token });
   
  } catch (e) {
    console.log(e);
    res.send(e.message).status(400);
  }
};
// const verifyToken = async(req, res) => {
//   const token = req.headers["authorization"];
//   console.log(token);
//   // const token = headers.split(" ")[1];
//   if (!token) {
//     return res.status(404).send({ message: "no token found" });
//   }
//   jwt.verify(String(token), Secret_Key, (err, useremail) => {
//     if (err) {
//       return res.status(400).send({ message: "Invalid token" });
//     }
//     console.log(useremail.id);
//     res.status(200).send(useremail);
//   });
  
// };
const verifyToken=(req,res,next)=>{
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];
  console.log(token);
  if(!token){
    res.status(404).json({message:"No token found"});
  }
  jwt.verify(String(token),Secret_Key,(err,useremail)=>{
    if(err){
      console.log(err);
     return res.status(400).json({message:"Invalid Token"})
    }
    console.log(useremail.id);
    req.id=useremail.id;
    console.log(req.id);
  });
  next();
};
const getUser=async(req,res,next)=>{
  let db_connect = dbo.getDb();
const userId =req.id;
console.log("hii");
let user;
const testModel = new loginModel({
  _id:userId
})
try{
  console.log(testModel);
  user =   await db_connect.collection("login").findOne(testModel)
  if(user=== undefined || user===null){
    return res.send({message:"User does not exist"});
  }
  // console.log(user);
}catch(err){
  return new Error(err)
}
if(!user){
  return res.status(404).json({message:"User not found"});
}
console.log(user);
return res.status(200).json({user});

};
module.exports = { verifyToken,login,getUser };

