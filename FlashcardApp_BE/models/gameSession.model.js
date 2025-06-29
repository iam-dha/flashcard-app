const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 0
    },
    scrambledWords: {
        type: [String],
        default: []
    },
    correctWords: {
        type: [String],
        default: []
    },
    playAt: {
        type: Date,
        default: Date.now
    },
});

const GameSession = mongoose.model("GameSession", gameSessionSchema, "gameSessions");
module.exports = GameSession;