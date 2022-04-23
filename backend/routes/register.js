const {Router} = require("express");
const {registration,testregistration} = require("../controllers/register")
const registerRouter = Router();
registerRouter.post("/",registration)
registerRouter.post("/testCases",testregistration)
module.exports = {registerRouter}