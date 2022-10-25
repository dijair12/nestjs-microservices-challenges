import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ChallengeService } from './challenge.service';
import { Challenge } from './interfaces/challenge.interface';

const ackErrors: string[] = ['E11000']

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService){}

  private readonly logger = new Logger(ChallengeController.name)

  @EventPattern('create-challenge')
  async challengeCreate(@Payload() challenge: Challenge, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      this.logger.log(`challenge: ${JSON.stringify(challenge)}`)
      await this.challengeService.challengeCreate(challenge)
      await channel.ack(originalMsg)
    } catch(error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`)
      const filterAckError = ackErrors.filter(
        ackError => error.message.includes(ackError))
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg)
      }
    }
  }

  @MessagePattern('get-challenge')
  async getChallenges(
    @Payload() data: any, 
    @Ctx() context: RmqContext
    ): Promise<Challenge[] | Challenge> {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      const { playerId, _id } = data
      this.logger.log(`data: ${JSON.stringify(data)}`)
      if (playerId) {
        return await this.challengeService.findChallengesFromPlayer(playerId) ;
      } else if (_id) {
        return await this.challengeService.findChallengesById(_id)
      } else {
        return await this.challengeService.getAllChallenges();  
      } 
    } finally {
      await channel.ack(originalMsg)
    }     
  }

  @EventPattern('update-challenge')
  async updateChallenge(
    @Payload() data: any, 
    @Ctx() context: RmqContext
    ) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      this.logger.log(`data: ${JSON.stringify(data)}`)
      const _id: string = data.id
      const challenge: Challenge = data.challenge
      await this.challengeService.updateChallenge(_id, challenge)
      await channel.ack(originalMsg)
    } catch(error) {
      const filterAckError = ackErrors.filter(
        ackError => error.message.includes(ackError)) 
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg)
      }
    }  
  } 

  @EventPattern('update-challenge-game')
  async updateChallengeGame(
    @Payload() data: any, 
    @Ctx() context: RmqContext
    ) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      this.logger.log(`playerId: ${data}`)
      const playerId: string = data.playerId
      const challenge: Challenge = data.challenge
      await this.challengeService.updateChallengeGame(playerId, challenge)
      await channel.ack(originalMsg)
    } catch(error) {
      const filterAckError = ackErrors.filter(
        ackError => error.message.includes(ackError))  
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg)
      }
    }  
  } 

  @EventPattern('delete-challenge')
  async deleteChallenge(@Payload() challenge: Challenge, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      await this.challengeService.deleteChallenge(challenge)
      await channel.ack(originalMsg)
    } catch(error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`)
      const filterAckError = ackErrors.filter(
        ackError => error.message.includes(ackError)) 
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg)
      }
    }
  }

}
