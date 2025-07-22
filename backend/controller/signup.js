const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.signup = async(req,res)=>{
    const {name,email,password}=req.body;

    try{
        const checkUser = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        if(checkUser){
            return res.status(400).json({message:"User already exists"})
        }
          const user = await prisma.user.create({
          data:{
            name,
            email,
            password
          }
        })
        res.status(200).json({message:"User created successfully"})
      }catch(error){

        res.status(400).json({message:"Something went wrong",error:error})
      }
}

