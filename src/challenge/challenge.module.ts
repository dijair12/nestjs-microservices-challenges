import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { ChallengesSchema } from './interfaces/challenge.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Challenges', schema: ChallengesSchema }
  ])],
  providers: [ChallengeService],
  controllers: [ChallengeController]

})
export class ChallengeModule {}
