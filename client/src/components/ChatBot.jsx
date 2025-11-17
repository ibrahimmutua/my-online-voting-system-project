import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import './ChatBot.css'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! 👋 I'm here to help. What would you like to know about the voting system?", sender: 'bot' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const token = useSelector(state => state?.vote?.currentVoter?.token)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/chat`,
        { message: inputValue },
        {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      )

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'bot'
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([
      { id: 1, text: "Hi! 👋 I'm here to help. What would you like to know about the voting system?", sender: 'bot' }
    ])
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className="chatbot_toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Open AI Assistant"
      >
        <span className="chatbot_icon">💬</span>
      </button>

      {/* Chatbot Widget */}
      {isOpen && (
        <div className="chatbot_container">
          <div className="chatbot_header">
            <h3>AI Assistant</h3>
            <div className="chatbot_header_actions">
              <button
                className="chatbot_clear_btn"
                onClick={handleClearChat}
                title="Clear chat"
              >
                🔄
              </button>
              <button
                className="chatbot_close_btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="chatbot_messages">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`chatbot_message chatbot_message_${msg.sender}`}
              >
                <div className="chatbot_message_bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chatbot_message chatbot_message_bot">
                <div className="chatbot_message_bubble">
                  <span className="chatbot_typing">typing</span>
                  <span className="chatbot_dot">.</span>
                  <span className="chatbot_dot">.</span>
                  <span className="chatbot_dot">.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chatbot_input_form">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="chatbot_input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="chatbot_send_btn"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatBot
