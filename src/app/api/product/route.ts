//importamos primsa desde /lib
import prisma from '@/lib/prisma'

//Aqui hacemos el edpoint para crear un producto con el metodo POST
//Tambien vamos a mostrar todos los productos con el metodo GET
//vamos a eliminar un producto con el metodo DELETE
//vamos a poder actualizar un producto con el metodo PUT
//Vamos a poder buscar un producto por su id con el metodo GET

export async function POST(req: Request) {
  try {
    const { name, price, category } = await req.json();

    // Validación simple
    if (!name || !price || !category) {
      return Response.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Crear producto
    const product = await prisma.product.create({
      data: {
        price: parseFloat(price), // en caso de que venga como string
        name,
        category,
        date: new Date().toISOString(),
        status: "Activo",
      },
    });

    return Response.json(product, { status: 200 });
  } catch (error) {
    console.error("Error creando producto:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return Response.json(products, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Validación simple
    if (!id) {
      return Response.json(
        { error: "El ID es obligatorio" },
        { status: 400 }
      );
    }

    // Eliminar producto
    const product = await prisma.product.delete({
      where: {
        id: id,
      },
    });

    return Response.json(product, { status: 200 });
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, price, category } = await req.json();

    // Validación simple
    if (!id || !name || !price || !category) {
      return Response.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Actualizar producto
    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        price: parseFloat(price), // en caso de que venga como string
        name,
        category,
      },
    });

    return Response.json(product, { status: 200 });
  } catch (error) {
    console.error("Error actualizando producto:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}