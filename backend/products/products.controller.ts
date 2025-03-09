import { Controller, Get, Query, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('availability') availability?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('orderBy') orderBy = 'preco',
    @Query('order') order: 'asc' | 'desc' = 'asc',
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.productsService.getProducts({
      name,
      category,
      brand,
      availability,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      orderBy,
      order,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('filters')
  async getFilterOptions() {
    return this.productsService.getFilterOptions();
  }

  @Get(':product_code')
  async getProductByCode(@Param('product_code') product_code: string) {
    return this.productsService.getProductByCode(product_code);
  }
}
