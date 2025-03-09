"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Product {
  product_code: string;
  name: string;
  category: string;
  brand: string;
  preco: number;
  availability: string;
  images: string | null;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Função para buscar produtos do backend
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:4000/api/products?page=${page}&limit=${limit}&orderBy=preco&order=asc`);
      if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
      const data = await res.json();
      setProducts(data.products);
      setTotalProducts(data.total);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Erro ao buscar produtos.");
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  // Função para construir a URL da imagem
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return "/placeholder.jpg";
    // O backend já retorna a URL completa (sem o prefixo duplicado)
    return imagePath;
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Lateral */}
      <aside className="w-1/5 bg-gray-900 text-white p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Inventário</h2>
        <Link href="/dashboard">
          <Button className="w-full">Visão Geral</Button>
        </Link>
        <Link href="/products/add">
          <Button className="w-full">Adicionar Produto</Button>
        </Link>
        <Link href="/dashboard/reports">
          <Button className="w-full">Relatórios</Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button className="w-full">Configurações</Button>
        </Link>
      </aside>

      {/* Conteúdo Principal */}
      <main className="w-4/5 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-4">Controle de Inventário</h1>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Carregando produtos...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Código</th>
                  <th className="px-4 py-2 border">Nome</th>
                  <th className="px-4 py-2 border">Categoria</th>
                  <th className="px-4 py-2 border">Marca</th>
                  <th className="px-4 py-2 border">Preço (€)</th>
                  <th className="px-4 py-2 border">Disponibilidade</th>
                  <th className="px-4 py-2 border">Imagem</th>
                  <th className="px-4 py-2 border">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.product_code} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-center">{product.product_code}</td>
                      <td className="px-4 py-2 border">{product.name}</td>
                      <td className="px-4 py-2 border">{product.category}</td>
                      <td className="px-4 py-2 border">{product.brand}</td>
                      <td className="px-4 py-2 border text-right">€{product.preco.toFixed(2)}</td>
                      <td className="px-4 py-2 border">{product.availability}</td>
                      <td className="px-4 py-2 border text-center">
                        {product.images && (
                          <Image
                            src={getImageUrl(product.images)}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        <Link href={`/products/${product.product_code}/edit`}>
                          <Button size="sm" className="mb-1">Editar</Button>
                        </Link>
                        {/* Excluir pode ser implementado futuramente */}
                        <Button size="sm" variant="destructive">Excluir</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-2 border" colSpan={8}>Nenhum produto encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        <div className="flex justify-between items-center mt-6">
          <Button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            Página Anterior
          </Button>
          <span>
            Página {page} de {totalPages} ({totalProducts} produtos no total)
          </span>
          <Button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
            Próxima Página
          </Button>
        </div>
      </main>
    </div>
  );
}
