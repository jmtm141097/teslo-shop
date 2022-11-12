import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/auth/entities/user.entity'
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProductImage } from './product-image.entity'

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({
        example: '0ac12363-e809-48e4-beac-374455b3fc6f',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string

    @ApiProperty({
        example: 0,
        description: 'Product price'
    })
    @Column('float', { default: 0 })
    price: number

    @ApiProperty({
        example: 'Lorem ipsum',
        description: 'Product description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column({
        type: 'text',
        unique: true
    })
    slug: string

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column({
        type: 'int',
        default: 0
    })
    stock: number

    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Product sizes',
        uniqueItems: true
    })
    @Column({
        type: 'text',
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
        uniqueItems: true
    })
    @Column({
        type: 'text'
    })
    gender: string

    @ApiProperty({
        example: 'seo',
        description: 'Product tags',
        uniqueItems: true
    })
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[]

    @ApiProperty()
    @OneToMany(() => ProductImage, (productImage) => productImage.product, { cascade: true })
    images?: ProductImage[]

    @ManyToOne(() => User, (user) => user.product, { eager: true })
    user: User

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) this.slug = this.title
        this.slug = this.slug.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug.toLocaleLowerCase().replaceAll(' ', '_').replaceAll("'", '')
    }
}
