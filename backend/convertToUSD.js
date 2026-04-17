import mongoose from 'mongoose'
import { config } from 'dotenv'

config()

const convertFeesToUSD = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    const appointyDb = conn.connection.getClient().db('appointy')
    const doctorsCollection = appointyDb.collection('doctors')
    
    console.log('\n💱 Converting all doctor fees to USD...\n')
    
    // Convert rate: 1 USD = 83 INR (approximate)
    const INR_TO_USD = 83
    
    // Get all doctors
    const doctors = await doctorsCollection.find({}).toArray()
    
    for (const doctor of doctors) {
      let currentFee = doctor.fees
      let newFee = currentFee
      
      // If fee looks like rupees (very small in USD), convert it
      if (currentFee < 50) {
        // Likely INR, convert to USD
        newFee = Math.round(currentFee / INR_TO_USD * 100) / 100
      } else if (currentFee > 500) {
        // Likely INR, convert to USD
        newFee = Math.round(currentFee / INR_TO_USD * 100) / 100
      } else {
        // Likely already in USD, leave it or round to nearest 10
        newFee = Math.round(currentFee / 10) * 10
      }
      
      await doctorsCollection.updateOne(
        { _id: doctor._id },
        { $set: { fees: newFee } }
      )
      
      console.log(`✅ ${doctor.name}`)
      console.log(`   ${currentFee} → $${newFee} USD`)
    }
    
    console.log('\n✅ All doctor fees converted to USD!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

convertFeesToUSD()
