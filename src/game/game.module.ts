import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GamesSchema } from './interfaces/game.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Game', schema: GamesSchema }]),
    ProxyRMQModule
  ],
  controllers: [GameController],
  providers: [GameService]
}
)
export class GameModule {}
