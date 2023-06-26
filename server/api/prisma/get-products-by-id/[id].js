import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
    let items = await prisma.products.findUnique({

        where: {
            id: event.context.params.id,
        }
    })
    return items
})