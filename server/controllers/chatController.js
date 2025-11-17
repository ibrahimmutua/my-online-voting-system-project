const { generateChatbotResponse } = require('../utils/chatbot')
const HttpError = require('../models/ErrorModel')

const chatController = {
  handleChat: async (req, res, next) => {
    try {
      const { message } = req.body

      if (!message || message.trim() === '') {
        return next(new HttpError('Please provide a message', 400))
      }

      // Generate AI response
      const reply = generateChatbotResponse(message)

      return res.status(200).json({
        success: true,
        reply: reply,
        timestamp: new Date()
      })
    } catch (error) {
      return next(new HttpError(error.message || 'Failed to process chat', 500))
    }
  }
}

module.exports = chatController
