import Image from 'next/image';

const categories = [
    { name: "Ferramentas", image: "/categories/tools.jpg" },
    { name: "Equipamentos", image: "/categories/equipment.jpg" },
    { name: "Acessórios", image: "/categories/accessories.jpg" },
  ];
  
  const Categories = () => {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-semibold text-center">Categorias</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="text-center">
              <Image src="/images/example.jpg" alt="Example" width={300} height={200} />;
              <p className="mt-2 text-lg font-medium">{category.name}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default Categories;
  