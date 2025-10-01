//importamos primsa desde /lib
import prisma from '@/lib/prisma'

//Aqui hacemos el edpoint para crear un producto con el metodo POST
//Tambien vamos a mostrar todos los productos con el metodo GET
//vamos a eliminar un producto con el metodo DELETE
//vamos a poder actualizar un producto con el metodo PUT
//Vamos a poder buscar un producto por su id con el metodo GET

export async function POST(req: Request) {
  try {
    const { nameProduct, price, category } = await req.json();

    // Validación simple
    if (!nameProduct || !price || !category) {
      return Response.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Crear producto
    const product = await prisma.product.create({
      data: {
        nameProduct,
        price: parseFloat(price), // en caso de que venga como string
        category,
      },
    });

    return Response.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creando producto:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
