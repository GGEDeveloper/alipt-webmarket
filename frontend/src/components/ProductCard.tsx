"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";

export interface Product {
  product_code: string;
  name: string;
  category: string;
  brand: string;
  preco: number;
  availability: string;
  images: string | null;
}

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean; // Se verdadeiro, exibe campo de quantidade e botão para adicionar ao carrinho
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showAddToCart = false }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  // Se o backend já retorna a URL completa, basta usá-la; caso contrário, ajuste conforme necessário.
  const getImageUrl = (imagePath: string | null) => {
    return imagePath ? imagePath : "/placeholder.jpg";
  };

  const handleAddToCart = () => {
    addToCart({
      product_code: product.product_code,
      name: product.name,
      price: product.preco,
      quantity: quantity,
      image: getImageUrl(product.images),
    });
    alert("Produto adicionado ao carrinho!");
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition">
      <CardContent className="p-4">
        <Link href={`/products/${product.product_code}`}>
          <div>
            {product.images && (
              <Image
                src={getImageUrl(product.images)}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-500">{product.category}</p>
            <p className="text-green-500 font-bold">€{product.preco.toFixed(2)}</p>
            <p className="text-sm text-gray-600">{product.availability}</p>
          </div>
        </Link>
        {showAddToCart && (
          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border rounded text-center"
            />
            <Button onClick={handleAddToCart} size="sm">
              Adicionar ao Carrinho
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
