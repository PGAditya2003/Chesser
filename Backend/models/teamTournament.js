// models/teamTournament.js
import mongoose from "mongoose";

const teamTournamentSchema = new mongoose.Schema({
  tournamentName: String,
  teamSize: Number,
  location: String,
  date: Date,
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  matches: [{
    teamA: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    teamB: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    result: {
      type: String, // "teamA", "teamB", "draw"
      required: true,
    },
  }],
});

const TeamTournament = mongoose.model("TeamTournament", teamTournamentSchema);
export default TeamTournament;
