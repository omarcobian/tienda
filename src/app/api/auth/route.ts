//importamos primsa desde /lib
import prisma from '@/lib/prisma'
//Hacemos un endpoint para iniciar sesion checando si el usuario ya existe en la base de datos
//Utilizando el metodo POST que recibe un request
//y extraemos el email y password del body
//Luego usamos prisma para buscar un usuario con roll ADMIN o USER
//Finalmente retornamos un mensaje de exito o error en formato JSON

export async function POST(req: Request){//tiene que ser una funcion asincrona porque vamos a hacer operaciones con la base de datos
  const {email, password} = await req.json()//declaramos una constante que extrae el email y password del body del request
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
