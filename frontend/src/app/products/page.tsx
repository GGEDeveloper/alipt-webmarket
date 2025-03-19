"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ProductCard, { Product } from "@/components/ProductCard";

interface FilterOptions {
  categories: string[];
  subcategories: string[];
  brands: string[];
  availabilities: string[];
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Carregando produtos...</p>}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    subcategories: [],
    brands: [],
    availabilities: [],
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [availability, setAvailability] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [order] = useState(""); 
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) setCategory(categoryParam);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    const url = `http://localhost:4000/api/products?page=${page}&limit=${limit}&orderBy=preco&order=${order}&name=${encodeURIComponent(
      search
    )}&category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(
      subcategory
    )}&brand=${encodeURIComponent(brand)}&availability=${encodeURIComponent(
      availability
    )}&minPrice=${minPrice}&maxPrice=${maxPrice}`;

    console.log("Buscando produtos na URL:", url);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Erro ao buscar produtos.");
      setProducts([]);
    }
    setLoading(false);
  }, [page, limit, order, search, category, subcategory, brand, availability, minPrice, maxPrice]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products/filters");
      if (!res.ok) throw new Error("Erro ao buscar opções de filtro.");
      const data = await res.json();
      setFilterOptions({
        categories: data.categories || [],
        subcategories: data.subcategories || [],
        brands: data.brands || [],
        availabilities: data.availabilities || [],
      });
    } catch (err) {
      console.error("Erro ao buscar opções de filtro:", err);
      setError("Erro ao buscar opções de filtro.");
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setSubcategory("");
    setBrand("");
    setAvailability("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <div className="flex p-6">
      <aside className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md mr-4">
        <h2 className="text-xl font-bold mb-4">Filtros</h2>
        <div className="mb-3">
          <Input placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="mb-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent>
              {filterOptions.categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-3">
          <Select value={subcategory} onValueChange={setSubcategory}>
            <SelectTrigger><SelectValue placeholder="Sub-categoria" /></SelectTrigger>
            <SelectContent>
              {filterOptions.subcategories.map((sub) => (
                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-3">
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger><SelectValue placeholder="Marca" /></SelectTrigger>
            <SelectContent>
              {filterOptions.brands.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-3">
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger><SelectValue placeholder="Disponibilidade" /></SelectTrigger>
            <SelectContent>
              {filterOptions.availabilities.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-3">
          <Input placeholder="Preço mínimo (€)" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        </div>
        <div className="mb-3">
          <Input placeholder="Preço máximo (€)" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>

        <Button onClick={resetFilters} className="bg-gray-300 px-4 py-2 rounded mt-4 w-full">Resetar Filtros</Button>
      </aside>

      <div className="w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-4">Produtos</h1>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? <p className="text-gray-500">Carregando produtos...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {products.length > 0 ? products.map((product) => (
              <ProductCard key={product.product_code} product={product} showAddToCart={true} />
            )) : <p className="text-gray-500">Nenhum produto encontrado.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
