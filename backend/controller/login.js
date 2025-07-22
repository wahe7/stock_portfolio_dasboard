const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.login = async(req,res)=>{
    const {email,password}=req.body;

    try{
        const user = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        if(user.password !== password){
            return res.status(400).json({message:"Incorrect password"})
        }
        res.status(200).json({message:"User logged in successfully",id:user.id})
    }catch(error){
        res.status(400).json({message:"Something went wrong",error:error})
    }
}