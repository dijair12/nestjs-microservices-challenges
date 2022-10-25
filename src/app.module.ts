import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { ChallengeModule } from './challenge/challenge.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:8Qpn3X3pqC5GMLue@cluster0.ws1vb.mongodb.net/srchallenges?retryWrites=true&w=majority'
    ),
    GameModule,
    ChallengeModule,
    ProxyRMQModule,
    ConfigModule.forRoot({isGlobal: true})
  ]
})
export class AppModule {}
