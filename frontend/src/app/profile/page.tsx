"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileData {
  name: string;
  email: string;
  // Adicione outros campos do perfil conforme necessário.
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData>({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Preenche os dados do perfil com base na sessão
  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  // Função para atualizar o perfil (exemplo; você precisará de um endpoint no backend para isto)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error(`Falha ao atualizar perfil: ${res.status}`);
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError("Erro ao atualizar perfil.");
    }
    setLoading(false);
  };

  if (status === "loading") return <p>Carregando perfil...</p>;
  if (!session) return <p>Você não está autenticado.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Meu Perfil</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Nome:</label>
          <Input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email:</label>
          <Input
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Seu email"
            disabled
          />
        </div>
        {/* Você pode adicionar outros campos aqui */}
        <Button type="submit" disabled={loading}>
          {loading ? "Atualizando..." : "Atualizar Perfil"}
        </Button>
      </form>
      <div className="mt-4">
        <Button variant="destructive" onClick={() => signOut()}>
          Sair
        </Button>
      </div>
    </div>
  );
}
