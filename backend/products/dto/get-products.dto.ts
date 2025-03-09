// backend/products/dto/get-products.dto.ts
export class GetProductsDto {
    page?: number;
    limit?: number;
    order?: string;
    name?: string;
    category?: string;
    brand?: string;
    availability?: string;
    minPrice?: string;
    maxPrice?: string;
  }
  