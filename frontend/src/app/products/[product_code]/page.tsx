"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";

interface Product {
  product_code: string;
  name: string;
  category: string;
  brand: string;
  preco: number;
  availability: string;
  images: string | null;
  description: string;
  technical_data: string | null;
  product_features: string | null;
  package_contents: string | null;
  url: string | null;
  ean: string;
}

export default function ProductPage() {
  const { product_code } = useParams() as { product_code: string };
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Função para construir a URL da imagem
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return "/placeholder.jpg";
    // Se a imagem já estiver com URL completa, use-a
    if (imagePath.startsWith("http")) return imagePath;
    // Caso contrário, constrói a URL removendo o prefixo "imagestest2/"
    return `http://localhost:4000/images/${imagePath.replace(/^imagestest2[\\/]/, "")}`;
  };

  const fetchProduct = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:4000/api/products/${product_code}`);
      if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
      const data: Product = await res.json();
      setProduct(data);
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      setError("Erro ao buscar produto.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (product_code) {
      fetchProduct();
    }
  }, [product_code]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        product_code: product.product_code,
        name: product.name,
        price: product.preco,
        quantity: quantity,
        image: getImageUrl(product.images),
      });
      alert("Produto adicionado ao carrinho!");
    }
  };

  if (loading) return <p>Carregando produto...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Nenhum produto encontrado.</p>;

  const imageUrl = getImageUrl(product.images);

  return (
    <div className="p-6">
      <Button onClick={() => router.back()} className="mb-4">
        Voltar
      </Button>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src={imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="object-cover rounded"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 text-lg">{product.category}</p>
          <p className="text-green-500 font-bold text-2xl">€{product.preco.toFixed(2)}</p>
          <p className="mt-4">{product.description}</p>
          {product.technical_data && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Dados Técnicos</h2>
              <p>{product.technical_data}</p>
            </div>
          )}
          {product.product_features && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Características</h2>
              <p>{product.product_features}</p>
            </div>
          )}
          {product.package_contents && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Conteúdo da Embalagem</h2>
              <p>{product.package_contents}</p>
            </div>
          )}
          <div className="mt-4">
            <p className="text-sm text-gray-600">Marca: {product.brand}</p>
            <p className="text-sm text-gray-600">EAN: {product.ean}</p>
          </div>
          {/* Seção para selecionar a quantidade e adicionar ao carrinho */}
          <div className="mt-6 flex items-center gap-4">
            <label className="font-semibold">Quantidade:</label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20"
            />
            <Button onClick={handleAddToCart}>Adicionar ao Carrinho</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
