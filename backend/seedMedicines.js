import mongoose from 'mongoose';
import medicineModel from './models/medicineModel.js';
import 'dotenv/config';

const medicines = [
  // Antibiotics
  { name: 'Amoxicillin', dosage: '500mg', category: 'Antibiotic', description: 'Broad-spectrum antibiotic', sideEffects: 'Nausea, allergic reactions' },
  { name: 'Azithromycin', dosage: '250mg', category: 'Antibiotic', description: 'Macrolide antibiotic', sideEffects: 'Diarrhea, nausea' },
  { name: 'Ciprofloxacin', dosage: '500mg', category: 'Antibiotic', description: 'Fluoroquinolone antibiotic', sideEffects: 'Tendon inflammation, photosensitivity' },
  
  // Pain Killers
  { name: 'Paracetamol', dosage: '500mg', category: 'Painkiller', description: 'Common pain reliever and fever reducer', sideEffects: 'Liver damage at high doses' },
  { name: 'Ibuprofen', dosage: '400mg', category: 'Painkiller', description: 'Anti-inflammatory pain reliever', sideEffects: 'Stomach upset, ulcers' },
  { name: 'Aspirin', dosage: '500mg', category: 'Painkiller', description: 'Mild pain reliever and blood thinner', sideEffects: 'Stomach irritation, bleeding' },
  
  // Vitamins
  { name: 'Vitamin C', dosage: '1000mg', category: 'Vitamin', description: 'Boosts immunity', sideEffects: 'Generally safe, excess may cause kidney stones' },
  { name: 'Vitamin D3', dosage: '1000IU', category: 'Vitamin', description: 'Supports bone health and calcium absorption', sideEffects: 'Hypercalcemia at very high doses' },
  { name: 'Vitamin B12', dosage: '1000mcg', category: 'Vitamin', description: 'Energy and nerve function', sideEffects: 'Rare allergic reactions' },
  
  // Allergy Medications
  { name: 'Cetirizine', dosage: '10mg', category: 'Allergy', description: 'Non-drowsy antihistamine', sideEffects: 'Headache, dry mouth' },
  { name: 'Loratadine', dosage: '10mg', category: 'Allergy', description: 'Antihistamine for allergies', sideEffects: 'Fatigue, dry mouth' },
  
  // Digestive
  { name: 'Omeprazole', dosage: '20mg', category: 'Digestive', description: 'Reduces stomach acid', sideEffects: 'Headache, diarrhea' },
  { name: 'Metformin', dosage: '500mg', category: 'Digestive', description: 'Diabetes management', sideEffects: 'Nausea, metallic taste' },
  
  // Cough and Cold
  { name: 'Dextromethorphan', dosage: '10mg', category: 'Cough', description: 'Cough suppressant', sideEffects: 'Dizziness, drowsiness' },
  { name: 'Guaifenesin', dosage: '100mg', category: 'Cold', description: 'Expectorant for congestion', sideEffects: 'Nausea, mild dizziness' },
  
  // Antacid
  { name: 'Ranitidine', dosage: '150mg', category: 'Antacid', description: 'Reduces acid reflux', sideEffects: 'Headache, constipation' },
  { name: 'Calcium Carbonate', dosage: '750mg', category: 'Antacid', description: 'Antacid and calcium supplement', sideEffects: 'Constipation, bloating' },
];

const seedMedicines = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB Connected');

    // Clear existing medicines
    await medicineModel.deleteMany({});
    console.log('🗑️  Cleared existing medicines');

    // Insert new medicines
    const result = await medicineModel.insertMany(medicines);
    console.log(`✅ ${result.length} medicines added successfully!`);
    
    console.log('\n📋 Medicines added:');
    result.forEach((med, index) => {
      console.log(`${index + 1}. ${med.name} (${med.dosage}) - ${med.category}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding medicines:', error.message);
    process.exit(1);
  }
};

seedMedicines();
