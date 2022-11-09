import { Controller, Get, Post, Body, UseGuards, SetMetadata } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { RawHeaders, GetUser } from './decorators'
import { CreateUserDto, LoginUserDto } from './dto'
import { User } from './entities/user.entity'
import { UserRoleGuard } from './guards/user-role.guard'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.create(createUserDto)
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto)
    }

    @Get('private')
    @UseGuards(AuthGuard())
    testingPrivateRoute(@GetUser() user: User, @GetUser('email') userEmail: string, @RawHeaders() melo: string[]) {
        return {
            ok: true,
            user,
            userEmail,
            melo
        }
    }

    @Get('private2')
    @SetMetadata('roles', ['admin', 'super-user'])
    @UseGuards(AuthGuard(), UserRoleGuard)
    privateRoute2(@GetUser() user: User) {
        return {
            ok: true,
            user
        }
    }
}
