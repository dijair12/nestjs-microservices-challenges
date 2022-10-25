import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChallengeStatus } from './challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenges') private readonly challengeModel: Model<Challenge>,
  ) {}

  private readonly logger = new Logger(ChallengeService.name)

  async challengeCreate(challenge: Challenge): Promise<Challenge> {
    try {
      const createChallenge = new this.challengeModel(challenge)
      createChallenge.dateTimeRequest = new Date()
      createChallenge.status = ChallengeStatus.PENDING
      this.logger.log(`createChallenge: ${JSON.stringify(createChallenge)}`)
      return await createChallenge.save()
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async getAllChallenges(): Promise<Challenge[]> {
    try {
      return await this.challengeModel.find().exec()
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async findChallengesFromPlayer(_id: any): Promise<Challenge[] | Challenge> {
    try {
      return await this.challengeModel.find()
      .where('players')
      .in(_id)
      .exec()
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async findChallengesById (_id: any): Promise<Challenge> {   
    try {
      return await this.challengeModel.findOne({_id})
      .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }

  } 

  async updateChallenge(_id: string, challenge: Challenge ): Promise<void> {
    try {
      challenge.dateTimeAnswer = new Date()             
      await this.challengeModel.findOneAndUpdate({_id},{$set: challenge}).exec()
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

async updateChallengeGame(gameId: string, challenge: Challenge): Promise<void> {
    try {
      challenge.status = ChallengeStatus.REALIZED
      challenge.game = gameId
      await this.challengeModel.findOneAndUpdate({_id: challenge._id},{$set: challenge}).exec()
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async deleteChallenge(challenge: Challenge): Promise<void> {
    try {
      const { _id } = challenge
      challenge.status = ChallengeStatus.CANCELLED
      this.logger.log(`challenge: ${JSON.stringify(challenge)}`)
      await this.challengeModel.findOneAndUpdate({_id},{$set: challenge}).exec() 
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

}
