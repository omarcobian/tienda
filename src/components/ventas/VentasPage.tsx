"use client"

import { useState, useEffect } from "react"
import { Button } from "@components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/Card"
import { Input } from "@components/ui/Input"
import { Label } from "@components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Badge } from "@/components/ui/Badge"
import { Trash2, Plus, ShoppingCart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/Alert"
import { useAuth } from "@hooks/useAuth"
import { ProductSelectionModal } from "@/components/ventas/Product-selection-modal"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  active: boolean
}

interface SaleItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  total: number
}


export function SalesRegistration() {
  const {user} = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<SaleItem[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState("1")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "delivery">()
  const [deliveryPlatform, setDeliveryPlatform] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const savedProducts = JSON.parse(localStorage.getItem("pos-products") || "[]")
    const activeProducts = savedProducts.filter((product: Product) => product.active)
    setProducts(activeProducts)
  }

  const addItem = () => {
    if (!selectedProduct || !quantity) return

    const qty = Number.parseInt(quantity)
    const total = selectedProduct.price * qty

    const newItem: SaleItem = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: qty,
      total,
    }

    setItems([...items, newItem])
    setSelectedProduct(null)
    setQuantity("1")
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }
  if(!user) return null

  const completeSale = () => {
    if (items.length === 0 || !paymentMethod) return

    // Save sale to localStorage (in a real app, this would go to a database)
    const sale = {
      id: Date.now().toString(),
      items,
      total: getTotalAmount(),
      paymentMethod,
      deliveryPlatform: paymentMethod === "delivery" ? deliveryPlatform : null,
      employeeId: user.id,
      employeeName: user.name,
      store: user.store,
      date: new Date().toISOString(),
    }

    const existingSales = JSON.parse(localStorage.getItem("pos-sales") || "[]")
    localStorage.setItem("pos-sales", JSON.stringify([...existingSales, sale]))

    // Reset form
    setItems([])
    setPaymentMethod(undefined)
    setDeliveryPlatform("")
    setSuccess("Venta registrada exitosamente")
    setTimeout(() => setSuccess(""), 3000)
  }

  return (
    <div className="bg-white p-5 border rounded-2xl border-gray-100 shadow-lg space-y-6">
      <div className="flex items-center space-x-2">
        <ShoppingCart className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Registrar Nueva Venta</h2>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {products.length === 0 && (
        <Alert>
          <AlertDescription>
            No hay productos disponibles. Contacta al administrador para agregar productos al catálogo.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white  border-gray-100 shadow-lg p-4 rounded-xl  grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agregar Producto a la Venta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Seleccionar Producto</Label>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-transparent"
                onClick={() => setShowProductModal(true)}
                disabled={products.length === 0}
              >
                {selectedProduct ? (
                  <span className="flex items-center justify-between w-full">
                    <span>{selectedProduct.name}</span>
                    <span className="text-green-600 font-medium">${selectedProduct.price.toFixed(2)}</span>
                  </span>
                ) : (
                  <span className="text-gray-500">Haz clic para seleccionar un producto</span>
                )}
              </Button>
            </div>

            {selectedProduct && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium">{selectedProduct.name}</p>
                <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm font-medium text-green-600">Precio: ${selectedProduct.price.toFixed(2)}</p>
                  <Badge variant="outline">{selectedProduct.category}</Badge>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
              />
            </div>

            <Button
              onClick={addItem}
              className="w-full"
              disabled={!selectedProduct || !quantity || products.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar a la Venta
            </Button>
          </CardContent>
        </Card>

        {/* Sale Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen de Venta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay productos agregados</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">${item.total.toFixed(2)}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Método de Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Seleccionar método de pago</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value: "cash" | "card" | "delivery") => setPaymentMethod(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="card">Tarjeta</SelectItem>
                  <SelectItem value="delivery">Plataforma de Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === "delivery" && (
              <div className="space-y-2">
                <Label>Plataforma de Delivery</Label>
                <Select value={deliveryPlatform} onValueChange={setDeliveryPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uber-eats">Uber Eats</SelectItem>
                    <SelectItem value="rappi">Rappi</SelectItem>
                    <SelectItem value="didi-food">Didi Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              onClick={completeSale}
              className="w-full"
              disabled={!paymentMethod || (paymentMethod === "delivery" && !deliveryPlatform)}
            >
              Completar Venta - ${getTotalAmount().toFixed(2)}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Selection Modal */}
      <ProductSelectionModal
        open={showProductModal}
        onOpenChange={setShowProductModal}
        products={products}
        onSelectProduct={handleProductSelect}
      />
    </div>
  )
}
