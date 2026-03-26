import mongoose from 'mongoose'
import 'dotenv/config'
import doctorModel from './models/doctorModel.js'
import appointmentModel from './models/appointmentModel.js'

async function testDirectly() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to DB')

    // Test 1: Find doctor by name regex
    console.log('\n🔍 Test 1: Find by name regex')
    const doc1 = await doctorModel.findOne({ name: { $regex: 'Vikas', $options: 'i' } })
    console.log('Result:', doc1 ? doc1.name : 'NOT FOUND')

    // Test 2: Find by speciality
    console.log('\n🔍 Test 2: Find by speciality')
    const doc2 = await doctorModel.findOne({ speciality: 'Cardiologist' })
    console.log('Result:', doc2 ? doc2.name : 'NOT FOUND')

    // Test 3: Try the exact query from the endpoint
    console.log('\n🔍 Test 3: Exact endpoint query')
    let doctorData = await doctorModel.findOne({ name: { $regex: 'Dr. Vikas Singh', $options: 'i' } })
    console.log('By name:', doctorData ? doctorData.name : 'null')
    
    if (!doctorData) {
      doctorData = await doctorModel.findOne({ speciality: 'Cardiologist' })
      console.log('By speciality:', doctorData ? doctorData.name : 'null')
    }

    console.log('\n✅ Final doctor data:', doctorData ? `${doctorData.name} - ${doctorData.speciality}` : 'NONE')

    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testDirectly()
