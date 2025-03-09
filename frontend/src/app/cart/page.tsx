"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Carrinho de Compras</h1>
      {cartItems.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <table className="min-w-full border border-gray-200 mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Produto</th>
                <th className="px-4 py-2 border">Preço</th>
                <th className="px-4 py-2 border">Quantidade</th>
                <th className="px-4 py-2 border">Subtotal</th>
                <th className="px-4 py-2 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product_code} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border flex items-center gap-2">
                    <Image src={item.image} alt={item.name} width={50} height={50} className="rounded" />
                    <span>{item.name}</span>
                  </td>
                  <td className="px-4 py-2 border text-right">€{item.price.toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      className="w-16 border rounded text-center"
                      onChange={(e) => updateQuantity(item.product_code, Number(e.target.value))}
                    />
                  </td>
                  <td className="px-4 py-2 border text-right">€{(item.price * item.quantity).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">
                    <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.product_code)}>
                      Remover
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total: €{totalPrice.toFixed(2)}</span>
            <div className="flex gap-4">
              <Button variant="destructive" onClick={clearCart}>Limpar Carrinho</Button>
              <Link href="/checkout">
                <Button>Finalizar Compra</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
