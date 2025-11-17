// server/routes/Routes.js

const { Router } = require("express");
const router = Router();

const { registerVoter, loginVoter, getVoter } = require("../controllers/voterController");
const { 
    addElection, getElections, getElection, updateElection, removeElection,
    getCandidatesOfElection, getElectionVoters
} = require('../controllers/electionController');
const { addCandidate, getCandidate, removeCandidate, voteCandidate } = require('../controllers/candidateController');
const chatController = require('../controllers/chatController');
const leaderboardController = require('../controllers/leaderboardController');

const authMiddleware = require('../middleware/authMiddleware');

// -------- Voter routes --------
router.post('/voters/register', async (req, res) => {
    try {
        await registerVoter(req, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during registration" });
    }
});

router.post('/voters/login', async (req, res) => {
    try {
        await loginVoter(req, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during login" });
    }
});

router.get('/voters/:id', authMiddleware, getVoter);

// -------- Election routes --------
router.post('/elections', authMiddleware, addElection);
router.get('/elections', authMiddleware, getElections);
router.get('/elections/:id', authMiddleware, getElection);
router.delete('/elections/:id', authMiddleware, removeElection);
router.patch('/elections/:id', authMiddleware, updateElection);
router.get('/elections/:id/candidates', authMiddleware, getCandidatesOfElection);
router.get('/elections/:id/voters', authMiddleware, getElectionVoters);

// Leaderboard endpoints
router.get('/elections/:id/leaderboard', authMiddleware, leaderboardController.getLeaderboard);
router.get('/elections/:id/trends', authMiddleware, leaderboardController.getVotingTrends);
router.get('/elections/:id/regional-distribution', authMiddleware, leaderboardController.getRegionalDistribution);
router.get('/elections/:id/candidates/:candidateId/stats', authMiddleware, leaderboardController.getCandidateStats);

// -------- Candidate routes --------
router.post('/candidates', authMiddleware, addCandidate);
router.get('/candidates/:id', authMiddleware, getCandidate);
router.delete('/candidates/:id', authMiddleware, removeCandidate);
router.patch('/candidates/:id', authMiddleware, voteCandidate);

// -------- Chatbot route --------
router.post('/chat', chatController.handleChat);

// Export router
module.exports = router;
