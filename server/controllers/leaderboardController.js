const HttpError = require('../models/ErrorModel')
const ElectionModel = require('../models/electionModel')
const CandidateModel = require('../models/candidateModel')

const electionLeaderboardController = {
  /**
   * Get real-time leaderboard with voting statistics
   */
  getLeaderboard: async (req, res, next) => {
    try {
      const { id: electionId } = req.params

      if (!electionId) {
        return next(new HttpError('Election ID is required', 400))
      }

      // Fetch election with candidates and voters
      const election = await ElectionModel.findById(electionId)
        .populate('candidates')
        .populate('voters', 'email lastLocation votingLocations')
        .lean()

      if (!election) {
        return next(new HttpError('Election not found', 404))
      }

      // Calculate statistics
      const candidates = election.candidates || []
      const voters = election.voters || []
      const totalVotes = candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0)
      const totalVoters = voters.length

      // Aggregate votes by region
      const votersByRegion = {}
      voters.forEach(voter => {
        if (voter.lastLocation) {
          // For simplicity, we'll use coordinates to approximate region
          // In production, you'd have a proper region mapping
          const region = voter.lastLocation.region || 'Unknown Region'
          votersByRegion[region] = (votersByRegion[region] || 0) + 1
        }
      })

      // Calculate participation rate (as percentage of expected voters)
      // This assumes we have a total eligible voters count, we'll use total votes as proxy
      const participationRate = totalVotes > 0 ? 100 : 0

      // Prepare leaderboard data with anonymized information
      const leaderboardData = {
        candidates: candidates.map(candidate => ({
          _id: candidate._id,
          fullName: candidate.fullName,
          motto: candidate.motto,
          image: candidate.image,
          voteCount: candidate.voteCount || 0,
          rank: 0 // Will be calculated on client
        })),
        statistics: {
          totalVotes,
          totalVoters,
          participationRate,
          votersByRegion,
          electionName: election.title,
          timestamp: new Date()
        },
        metadata: {
          electionId,
          requiresGeoVerification: election.requiresGeoVerification,
          region: election.region
        }
      }

      return res.status(200).json(leaderboardData)
    } catch (error) {
      return next(new HttpError(error.message || 'Failed to fetch leaderboard', 500))
    }
  },

  /**
   * Get voting statistics for a specific candidate
   */
  getCandidateStats: async (req, res, next) => {
    try {
      const { electionId, candidateId } = req.params

      const candidate = await CandidateModel.findById(candidateId).lean()
      if (!candidate) {
        return next(new HttpError('Candidate not found', 404))
      }

      const election = await ElectionModel.findById(electionId).lean()
      if (!election) {
        return next(new HttpError('Election not found', 404))
      }

      const totalVotes = election.candidates.reduce((sum, cId) => {
        // In production, fetch actual vote counts
        return sum
      }, 0)

      const stats = {
        candidateName: candidate.fullName,
        voteCount: candidate.voteCount || 0,
        percentageOfTotal: totalVotes > 0 ? ((candidate.voteCount || 0) / totalVotes * 100).toFixed(2) : 0,
        timestamp: new Date()
      }

      return res.status(200).json(stats)
    } catch (error) {
      return next(new HttpError(error.message || 'Failed to fetch candidate stats', 500))
    }
  },

  /**
   * Get voting trends over time
   */
  getVotingTrends: async (req, res, next) => {
    try {
      const { id: electionId } = req.params

      const election = await ElectionModel.findById(electionId)
        .populate('candidates')
        .lean()

      if (!election) {
        return next(new HttpError('Election not found', 404))
      }

      // Prepare trend data (simulated with current vote counts)
      // In production, you'd have historical voting data stored
      const trends = {
        candidates: election.candidates.map(candidate => ({
          name: candidate.fullName,
          votes: candidate.voteCount || 0,
          timestamp: new Date()
        })),
        totalVotes: election.candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0),
        electionId
      }

      return res.status(200).json(trends)
    } catch (error) {
      return next(new HttpError(error.message || 'Failed to fetch voting trends', 500))
    }
  },

  /**
   * Get regional voting distribution
   */
  getRegionalDistribution: async (req, res, next) => {
    try {
      const { id: electionId } = req.params

      const election = await ElectionModel.findById(electionId)
        .populate('voters', 'lastLocation votingLocations')
        .lean()

      if (!election) {
        return next(new HttpError('Election not found', 404))
      }

      // Aggregate voters by region
      const regionDistribution = {}
      const voters = election.voters || []

      voters.forEach(voter => {
        if (voter.votingLocations && voter.votingLocations.length > 0) {
          const lastVote = voter.votingLocations[voter.votingLocations.length - 1]
          // In production, map coordinates to actual regions
          const region = lastVote.region || 'Unknown Region'
          regionDistribution[region] = (regionDistribution[region] || 0) + 1
        }
      })

      return res.status(200).json({
        regionDistribution,
        totalVoters: voters.length,
        timestamp: new Date()
      })
    } catch (error) {
      return next(new HttpError(error.message || 'Failed to fetch regional distribution', 500))
    }
  }
}

module.exports = electionLeaderboardController
