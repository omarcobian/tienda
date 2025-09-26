export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (email !== "admin@pos.com" || password !== "admin123") {
    return Response.json({ message: "Credenciales inválidas" }, { status: 401 });
  }
  return Response.json({ message: "Inicio de sesión exitoso" }, { status: 200 });
}