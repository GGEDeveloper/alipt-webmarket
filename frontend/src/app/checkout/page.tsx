"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cartao");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          total: totalPrice,
          shippingAddress,
          paymentMethod,
        }),
      });
      if (!res.ok) throw new Error("Erro ao processar o pedido.");
      const data = await res.json();
      alert("Pedido realizado com sucesso!");
      clearCart();
      router.push(`/orders/${data.orderId}`);
    } catch (err) {
      console.error("Erro no checkout:", err);
      setError("Erro ao processar o pedido.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
            <p>Total: €{totalPrice.toFixed(2)}</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Endereço de Entrega:</label>
              <Input
                placeholder="Digite seu endereço"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Método de Pagamento:</label>
              <select
                className="border rounded p-2 w-full"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cartao">Cartão de Crédito/Débito</option>
                <option value="boleto">Boleto Bancário</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button onClick={handleCheckout} disabled={loading}>
              {loading ? "Processando..." : "Finalizar Pedido"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
