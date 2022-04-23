const registerModel = require('../model/register');
const loginModel = require('../model/login');
const bcrypt = require('bcryptjs');
const dbo = require("../db/conn");
const registration = async (req, res) => {
  try {
    let db_connect = dbo.getDb();  
    const {name,email,password}= req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const myobj= new registerModel({
      name,
      email,
      password:hashedPassword,
    });
    const strr =req.body.password;
   if(strr.length>=6){
     return res.status(411).json({message:"password length should be minimum 6"});
   }
   
    const myObj1= new loginModel({
      email,
      password: hashedPassword,
    });

    const useremail = await db_connect.collection("register").findOne({
      email: myobj.email,
    });
    if(useremail?.email === myobj.email){
        res.send({message:"Already registered"})
    }else{
        db_connect.collection("register").insertOne(myobj, function (err, res) {
            if (err) throw err;   
          });
        db_connect.collection("login").insertOne(myObj1,function(err,res){
            if(err) throw err;
        });
        console.table(req.body);
        res.send({message:"Successfully registered"});
        // res.status(200).send("DONE");

    }
    // console.log(useremail?.email+ "<- Found It");
    // //console.log(myobj.email);
    // db_connect.collection("register").insertOne(myobj, function (err, res) {
    //   if (err) throw err;
    // });
 
  } catch (e) {
    res.send(e.message).status(400);
  }
};

const testregistration = async (req, res) => {
  try {
    res.send("test exAMPLE,  HTTP://LOCALHOST:5000/TESTCASES");
  } catch (error) {
    res.send(e.message);
  }
};
module.exports = { registration, testregistration };
