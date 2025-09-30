
import { ShoppingCart, DollarSign, Package, BarChart2, Users } from "lucide-react";

// Props para reusar el componente en el menú
interface MenuCardProps {
  title: string;
  icon: "venta" | "gasto" | "producto" | "reporte" | "usuario";
  active?: boolean;
}

const icons = {
  venta: ShoppingCart,
  gasto: DollarSign,
  producto: Package,
  reporte: BarChart2,
  usuario: Users,
};

export default function MenuCard({ title, icon, active }: MenuCardProps) {
  const Icon = icons[icon];
  return (
    <div
      className={`flex flex-col items-center justify-center border rounded-xl p-6 cursor-pointer 
      ${active ? "border-blue-500 text-blue-600 shadow-md" : "hover:bg-gray-50"}`}
    >
      <Icon size={32} />
      <p className="mt-2 font-medium">{title}</p>
    </div>
  );
}
