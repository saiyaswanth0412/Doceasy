import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import chatbotRouter from './routes/chatbotRoute.js'
import prescriptionRouter from './routes/prescriptionRoute.js'
import geminiRouter from './routes/geminiRoute.js'
import chatbookingRouter from './routes/chatbookingRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000

// Connect to database (CALL THE FUNCTION)
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())

// CORS configuration for Vercel and local development
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://appointy.vercel.app',
      'https://appointy-admin.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://192.168.1.195:5173',
      'http://192.168.1.195:5174',
      'http://192.168.1.195:5175'
    ]
    
    // Allow all *.vercel.app domains with better regex
    const isVercelDomain = origin && origin.includes('.vercel.app')
    
    if (!origin || allowedOrigins.includes(origin) || isVercelDomain) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  maxAge: 86400
}

app.use(cors(corsOptions))

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use("/api/user", userRouter)
app.use("/api/chatbot", chatbotRouter)
app.use("/api/prescription", prescriptionRouter)
app.use("/api/gemini", geminiRouter)
app.use("/api/chatbooking", chatbookingRouter)


app.get("/", (req, res) => {
  res.send("API Working")
});

app.get('/test-db', (req, res) => {
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (state === 1) {
    res.send('Database is connected');
  } else {
    res.status(500).send('Database is NOT connected');
  }
});


app.listen(port, () => console.log(`Server started on PORT:${port}`))
