import mongoose from 'mongoose';

export const ChallengesSchema = new mongoose.Schema({
  dateTimeChallenge: {type: Date},
  status: {type: String},
  dateTimeRequest: {type: Date},
  dateTimeAnswer: {type: Date},
  request: {type: mongoose.Schema.Types.ObjectId},
  category: {type: mongoose.Schema.Types.ObjectId},
  players: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  game: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }]
},{
  timestamps: true,
  collection: 'challenges'
})