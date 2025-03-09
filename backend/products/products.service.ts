import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts({ name, category, brand, availability, minPrice, maxPrice, orderBy, order, page, limit }) {
    const skip = (page - 1) * limit;
    const take = limit;

    const products = await this.prisma.produtos.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        category: category ? { equals: category } : undefined,
        brand: brand ? { equals: brand } : undefined,
        availability: availability ? { contains: availability } : undefined,
        preco: {
          gte: minPrice !== undefined ? minPrice : undefined,
          lte: maxPrice !== undefined ? maxPrice : undefined,
        },
      },
      orderBy: {
        [orderBy]: order,
      },
      skip,
      take,
    });

    const total = await this.prisma.produtos.count({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        category: category ? { equals: category } : undefined,
        brand: brand ? { equals: brand } : undefined,
        availability: availability ? { contains: availability } : undefined,
        preco: {
          gte: minPrice !== undefined ? minPrice : undefined,
          lte: maxPrice !== undefined ? maxPrice : undefined,
        },
      },
    });

    // Ajustar o caminho das imagens: remover o prefixo "imagestest2\" ou "imagestest2/"
    const productsWithImages = products.map(product => ({
      ...product,
      images: product.images
        ? `http://localhost:4000/images/${product.images.replace(/^imagestest2[\\/]/, "")}`
        : null,
    }));

    return { products: productsWithImages, total };
  }

  async getFilterOptions() {
    const categoriesGroup = await this.prisma.produtos.groupBy({
      by: ['category'],
    });
    const brandsGroup = await this.prisma.produtos.groupBy({
      by: ['brand'],
    });
    const availabilitiesGroup = await this.prisma.produtos.groupBy({
      by: ['availability'],
    });

    return {
      categories: categoriesGroup.map(g => g.category).filter(Boolean),
      brands: brandsGroup.map(g => g.brand).filter(Boolean),
      availabilities: availabilitiesGroup.map(g => g.availability).filter(Boolean),
    };
  }

  async getProductByCode(product_code: string) {
    const product = await this.prisma.produtos.findUnique({
      where: { product_code },
    });
    if (!product) return null;
    return {
      ...product,
      images: product.images ? `http://localhost:4000/images/${product.images.replace(/^imagestest2[\\/]/, "")}` : null,
    };
  }
}
