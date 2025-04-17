// models/team.js
import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  captain: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: false },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  gamesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Team = mongoose.model("Team", teamSchema);

export default Team;
