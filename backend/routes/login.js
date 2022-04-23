const {Router}=require("express");
const {login,verifyToken, getUser}=require("../controllers/login")
const loginRouter=Router();
loginRouter.post("/",login)
loginRouter.get("/user",verifyToken,getUser);
module.exports = {loginRouter}
//
