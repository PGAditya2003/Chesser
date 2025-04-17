import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    name: { type: String, required: false },
    rating: { type: Number, required: false },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null }, // Reference to Team
    tournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tournament" }], // Past tournaments
    createdAt: { type: Date, default: Date.now }
});

const Player = mongoose.model("Player", playerSchema);

export default Player;
