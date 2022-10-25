import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from 'src/challenge/interfaces/challenge.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { Game } from './interfaces/game.interface';
import { lastValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GameService {
  constructor(
    @InjectModel('Game') private readonly gameModel: Model<Game>,
    private clientProxySmartRanking: ClientProxySmartRanking
  ) {}

  private readonly logger = new Logger(GameService.name)

  private clientChallenges = 
    this.clientProxySmartRanking.getClientProxyChallengesInstance()

  async createGame(game: Game): Promise<Game> {
    try {
      /*
          Iremos persistir a game e logo em seguida atualizaremos o
          desafio. O desafio irá receber o ID da game e seu status
          será modificado para REALIZADO.
      */
      const gameCreate = new this.gameModel(game)
      this.logger.log(`gameCreate: ${JSON.stringify(gameCreate)}`)
      /*
          Recuperamos o ID da game
      */
      const result = await gameCreate.save()
      this.logger.log(`result: ${JSON.stringify(result)}`)
      const gameId = result._id
      /*
          Com o ID do desafio que recebemos na requisição, recuperamos o 
          desafio.
      */     
      const challenge: Challenge = 
        await lastValueFrom(this.clientChallenges
          .send('get-challenge', { 
            playerId: '', _id: game.challenge
          }))
      /*
          Acionamos o tópico 'atualizar-desafio-game' que será
          responsável por atualizar o desafio.
      */
      return await lastValueFrom(
        this.clientChallenges
          .emit('update-challenge-game', {
            gameId: gameId, challenge: challenge 
          })
      )
        
    } catch (error) {
        this.logger.error(`error: ${JSON.stringify(error.message)}`)
        throw new RpcException(error.message)
    }
  }

}
