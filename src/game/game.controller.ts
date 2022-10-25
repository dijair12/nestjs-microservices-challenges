import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { GameService } from './game.service';
import { Game } from './interfaces/game.interface';

const ackErrors: string[] = ['E11000']

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService){}

    private readonly logger = new Logger(GameController.name)

    @EventPattern('create-game')
    async createGame(
        @Payload() game: Game, 
        @Ctx() context: RmqContext
        ) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            this.logger.log(`game: ${JSON.stringify(game)}`)
            await this.gameService.createGame(game)
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
