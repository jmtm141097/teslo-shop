import { Injectable } from '@nestjs/common'
import { ProductsService } from 'src/products/products.service'

@Injectable()
export class SeedService {
    constructor(private readonly productsService: ProductsService) {}

    async runSeed() {
        this.productsService.deleteAllProducts()
        return true
    }
}
