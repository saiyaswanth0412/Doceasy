import mongoose from 'mongoose'
import { config } from 'dotenv'

config()

const connectAndCheckDatabases = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URI
    
    if (!mongoUrl) {
      console.error('❌ MONGODB_URI not found in .env file')
      process.exit(1)
    }
    
    console.log('Connecting to MongoDB Atlas cluster...\n')
    
    // Connect without specifying database to access admin functions
    const conn = await mongoose.connect(mongoUrl, { dbName: 'admin' })
    console.log('✅ Connected to MongoDB Atlas cluster\n')
    
    const admin = conn.connection.getClient().db('admin')
    const databases = await admin.admin().listDatabases()
    
    console.log('📊 Databases in this cluster:\n')
    for (const db of databases.databases) {
      console.log(`📁 ${db.name}`)
    }
    
    console.log('\n📚 Checking "appointy" database collections:\n')
    
    const appointyDb = conn.connection.getClient().db('appointy')
    const collections = await appointyDb.listCollections().toArray()
    
    for (const col of collections) {
      const count = await appointyDb.collection(col.name).countDocuments()
      console.log(`  📋 ${col.name}: ${count} documents`)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

connectAndCheckDatabases()
