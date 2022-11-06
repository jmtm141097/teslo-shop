import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity'
import { LoginUserDto, CreateUserDto } from './dto'
import { JwtPayload } from './interfaces/jwt-payload.interfaces'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData } = createUserDto

            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10)
            })

            await this.userRepository.save(user)

            delete user.password

            return { ...user, token: this.getJwtToken({ email: user.email }) }
        } catch (error) {
            this.handleDBExceptions(error)
        }
    }

    async login({ email, password }: LoginUserDto) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: { email: true, password: true }
        })

        if (!user) throw new UnauthorizedException('Credentials are not valid (email)')

        if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credentials are not valid')

        return { ...user, token: this.getJwtToken({ email: user.email }) }
    }

    private getJwtToken(payload: JwtPayload) {
        const token = this.jwtService.sign(payload)
        return token
    }

    private handleDBExceptions(error: any): never {
        if (error.code === '23505') throw new BadRequestException(error.detail)
        console.log(error)
        throw new InternalServerErrorException('Please check server logs')
    }
}
