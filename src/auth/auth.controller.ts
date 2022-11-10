import { Controller, Get, Post, Body, UseGuards, SetMetadata } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { RawHeaders, GetUser, RoleProtected, Auth } from './decorators'
import { CreateUserDto, LoginUserDto } from './dto'
import { User } from './entities/user.entity'
import { UserRoleGuard } from './guards/user-role.guard'
import { ValidRoles } from './interfaces'

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

    // @SetMetadata('roles', ['admin', 'super-user'])
    @Get('private2')
    @RoleProtected(ValidRoles.superUser)
    @UseGuards(AuthGuard(), UserRoleGuard)
    privateRoute2(@GetUser() user: User) {
        return {
            ok: true,
            user
        }
    }

    @Get('private3')
    @Auth(ValidRoles.admin)
    privateRoute3(@GetUser() user: User) {
        return {
            ok: true,
            user
        }
    }
}
