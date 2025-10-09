"use client"

import { useState, useEffect } from "react"
import { Button } from "@components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/Card"
import { Input } from "@components/ui/Input"
import { Label } from "@components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/Select"
import { Badge } from "@components/ui/Badge"
import { Trash2, Plus, ShoppingCart, Minus, CreditCard, Banknote, Bike, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@components/ui/Alert"
import {useAuth} from "@hooks/useAuth"
import { useProducts } from "@/hooks/useProducts"
import type { ProductWithId } from '@/types';
import { ProductSelectionModal } from "@components/ventas/Product-selection-modal"


interface SaleItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  total: number
}


export function SalesRegistration() {
  const { 
    products, 
    loading, 
    error, 
    createProduct,
    clearError,
    deleteProduct,
    updateProduct
  } = useProducts()
  const { user } = useAuth()
  const [apiProducts, setApiProducts] = useState<ProductWithId[]>([])
  const [items, setItems] = useState<SaleItem[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [quantity, setQuantity] = useState("1")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "delivery">()
  const [deliveryPlatform, setDeliveryPlatform] = useState("")
  const [success, setSuccess] = useState("")
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    setApiProducts(products)
  }

  const addProductToSale = (product: ProductWithId) => {
    const qty = Number.parseInt(quantity)
    if (qty <= 0 || isNaN(qty)) return

    const total = product.price * qty

    const newItem: SaleItem = {
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      total,
    }

    setItems([...items, newItem])
    setQuantity("1") // Reset quantity to 1 after adding
  }

  const incrementQuantity = () => {
    const currentQty = Number.parseInt(quantity) || 1
    setQuantity((currentQty + 1).toString())
  }

  const decrementQuantity = () => {
    const currentQty = Number.parseInt(quantity) || 1
    if (currentQty > 1) {
      setQuantity((currentQty - 1).toString())
    }
  }

  const removeItem = (id: string) => {
    setRemovingItemId(id)
    setTimeout(() => {
      setItems(items.filter((item) => item.id !== id))
      setRemovingItemId(null)
    }, 300)
  }

  const updateQuantity = (id: string, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta)
          return {
            ...item,
            quantity: newQuantity,
            total: item.price * newQuantity,
          }
        }
        return item
      }),
    )
  }

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const completeSale = () => {
    if (items.length === 0 || !paymentMethod) return

    const sale = {
      id: Date.now().toString(),
      items,
      total: getTotalAmount(),
      paymentMethod,
      deliveryPlatform: paymentMethod === "delivery" ? deliveryPlatform : null,
      employeeId: user?.id ?? "",
      employeeName: user?.name ?? "",
      store: user?.store ?? "",
      date: new Date().toISOString(),
    }

    const existingSales = JSON.parse(localStorage.getItem("pos-sales") || "[]")
    localStorage.setItem("pos-sales", JSON.stringify([...existingSales, sale]))

    setItems([])
    setPaymentMethod(undefined)
    setDeliveryPlatform("")
    setSuccess("Venta registrada exitosamente")
    setTimeout(() => setSuccess(""), 3000)
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background p-6 rounded-2xl border border-gray-200 shadow-md space-y-6">
      <div className="flex items-center space-x-2">
        <ShoppingCart className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Registrar Nueva Venta</h2>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agregar Productos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Cantidad a Agregar
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 shrink-0 bg-white"
                  onClick={decrementQuantity}
                  disabled={Number.parseInt(quantity) <= 1}
                >
                  <Minus className="h-6 w-6" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="h-14 text-center text-2xl font-bold bg-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 shrink-0 bg-white"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
              <p className="text-xs text-gray-600 text-center">Selecciona la cantidad y luego elige el producto</p>
            </div>

            <Button
              variant="default"
              size="lg"
              className="w-full h-20 text-lg"
              onClick={() => setShowProductModal(true)}
              disabled={products.length === 0}
            >
              <ShoppingCart className="h-6 w-6 mr-2" />
              Seleccionar Producto ({quantity} {Number.parseInt(quantity) === 1 ? "unidad" : "unidades"})
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Carrito de Venta</CardTitle>
              {items.length > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {items.length} {items.length === 1 ? "producto" : "productos"}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">El carrito está vacío</p>
                  <p className="text-sm text-gray-400">Agrega productos para comenzar</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 bg-white border border-gray-200 shadow-xl rounded-lg hover:shadow-md transition-all duration-300 ${
                      removingItemId === item.id
                        ? "animate-out fade-out slide-out-to-right-2"
                        : "animate-in fade-in slide-in-from-left-2"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">${item.price.toFixed(2)} c/u</p>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 hover:bg-green-700">${item.total.toFixed(2)}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">${getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {items.length > 0 && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="text-base">Finalizar Venta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Método de Pago</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  className="h-20 flex-col gap-2"
                  onClick={() => setPaymentMethod("cash")}
                >
                  <Banknote className="h-6 w-6" />
                  <span className="text-sm">Efectivo</span>
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  className="h-20 flex-col gap-2"
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm">Tarjeta</span>
                </Button>
                <Button
                  variant={paymentMethod === "delivery" ? "default" : "outline"}
                  className="h-20 flex-col gap-2"
                  onClick={() => setPaymentMethod("delivery")}
                >
                  <Bike className="h-6 w-6" />
                  <span className="text-sm">Delivery</span>
                </Button>
              </div>
            </div>

            {paymentMethod === "delivery" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
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
              size="lg"
              className="w-full text-lg h-14 bg-green-600 hover:bg-green-700"
              disabled={!paymentMethod || (paymentMethod === "delivery" && !deliveryPlatform)}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Completar Venta - ${getTotalAmount().toFixed(2)}
            </Button>
          </CardContent>
        </Card>
      )}

      <ProductSelectionModal
        open={showProductModal}
        onOpenChange={setShowProductModal}
        products={products}
        onSelectProduct={(product) => {
          addProductToSale(product)
          setShowProductModal(false)
        }}
      />
    </div>
  )
}
