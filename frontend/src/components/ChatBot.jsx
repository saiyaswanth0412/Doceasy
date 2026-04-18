import { useState, useRef, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import './ChatBot.css'

function ChatBot() {
  const { userData } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! 👋 I\'m Doceasy, your medical appointment assistant. How can I help you today?'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [showEmailPrompt, setShowEmailPrompt] = useState(false)
  const [pendingBooking, setPendingBooking] = useState(null)
  const [lastRequestTime, setLastRequestTime] = useState(0)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim()) return
    
    // Rate limiting: minimum 2 seconds between requests
    const now = Date.now()
    if (now - lastRequestTime < 2000) {
      console.log('Rate limited: wait before sending next message')
      return
    }

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue
    }
    const messageToSend = inputValue;
    const currentMessages = [...messages, userMessage]
    setMessages(currentMessages)
    setInputValue('')
    setIsLoading(true)
    setLastRequestTime(now)

    // Build history from conversation (skip the initial greeting)
    const history = currentMessages.slice(1).map(m => ({ type: m.type, text: m.text }))

    try {
      const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
      const response = await fetch(`${backendURL}/api/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageToSend,
          history
        })
      })

      const data = await response.json()

      if (data.success) {
        const botMessage = {
          id: messages.length + 2,
          type: 'bot',
          text: data.reply
        }
        setMessages(prev => [...prev, botMessage])

        // If booking data is present, book automatically if logged in
        if (data.bookingData) {
          if (userData && userData.email) {
            // Auto-book with logged-in user's email
            bookAppointment(data.bookingData, userData.email)
          } else {
            // Ask for email if not logged in
            setPendingBooking(data.bookingData)
            setShowEmailPrompt(true)
            const confirmMsg = {
              id: messages.length + 3,
              type: 'bot',
              text: 'To complete your booking, please provide your email address.'
            }
            setMessages(prev => [...prev, confirmMsg])
          }
        }
      } else {
        const errorMessage = {
          id: messages.length + 2,
          type: 'bot',
          text: data.message || 'Sorry, I couldn\'t process your request. Please try again.'
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: 'I\'m having trouble connecting. Please try again later.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const bookAppointment = async (booking, email) => {
    setIsLoading(true)
    try {
      const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
      const response = await fetch(`${backendURL}/api/chatbot/bookings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: email,
          doctorName: booking.doctorName,
          specialization: booking.specialization,
          slotDate: booking.slotDate,
          slotTime: booking.slotTime
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'bot',
          text: `✅ ${data.message}\n\nAppointment Details:\n- Doctor: ${data.appointmentDetails.doctor}\n- Specialization: ${data.appointmentDetails.specialization}\n- Date: ${data.appointmentDetails.date}\n- Time: ${data.appointmentDetails.time}\n- Fees: ₹${data.appointmentDetails.amount}`
        }])
      } else {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'bot',
          text: `❌ Booking failed: ${data.message}`
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'bot',
        text: 'Failed to book appointment. Please try again.'
      }])
    } finally {
      setShowEmailPrompt(false)
      setPendingBooking(null)
      setUserEmail('')
      setIsLoading(false)
    }
  }

  const handleBookAppointment = async (e) => {
    e.preventDefault()
    if (!userEmail.trim() || !pendingBooking) return
    bookAppointment(pendingBooking, userEmail.trim())
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chatbot-container">
      {/* Chatbot Button */}
      <button
        className="chatbot-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Doceasy"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Doceasy</h3>
            <p className="chat-subtitle">Your appointment assistant</p>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            {showEmailPrompt ? (
              <form onSubmit={handleBookAppointment} style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="chat-input"
                  disabled={isLoading}
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  className="send-btn"
                  disabled={isLoading || !userEmail.trim()}
                >
                  {isLoading ? '...' : '✓'}
                </button>
              </form>
            ) : (
              <>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="chat-input"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  className="send-btn"
                  disabled={isLoading || !inputValue.trim()}
                >
                  {isLoading ? '...' : '→'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatBot
