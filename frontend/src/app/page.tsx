"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

interface Product {
  product_code: string;
  name: string;
  category: string;
  brand: string;
  preco: number;
  availability: string;
  images: string | null;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Buscar produtos destacados
  const fetchFeaturedProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(
        "http://localhost:4000/api/products?page=1&limit=5&orderBy=preco&order=desc"
      );
      if (!res.ok) throw new Error(`Erro: ${res.status}`);
      const data = await res.json();
      setFeaturedProducts(data.products);
    } catch (err) {
      console.error("Erro ao buscar produtos destacados:", err);
      setError("Erro ao buscar produtos destacados.");
    }
    setLoadingProducts(false);
  };

  // Buscar categorias
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch("http://localhost:4000/api/products/filters");
      if (!res.ok) throw new Error("Erro ao buscar categorias.");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
    }
    setLoadingCategories(false);
  };

  // Redireciona para /products já filtrado pela categoria
  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  // Data atual formatada para PT
  const currentDate = new Date().toLocaleDateString("pt-PT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  return (
    <main className="min-h-screen p-6">
      {/* Hero Section */}
      <section className="mb-10 bg-gradient-to-r from-blue-600 to-teal-600 text-white p-10 rounded-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo à ALIPT</h1>
        <p className="text-xl mb-4">
          Sua loja de equipamentos e produtos de qualidade, sempre com as melhores ofertas.
        </p>
        <p className="mb-4">Hoje é {currentDate}</p>
        <Link href="/products">
          <Button className="bg-white text-blue-600 font-bold px-6 py-3 rounded-full">
            Ver Produtos
          </Button>
        </Link>
      </section>

      {/* Categorias */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Categorias</h2>
        {loadingCategories ? (
          <p>Carregando categorias...</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="min-w-[150px] p-4 bg-gray-100 rounded shadow hover:bg-gray-200 transition text-center cursor-pointer"
                >
                  <p className="font-semibold">{cat}</p>
                </div>
              ))
            ) : (
              <p>Nenhuma categoria encontrada.</p>
            )}
          </div>
        )}
      </section>

      {/* Produtos Destacados */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Produtos Destacados</h2>
        {loadingProducts ? (
          <p>Carregando produtos destacados...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.product_code} product={product} />
              ))
            ) : (
              <p>Nenhum produto destacado encontrado.</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
