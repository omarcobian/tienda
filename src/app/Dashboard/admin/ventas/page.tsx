import { SalesRegistration } from "@/components/ventas/VentasPage";
export default function page() {
  

  return (
   //El componente siempre va dentro de un div y dentro de un return porque vamos a utilizar css con tailwind
        <div className="flex items-center justify-center py-4 ">
            <SalesRegistration/>

        </div>
  )
}
