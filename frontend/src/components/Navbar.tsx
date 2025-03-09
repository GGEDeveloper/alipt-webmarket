"use client"; // Garante que roda no client

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>
        <Link href="/" className="text-lg font-bold">
          ALIPT
        </Link>
      </div>
      <div className="space-x-4 flex items-center">
        <Link href="/products" className="hover:underline">
          Produtos
        </Link>
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/profile" className="hover:underline">
          Perfil
        </Link>
        {session ? (
          <button onClick={() => signOut()} className="hover:underline">
            Sair
          </button>
        ) : (
          <Link href="/auth" className="hover:underline">
            Entrar
          </Link>
        )}

        {/* Link do carrinho */}
        <Link href="/cart" className="relative flex items-center">
          <svg className="w-6 h-6 hover:text-gray-400 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
