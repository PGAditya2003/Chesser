import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import { connectDB } from "./config/db.js";
import Player from "./models/players.js";
import Team from "./models/team.js";
import TeamTournament from "./models/teamTournament.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Health Check
app.get("/", (req, res) => {
  res.send("Chess Tournament API is running 🏁");
});

// Create a Player
app.post("/api/players", async (req, res) => {
  try {
    const { name, rating, team } = req.body;
    const newPlayer = new Player({ name, rating, team: team || null });
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Player
app.patch("/api/players/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid player ID format" });
    }

    const updatedPlayer = await Player.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedPlayer) return res.status(404).json({ error: "Player not found" });

    res.json(updatedPlayer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Player
app.delete("/api/players/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid player ID format" });
    }

    const deletedPlayer = await Player.findByIdAndDelete(id);
    if (!deletedPlayer) return res.status(404).json({ error: "Player not found" });

    res.json({ message: "Player deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a Team
app.post("/api/teams", async (req, res) => {
  try {
    const { name, captainId, playerIds = [] } = req.body;

    if (captainId && !mongoose.Types.ObjectId.isValid(captainId)) {
      return res.status(400).json({ error: "Invalid captain ID format" });
    }

    if (!playerIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: "Invalid player ID(s) format" });
    }

    const captain = await Player.findById(captainId);
    if (!captain) return res.status(400).json({ error: "Captain not found" });

    const team = new Team({ name, captain: captainId, players: playerIds });
    await team.save();

    await Player.updateMany({ _id: { $in: playerIds } }, { team: team._id });

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Team
app.patch("/api/teams/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, captainId, playerIds = [] } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid team ID format" });
    }

    if (captainId && !mongoose.Types.ObjectId.isValid(captainId)) {
      return res.status(400).json({ error: "Invalid captain ID format" });
    }

    if (!playerIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: "Invalid player ID(s) format" });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      { name, captain: captainId, players: playerIds },
      { new: true }
    );

    if (!updatedTeam) return res.status(404).json({ error: "Team not found" });

    const teamId = updatedTeam._id;

    // Remove old players from team
    await Player.updateMany({ team: teamId, _id: { $nin: playerIds } }, { team: null });

    // Add new players to team
    await Player.updateMany({ _id: { $in: playerIds } }, { team: teamId });

    const populatedTeam = await Team.findById(teamId)
      .populate("captain", "name rating")
      .populate("players", "name rating");

    res.json(populatedTeam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Team
app.delete("/api/tournaments/team/:tournamentId/remove-team/:teamId", async (req, res) => {
  try {
    const { tournamentId, teamId } = req.params;

    const tournament = await TeamTournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const teamIndex = tournament.teams.findIndex(id => id.toString() === teamId);
    if (teamIndex === -1) {
      return res.status(404).json({ error: "Team not found in tournament" });
    }

    tournament.teams.splice(teamIndex, 1);
    await tournament.save();

    res.json({ message: "Team removed from tournament" });
  } catch (err) {
    console.error("Error removing team:", err.message);
    res.status(500).json({ error: "Failed to remove team from tournament" });
  }
});

// Create a Team Tournament
app.post("/api/tournaments/team", async (req, res) => {
  try {
    const { tournamentName, teamSize, location, date, format } = req.body;

    const newTournament = new TeamTournament({
      tournamentName,
      teamSize,
      location,
      date,
      matchFormat: format, // 🛠️ ADD THIS LINE
    });

    await newTournament.save();
    res.status(201).json(newTournament);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get All Team Tournaments
app.get("/api/tournaments/team", async (req, res) => {
  try {
    const tournaments = await TeamTournament.find().sort({ date: 1 });
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a Team to a Specific Team Tournament
app.post("/api/tournaments/team/:id/add-team", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, players = [] } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid tournament ID format" });
    }

    const tournament = await TeamTournament.findById(id);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    let playerIds = [];

    if (players.length > 0) {
      const filteredPlayers = players.filter(p => p.name && p.name.trim() !== "");

      if (filteredPlayers.length === 0) {
        return res.status(400).json({ error: "At least one player must have a valid name." });
      }

      const createdPlayers = await Player.insertMany(filteredPlayers.map(p => ({
        name: p.name,
        rating: p.rating || null,
      })));

      playerIds = createdPlayers.map(p => p._id);
    }

    const team = new Team({
      name,
      players: playerIds,
    });

    await team.save();

    if (playerIds.length > 0) {
      await Player.updateMany({ _id: { $in: playerIds } }, { team: team._id });
    }

    tournament.teams.push(team._id);
    await tournament.save();

    res.status(201).json(team);
  } catch (err) {
    console.error("Error adding team:", err.message);
    res.status(500).json({ error: "Failed to add team" });
  }
});


// Get Teams in a Tournament
app.get("/api/tournaments/team/:id/teams", async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await TeamTournament.findById(id).populate({
      path: "teams",
      populate: { path: "players", select: "name rating" },
    });

    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    res.json(tournament.teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate Team Pairings
app.get("/api/tournaments/team/:id/pairings", async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await TeamTournament.findById(id).populate("teams");

    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const teams = tournament.teams;

    if (teams.length < 2) {
      return res.status(400).json({ error: "Not enough teams for pairings" });
    }

    // Round Robin Pairings
    const rounds = [];
    const teamList = [...teams];

    if (teamList.length % 2 !== 0) {
      teamList.push({ name: "None", _id: null }); // Bye team for odd numbers
    }

    const numRounds = teamList.length - 1;

    for (let round = 0; round < numRounds; round++) {
      const pairings = [];
      const step = round + 1; // For round 1, step = 1; round 2, step = 2, and so on.

      // Rotate teams to generate new pairings each round
      for (let i = 0; i < teamList.length / 2; i++) {
        const teamA = teamList[i];
        const teamB = teamList[teamList.length - 1 - i];

        if (teamA.name !== "None" && teamB.name !== "None") {
          const color = round % 2 === 0 ? "White" : "Black"; // Alternate color for each round
          pairings.push({ teamA, teamB, colorA: color, colorB: color === "White" ? "Black" : "White" });
        } else {
          const realTeam = teamA.name !== "None" ? teamA : teamB;
          pairings.push({ teamA: realTeam, teamB: { name: "None" }, colorA: "White", colorB: "None" });
        }
      }

      // Rotate teams for the next round
      const firstTeam = teamList[0];
      const restTeams = teamList.slice(1);
      teamList.length = 0; // Clear the array
      teamList.push(firstTeam, ...restTeams.slice(0, restTeams.length - 1)); // Add the first team back and rotate the others

      rounds.push({ roundNumber: round + 1, pairings });
    }

    res.json(rounds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update match result in tournament
app.patch("/api/tournaments/team/:tournamentId/match/:matchId", async (req, res) => {
  try {
    const { tournamentId, matchId } = req.params;
    const { result } = req.body; // "teamA", "teamB", or "draw"

    // Validate result
    if (!["teamA", "teamB", "draw"].includes(result)) {
      return res.status(400).json({ error: "Invalid result" });
    }

    const tournament = await TeamTournament.findById(tournamentId).populate("teams");
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const match = tournament.matches.id(matchId);
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    match.result = result;

    // Update team statistics (games played, wins, losses, draws, points)
    const teamA = match.teamA;
    const teamB = match.teamB;

    if (result === "teamA") {
      teamA.gamesPlayed += 1;
      teamA.wins += 1;
      teamA.points += 3;
      teamB.gamesPlayed += 1;
      teamB.losses += 1;
    } else if (result === "teamB") {
      teamB.gamesPlayed += 1;
      teamB.wins += 1;
      teamB.points += 3;
      teamA.gamesPlayed += 1;
      teamA.losses += 1;
    } else {
      teamA.gamesPlayed += 1;
      teamB.gamesPlayed += 1;
      teamA.draws += 1;
      teamB.draws += 1;
      teamA.points += 1;
      teamB.points += 1;
    }

    await teamA.save();
    await teamB.save();
    await match.save();
    await tournament.save();

    res.json({ message: "Match result updated successfully", tournament });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get updated standings for a tournament
app.get("/api/tournaments/team/:id/standings", async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await TeamTournament.findById(id).populate("teams");

    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const standings = tournament.teams.map(team => ({
      name: team.name,
      gamesPlayed: team.gamesPlayed || 0,
      wins: team.wins || 0,
      losses: team.losses || 0,
      draws: team.draws || 0,
      points: team.points || 0,
    }));

    standings.sort((a, b) => b.points - a.points); // Sort by points

    res.json(standings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit match result for a specific round pairing
app.post("/api/tournaments/team/:id/pairings/result", async (req, res) => {
  try {
    const { id } = req.params;
    const { roundNumber, teamAId, teamBId, result } = req.body;

    // Accepting standard chess result notation
    if (!["1-0", "0-1", "0.5-0.5"].includes(result)) {
      return res.status(400).json({ error: "Invalid result format" });
    }

    const tournament = await TeamTournament.findById(id);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const teamA = await Team.findById(teamAId);
    const teamB = await Team.findById(teamBId);

    if (!teamA || !teamB) {
      return res.status(404).json({ error: "One or both teams not found" });
    }

    // Update match statistics
    teamA.gamesPlayed = (teamA.gamesPlayed || 0) + 1;
    teamB.gamesPlayed = (teamB.gamesPlayed || 0) + 1;

    if (result === "1-0") {
      teamA.wins = (teamA.wins || 0) + 1;
      teamA.points = (teamA.points || 0) + 3;
      teamB.losses = (teamB.losses || 0) + 1;
    } else if (result === "0-1") {
      teamB.wins = (teamB.wins || 0) + 1;
      teamB.points = (teamB.points || 0) + 3;
      teamA.losses = (teamA.losses || 0) + 1;
    } else if (result === "0.5-0.5") {
      teamA.draws = (teamA.draws || 0) + 1;
      teamB.draws = (teamB.draws || 0) + 1;
      teamA.points = (teamA.points || 0) + 1;
      teamB.points = (teamB.points || 0) + 1;
    }

    await teamA.save();
    await teamB.save();

    res.json({ message: "Result submitted successfully", result });
  } catch (err) {
    console.error("Failed to submit result:", err.message);
    res.status(500).json({ error: "Failed to submit result" });
  }
});

// Connect to DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }
};

startServer();
