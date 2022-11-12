import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/decorators'
import { SeedService } from './seed.service'

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) {}

    @Get()
    executeSeed() {
        if (this.seedService.runSeed()) return 'SEED EXECUTED'
        return 'SEED FAIL'
    }
}
