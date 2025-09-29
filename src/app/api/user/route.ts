//importamos primsa desde /lib
import prisma from '@/lib/prisma'
//hacemos los get y post de admin

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const admin = await prisma.user.create({
    //agregamos sus credenciales y el roll
    data: {
      email,
      password,
      roll: "USER",
    },
  })
  return Response.json(admin)
}