//importamos primsa desde /lib
import prisma from '@/lib/prisma'
//Hacemos un endpoint para crear un admin nuevo
//Utilizando el metodo POST que recibe un request
//y extraemos el email y password del body
//Luego usamos prisma para crear un usuario con roll ADMIN
//Finalmente retornamos el admin creado en formato JSON

export async function POST(req: Request) {//tiene que ser una funcion asincrona porque vamos a hacer operaciones con la base de datos
  const { email, password } = await req.json()//declaramos una constante que extrae el email y password del body del request
  const admin = await prisma.user.create({//declaramos una constante que crea un usuario en la base de datos
    //agregamos sus credenciales y el roll
    data: {
      email,
      password,
      roll: "ADMIN",
    },
  })
  return Response.json(admin)//retornamos el admin creado en formato JSON
}