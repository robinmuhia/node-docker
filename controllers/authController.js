const User = require("../models/userModel")
const bcrypt = require("bcryptjs") 

exports.signup = async (req,res) => {
    const {username, password} = req.body
    try{
        const hashedpassword = await bcrypt.hash(password,12)
        const newUser = await User.create({
            username,
            password:hashedpassword,
        })
        req.session.user = newUser
        res.status(201).json({
            status: 'success',
            data : {
                user: newUser
            }
        })
    }
    catch(e){
        res.status(400).json({
            status: 'failed',
            message: 'Invalid credentials'
        })
    }
}

exports.login = async (req,res) =>{
    const {username,password} = req.body
    try{
        const user = await User.findOne({username})
        if(!user){
            return res.status(404).json({
                status : "fail",
                message: "User not found"
            })
        }

        const isCorrectpassword = await bcrypt.compare(password,user.password)
        if(isCorrectpassword){
            req.session.user =  user
            res.status(200).json({
                status:"success"
            })
        }
        else{
            res.status(400).json({
                status: "fail",
                message:"Incorrect username or password"
            })
        }
    }
    catch(e){
        res.status(400).json({
            status: 'failed',
            message: `${e}`
        })
    }
}