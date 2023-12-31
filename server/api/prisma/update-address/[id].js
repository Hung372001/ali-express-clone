import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
    const body = await readBody()
   const res = await prisma.addresses.update({
       where:{
           id: event.context.params.id
       },
       data:{
           name:body.name,
           address:body.address,
           zipcode:body.zipcode,
           city:body.city,
           country:body.country
       }
   })
    return res
})