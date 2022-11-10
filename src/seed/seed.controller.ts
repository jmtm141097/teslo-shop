import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/auth/decorators'
import { SeedService } from './seed.service'

@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) {}

    @Get()
    @Auth()
    executeSeed() {
        if (this.seedService.runSeed()) return 'SEED EXECUTED'
        return 'SEED FAIL'
    }
}
