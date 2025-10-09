"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/Dialog"
import { Input } from "@components/ui/Input"
import { Button } from "@components/ui/Button"
import { Badge } from "@components/ui/Badge"
import { Search, Package } from "lucide-react"
import { ScrollArea } from "@components/ui/Scroll-area"
import { ProductWithId } from "@/types"


interface ProductSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: ProductWithId[]
  onSelectProduct: (product: ProductWithId) => void
}

export function ProductSelectionModal({ open, onOpenChange, products, onSelectProduct }: ProductSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)))
    return cats.sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [products, searchQuery, selectedCategory])

  const productsByCategory = useMemo(() => {
    return filteredProducts.reduce(
      (acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = []
        }
        acc[product.category].push(product)
        return acc
      },
      {} as Record<string, ProductWithId[]>,
    )
  }, [filteredProducts])

  const handleSelectProduct = (product: ProductWithId) => {
    onSelectProduct(product)
    onOpenChange(false)
    setSearchQuery("")
    setSelectedCategory(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Seleccionar Producto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todas ({products.length})
            </Button>
            {categories.map((category) => {
              const count = products.filter((p) => p.category === category).length
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category} ({count})
                </Button>
              )
            })}
          </div>

          <ScrollArea className="h-[450px] pr-4">
            {Object.keys(productsByCategory).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No se encontraron productos</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-sm text-gray-700 mb-3 sticky top-0 bg-white py-2 border-b z-10">
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categoryProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="group border rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left p-4 hover:bg-blue-50"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm leading-tight group-hover:text-blue-600 transition-colors">
                                {product.name}
                              </h4>
                            </div>
                            {product.description && (
                              <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                            )}
                            <Badge className="bg-green-600 hover:bg-green-700">${product.price.toFixed(2)}</Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
