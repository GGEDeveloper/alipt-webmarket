const featuredProducts = [
    { name: "Chave Inglesa", price: "€19.99", image: "/products/wrench.jpg" },
    { name: "Furadeira Elétrica", price: "€89.99", image: "/products/drill.jpg" },
    { name: "Serra Circular", price: "€149.99", image: "/products/saw.jpg" },
  ];
  
  const FeaturedProducts = () => {
    return (
      <section className="py-12 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center">Destaques</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
              <h3 className="mt-2 text-lg font-medium">{product.name}</h3>
              <p className="text-gray-700">{product.price}</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Comprar
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default FeaturedProducts;
  