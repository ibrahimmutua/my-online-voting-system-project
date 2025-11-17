import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import './Leaderboard.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Leaderboard = ({ electionId }) => {
  const [candidates, setCandidates] = useState([])
  const [statistics, setStatistics] = useState({
    totalVotes: 0,
    totalVoters: 0,
    participationRate: 0,
    votersByRegion: {}
  })
  const [isLoading, setIsLoading] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(5000) // 5 seconds
  const token = useSelector(state => state?.vote?.currentVoter?.token)

  // Fetch candidates and voting stats
  const fetchLeaderboardData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${electionId}/leaderboard`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const data = response.data
      setCandidates(data.candidates || [])
      setStatistics(data.statistics || {})
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (electionId) {
      fetchLeaderboardData()
      const interval = setInterval(fetchLeaderboardData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [electionId, refreshInterval, token])

  // Prepare data for bar chart
  const barChartData = {
    labels: candidates.map(c => c.fullName?.substring(0, 15)),
    datasets: [
      {
        label: 'Vote Count',
        data: candidates.map(c => c.voteCount || 0),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(236, 72, 153)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  }

  // Prepare data for pie chart
  const pieChartData = {
    labels: candidates.map(c => c.fullName?.substring(0, 15)),
    datasets: [
      {
        label: 'Vote Distribution',
        data: candidates.map(c => c.voteCount || 0),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: 'white',
        borderWidth: 2
      }
    ]
  }

  // Prepare data for regional votes (if available)
  const regionChartData = {
    labels: Object.keys(statistics.votersByRegion || {}),
    datasets: [
      {
        label: 'Voters by Region',
        data: Object.values(statistics.votersByRegion || {}),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12, weight: 600 },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12, weight: 600 },
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: ${context.parsed} (${percentage}%)`
          }
        }
      }
    }
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard_header">
        <h2>📊 Live Leaderboard</h2>
        <button
          className="leaderboard_refresh"
          onClick={fetchLeaderboardData}
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Refresh Now'}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="leaderboard_stats">
        <div className="stat_card">
          <h4>Total Votes</h4>
          <p className="stat_value">{statistics.totalVotes || 0}</p>
        </div>
        <div className="stat_card">
          <h4>Total Voters</h4>
          <p className="stat_value">{statistics.totalVoters || 0}</p>
        </div>
        <div className="stat_card">
          <h4>Participation</h4>
          <p className="stat_value">{(statistics.participationRate || 0).toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts Container */}
      <div className="leaderboard_charts">
        {/* Bar Chart */}
        <div className="chart_container">
          <h3>Vote Count by Candidate</h3>
          <div className="chart_wrapper">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart_container">
          <h3>Vote Distribution</h3>
          <div className="chart_wrapper">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Regional Distribution */}
      {Object.keys(statistics.votersByRegion || {}).length > 0 && (
        <div className="leaderboard_charts">
          <div className="chart_container full_width">
            <h3>Voter Distribution by Region</h3>
            <div className="chart_wrapper">
              <Bar data={regionChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      {/* Live Rankings Table */}
      <div className="leaderboard_table">
        <h3>Live Rankings</h3>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Candidate</th>
              <th>Votes</th>
              <th>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {candidates
              .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
              .map((candidate, index) => {
                const totalVotes = statistics.totalVotes || 1
                const percentage = ((candidate.voteCount || 0) / totalVotes * 100).toFixed(1)
                const isLeading = index === 0

                return (
                  <tr key={candidate._id} className={isLeading ? 'leading' : ''}>
                    <td className="rank">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </td>
                    <td className="candidate_name">
                      <img src={candidate.image} alt={candidate.fullName} />
                      <div>
                        <p>{candidate.fullName}</p>
                        <small>{candidate.motto}</small>
                      </div>
                    </td>
                    <td className="votes">{candidate.voteCount || 0}</td>
                    <td className="percentage">
                      <div className="percentage_bar">
                        <div
                          className="percentage_fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span>{percentage}%</span>
                    </td>
                    <td className="status">
                      {isLeading ? (
                        <span className="badge leading_badge">Leading</span>
                      ) : (
                        <span className="badge">Active</span>
                      )}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {/* Auto-refresh Control */}
      <div className="leaderboard_controls">
        <label>
          Auto-refresh interval:
          <select value={refreshInterval} onChange={(e) => setRefreshInterval(Number(e.target.value))}>
            <option value={3000}>3 seconds</option>
            <option value={5000}>5 seconds</option>
            <option value={10000}>10 seconds</option>
            <option value={30000}>30 seconds</option>
          </select>
        </label>
      </div>
    </div>
  )
}

export default Leaderboard
