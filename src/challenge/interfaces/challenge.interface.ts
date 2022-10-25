import Document from 'mongoose';
import { ChallengeStatus } from '../challenge-status.enum';

export interface Challenge extends Document {
  _id?: string;
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  dateTimeRequest: Date;
  dateTimeAnswer: Date;
  request: string;
  category: string;
  game: string;
  players: string[];  
}
