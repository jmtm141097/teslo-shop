import {
    BadGatewayException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { validate as isUUID } from 'uuid'

import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationDTO } from 'src/common/dtos/pagination.dto'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {
    private readonly logger = new Logger('ProductsService')

    constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {}

    async create(createProductDto: CreateProductDto) {
        try {
            const product = this.productRepository.create(createProductDto)
            await this.productRepository.save(product)
            return product
        } catch (error) {
            this.handleDBExceptions(error)
        }
    }

    async findAll({ limit = 10, offset = 0 }: PaginationDTO) {
        return await this.productRepository.find({
            take: limit,
            skip: offset
        })
    }

    async findOne(term: string) {
        let product: Product

        if (isUUID(term)) {
            product = await this.productRepository.findOneBy({ id: term })
        } else {
            const queryBuilder = this.productRepository.createQueryBuilder()
            product = await queryBuilder
                .where('UPPER(title) =:title or slug =:slug', {
                    title: term.toUpperCase(),
                    slug: term
                })
                .getOne()
        }

        if (!product) throw new NotFoundException(`Product with ${term} not found`)
        return product
    }

    update(id: number, updateProductDto: UpdateProductDto) {
        return `This action updates a #${id} product`
    }

    async remove(id: string) {
        const product = await this.findOne(id)
        await this.productRepository.remove(product)
    }

    private handleDBExceptions(error: any) {
        if (error.code === '23505') throw new BadGatewayException(error.detail)
        this.logger.error(error)
        throw new InternalServerErrorException('Aiuda')
    }
}
