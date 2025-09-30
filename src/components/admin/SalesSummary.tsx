

interface SalesSummaryProps {
  items: { product: string; quantity: number }[];
}

export default function SalesSummary({ items }: SalesSummaryProps) {
  return (
    <div className="w-1/2 border rounded-xl p-6">
      <h2 className="font-semibold text-lg mb-4">Resumen de Venta</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">No hay productos agregados</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex justify-between border-b pb-1 text-sm"
            >
              <span>{item.product} x {item.quantity}</span>
              <span className="text-gray-600">Cantidad: {item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
