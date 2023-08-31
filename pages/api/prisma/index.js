import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler = async (req, res) => {
  let result = 'ok'
  const data = req.body

  if (req.method === "POST") {

    const market = await prisma.market.findFirst({
      where: {
        address: data?.address,
      }
    });


    if (! market) {
      data.tokenCount = data.tokenCount.toString()
      result = await prisma.market.create({
        data,
      })
    }
  }

  if (req.method === "GET") {
    try {
      const markets = await prisma.market.findMany({
        where: {
          type: 'token',
        },
        select: {
          address: true
        }
      })

      return res.status(200).json(markets);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
    

    // return markets
  }
  
  res.json(result)
}

export default handler