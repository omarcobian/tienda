// Importamos con el nombre del componente mas la ubicacion
import Admin from "@/components/admin/Admin";

//Funcion para llamar al componente
export default function AdminPage() {
    return (
        //El componente siempre va dentro de un div y dentro de un return porque vamos a utilizar css con tailwind
        <div>
            <Admin />
        </div>
    );
}