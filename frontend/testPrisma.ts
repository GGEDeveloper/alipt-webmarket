import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.products.findMany(); // Busca todos os produtos
  console.log(products);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
