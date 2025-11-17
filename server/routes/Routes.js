var {Router}=require("express")
var router=Router()

var { registerVoter,loginVoter,getVoter } = require("../controllers/voterController")
var {addElection,getElections,getElection,updateElection,removeElection,
    getCandidatesOfElection,getElectionVoters}=require('../controllers/electionController')

var {addCandidate,getCandidate,removeCandidate,voteCandidate}=require('../controllers/candidateController')
var chatController = require('../controllers/chatController')
var leaderboardController = require('../controllers/leaderboardController')


var authMiddleware=require('../middleware/authMiddleware')



router.post('/voters/register',registerVoter)
router.post('/voters/login',loginVoter)
router.get('/voters/:id',authMiddleware,getVoter)




router.post('/elections',authMiddleware, addElection)
router.get('/elections',authMiddleware,getElections)
router.get('/elections/:id',authMiddleware,getElection)
router.delete('/elections/:id',authMiddleware,removeElection)
router.patch('/elections/:id',authMiddleware,updateElection)
router.get('/elections/:id/candidates',authMiddleware,getCandidatesOfElection)
router.get('/elections/:id/voters',authMiddleware,getElectionVoters)
// Leaderboard endpoints
router.get('/elections/:id/leaderboard',authMiddleware,leaderboardController.getLeaderboard)
router.get('/elections/:id/trends',authMiddleware,leaderboardController.getVotingTrends)
router.get('/elections/:id/regional-distribution',authMiddleware,leaderboardController.getRegionalDistribution)
router.get('/elections/:id/candidates/:candidateId/stats',authMiddleware,leaderboardController.getCandidateStats)




router.post('/candidates',authMiddleware,addCandidate)
router.get('/candidates/:id',authMiddleware,getCandidate)
router.delete('/candidates/:id',authMiddleware,removeCandidate)
router.patch('/candidates/:id',authMiddleware,voteCandidate)

// Chatbot route (public - no auth required)
router.post('/chat', chatController.handleChat)

module.exports = router

module.exports=router;