//importamos primsa desde /lib
import prisma from '@/lib/prisma'

//Hacemos un post para saber si el usuario existe
export async function POST(req: Request){
  const {email, password} = await req.json()
  var user = await prisma.user.findUnique({
    where: { email: email, password: password, roll: "ADMIN"}//Buscamos el usuario con roll admin
  })
  if(user){return Response.json({message: "Inicio de sesión exitoso" }, { status: 200 })}//Si existe y es admiin enviamos estatus 200

  user = await prisma.user.findUnique({
    where: { email: email, password: password, roll: "USER"}//Buscamos el usuario con roll user
  })
  if(user){return Response.json({message: "Inicio de sesión exitoso" }, { status: 200 })}//Si existe y es user enviamos estatus 200 

  return Response.json({message: "Credenciales inválidas" }, { status: 401 })//Si no existe enviamos estatus 401 
}
