import { Controller, Get } from '@nestjs/common'
import { SeedService } from './seed.service'

@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) {}

    @Get()
    executeSeed() {
        if (this.seedService.runSeed()) return 'SEED EXECUTED'
        return 'SEED FAIL'
    }
}