import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler = async (req, res) => {
  const data = req.body

  const market = await prisma.market.findFirst({
    where: {
      address: data?.address,
    }
  });

  let result = 'ok'

  // if (! market) {
  //   result = await prisma.market.create({
  //     data,
  //   })
  // }
  res.json(result)
}

export default handler