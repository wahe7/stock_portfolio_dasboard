const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { execFile } = require('child_process');
const redisClient = require('../utils/redis_client');

exports.addPortfolio = async(req,res)=>{
    const {userId,stockName,stockExchange,stockQuantity,stockPurchasePrice}=req.body;
    if(!userId || !stockName || !stockExchange || !stockQuantity || !stockPurchasePrice){
        return res.status(400).json({message:"All fields are required"})
    }
    
    const symbol = stockExchange==="NSE"?stockName+".NS":stockName+".BO";

    const scriptPath = './utils/fetchCMP.py';
    
    const fetchSector = await new Promise((resolve, reject) => {
      execFile("python", [scriptPath, symbol], (error, stdout, stderr) => {
        if (error) {
          console.error('Python Error:', stderr);
          return res.status(500).json({ message: 'Error fetching CMP', error });
        }
        const cmpData = JSON.parse(stdout);

        if(!cmpData){
          return res.status(400).json({message:"Not valid stock"})
        }
        resolve(cmpData[symbol]?.sector);
      });
    });
    try{
        const portfolio = await prisma.portfolio.create({
            data:{
                userId,
                stockName:symbol,
                stockExchange,
                stockQuantity,
                stockPurchasePrice,
                stockSector:fetchSector,
            }
        })
        res.status(200).json({message:"Portfolio added successfully"})
    }catch(error){
        res.status(400).json({message:"Something went wrong",error:error})
    }
}

exports.getPortfolio = async(req,res)=>{
    const {userId}=req.params;

    try{
        const portfolio = await prisma.portfolio.findMany({
            where:{
                userId:parseInt(userId)
            }
        });

        const symbols = portfolio.map(portfolio => portfolio.stockName);
        const scriptPath = './utils/fetchCMP.py';
        const cached = await redisClient.get(symbols.join(','));
        if(cached){
          const cmpData = JSON.parse(cached);

          const userPortfolio = portfolio.map(stock => {
            const cmp = cmpData[stock.stockName]?.cmp || 0;
            const investment = stock.stockPurchasePrice * stock.stockQuantity;
            const presentValue = (cmp * stock.stockQuantity).toFixed(2);
            const gainLoss = presentValue - investment;
            const recommendation = cmpData[stock.stockName]?.recommendation || "";
            const name = cmpData[stock.stockName]?.name || "";
            const pe = cmpData[stock.stockName]?.pe.toFixed(2) || 0;

            return {
              id: stock.id,
              name: name,
              quantity: stock.stockQuantity,
              purchasePrice: stock.stockPurchasePrice,
              investment: investment,
              cmp: cmp,
              presentValue: presentValue,
              sector:stock.stockSector,
              gainLoss: gainLoss,
              recommendation:recommendation,
              pe:pe
            };
          });
          res.status(200).json({message:"Portfolio fetched successfully",userPortfolio})
        }else{

          execFile("python", [scriptPath, ...symbols], (error, stdout, stderr) => {
            if (error) {
              console.error('Python Error:', stderr);
              return res.status(500).json({ message: 'Error fetching CMPs', error });
            }
            const cmpData = JSON.parse(stdout);
            redisClient.setEx(symbols.join(','), 30, JSON.stringify(cmpData));

            const userPortfolio = portfolio.map(stock => {
              const cmp = cmpData[stock.stockName]?.cmp || 0;
              const investment = stock.stockPurchasePrice * stock.stockQuantity;
              const presentValue = (cmp * stock.stockQuantity).toFixed(2);
              const gainLoss = presentValue - investment;
              const recommendation = cmpData[stock.stockName]?.recommendation || "";
              const name = cmpData[stock.stockName]?.name || "";
              const pe = cmpData[stock.stockName]?.pe.toFixed(2) || 0;

              return {
                id: stock.id,
                name: name,
                quantity: stock.stockQuantity,
                purchasePrice: stock.stockPurchasePrice,
                investment: investment,
                cmp: cmp,
                presentValue: presentValue,
                sector:stock.stockSector,
                gainLoss: gainLoss,
                recommendation:recommendation,
                pe:pe
              };
            });
            res.status(200).json({userPortfolio})
          });
        }
    }catch(error){
        res.status(400).json({message:"Something went wrong",error:error})
    }
};

exports.deleteStock = async(req,res)=>{
  const {userId,stockId}=req.params;
  const stock = await prisma.portfolio.findUnique({
    where:{
      id:parseInt(stockId),
      userId:parseInt(userId)
    }
  })
  if(!stock){
    return res.status(400).json({message:"Stock not found"})
  }
  try{
    const portfolio = await prisma.portfolio.delete({
      where:{
        id:parseInt(stockId),
        userId:parseInt(userId)
      }
    })
    res.status(200).json({message:"Portfolio deleted successfully"})
  }catch(error){
    res.status(400).json({message:"Something went wrong",error:error})
  }
}

exports.editStock = async(req,res)=>{
  const {userId,stockId}=req.params;
  const stock = await prisma.portfolio.findUnique({
    where:{
      id:parseInt(stockId),
      userId:parseInt(userId)
    }
  })
  if(!stock){
    return res.status(400).json({message:"Stock not found"})
  }
  try{
    const portfolio = await prisma.portfolio.update({
      where:{
        id:parseInt(stockId),
        userId:parseInt(userId)
      },
      data:{
        stockQuantity:req.body.stockQuantity,
        stockPurchasePrice:req.body.stockPurchasePrice
      }
    })
    res.status(200).json({message:"Portfolio updated successfully"})
  }catch(error){
    res.status(400).json({message:"Something went wrong",error:error})
  }
}