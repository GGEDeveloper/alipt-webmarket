"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  product_code: string;
  name: string;
  category: string;
  brand: string;
  preco: number;
  availability: string;
  description: string;
  technical_data: string | null;
  product_features: string | null;
  package_contents: string | null;
  images: string | null;
  url: string | null;
}

export default function EditProductPage() {
  const { product_code } = useParams() as { product_code: string };
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Campos do formulário
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [preco, setPreco] = useState("");
  const [availability, setAvailability] = useState("");
  const [description, setDescription] = useState("");
  const [technicalData, setTechnicalData] = useState("");
  const [productFeatures, setProductFeatures] = useState("");
  const [packageContents, setPackageContents] = useState("");
  const [images, setImages] = useState("");
  const [urlField, setUrlField] = useState("");

  // Função para construir a URL da imagem
  const getImageUrl = (imagePath: string | null) => {
    return imagePath ? imagePath : "/placeholder.jpg";
  };

  const fetchProduct = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:4000/api/products/${product_code}`);
      if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
      const data: Product = await res.json();
      setProduct(data);
      setName(data.name);
      setCategory(data.category);
      setBrand(data.brand);
      setPreco(data.preco.toString());
      setAvailability(data.availability);
      setDescription(data.description);
      setTechnicalData(data.technical_data || "");
      setProductFeatures(data.product_features || "");
      setPackageContents(data.package_contents || "");
      setImages(data.images || "");
      setUrlField(data.url || "");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:4000/api/products/${product_code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          brand,
          preco: Number(preco),
          availability,
          description,
          technical_data: technicalData,
          product_features: productFeatures,
          package_contents: packageContents,
          images,
          url: urlField,
        }),
      });
      if (!res.ok) throw new Error(`Erro na atualização: ${res.status}`);
      alert("Produto atualizado com sucesso!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      setError("Erro ao atualizar produto.");
    }
    setLoading(false);
  };

  if (loading) return <p>Carregando produto...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Nenhum produto encontrado.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Editar Produto: {product.product_code}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Nome:</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">Categoria:</label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">Marca:</label>
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">Preço (€):</label>
          <Input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">Disponibilidade:</label>
          <Input value={availability} onChange={(e) => setAvailability(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">Descrição:</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">Dados Técnicos:</label>
          <Input value={technicalData} onChange={(e) => setTechnicalData(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">Características:</label>
          <Input value={productFeatures} onChange={(e) => setProductFeatures(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">Conteúdo da Embalagem:</label>
          <Input value={packageContents} onChange={(e) => setPackageContents(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">Caminho da Imagem:</label>
          <Input value={images} onChange={(e) => setImages(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">URL Externa:</label>
          <Input value={urlField} onChange={(e) => setUrlField(e.target.value)} />
        </div>
        <Button type="submit" disabled={loading}>
          Salvar Alterações
        </Button>
      </form>
      <Button onClick={() => router.back()} className="mt-4">
        Voltar
      </Button>
    </div>
  );
}
