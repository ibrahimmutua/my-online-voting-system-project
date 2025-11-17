// Simple AI chatbot responses for voting system
const votingFAQs = {
  election: [
    "An election is a voting process where citizens choose their preferred candidates for political office.",
    "Elections are important for democracy as they allow people to have a voice in governance.",
    "You can view all available elections in the Elections section of the app.",
  ],
  candidate: [
    "A candidate is a person running for political office in an election.",
    "You can vote for a candidate by going to the election details and clicking the vote button.",
    "Each candidate is associated with a specific election.",
  ],
  vote: [
    "To vote, navigate to an election, select a candidate, and confirm your vote.",
    "You can only vote once per election.",
    "After voting, you will see a congratulation message.",
  ],
  results: [
    "Results show the voting statistics for each candidate in an election.",
    "Percentages are calculated based on total votes received.",
    "You can see live results in the Results section.",
  ],
  account: [
    "You need to register and log in to use the voting system.",
    "Your account is secure and voting records are private.",
    "You can log out anytime from the navbar.",
  ],
  help: [
    "This is an AI assistant for the online voting system.",
    "You can ask me about elections, candidates, voting, results, or account-related questions.",
    "Common topics: 'election', 'candidate', 'vote', 'results', 'account'",
  ]
}

const getRelevantKeyword = (message) => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('election')) return 'election'
  if (lowerMessage.includes('candidate')) return 'candidate'
  if (lowerMessage.includes('vote')) return 'vote'
  if (lowerMessage.includes('result')) return 'results'
  if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('register')) return 'account'
  if (lowerMessage.includes('help') || lowerMessage.includes('what')) return 'help'
  
  return 'help'
}

const generateChatbotResponse = (message) => {
  const keyword = getRelevantKeyword(message)
  const responses = votingFAQs[keyword] || votingFAQs.help
  
  // Return a random response from the category or concatenate relevant ones
  const randomIndex = Math.floor(Math.random() * responses.length)
  return responses[randomIndex]
}

module.exports = { generateChatbotResponse }
