import { Document } from 'mongoose';

export interface Game extends Document {
  category: string;
  challenge: string;
  players: string[];
  def: string;
  result: Result[];
}

export interface Result{
  set: string;
}