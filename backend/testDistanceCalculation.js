// Test script to verify distance calculation and reverse geocoding

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

const cityCache = {};

const getCityFromCoordinates = async (latitude, longitude) => {
  try {
    // Check cache first
    const cacheKey = `${latitude},${longitude}`;
    if (cityCache[cacheKey]) {
      return cityCache[cacheKey];
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'User-Agent': 'Appointy-HealthCare-App/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    // Try to get city, town, or village in order of preference
    const address = data.address || {};
    const city = address.city || address.town || address.village || address.county || "Unknown Location";
    
    // Cache the result
    cityCache[cacheKey] = city;
    
    return city;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Unknown Location";
  }
};

// Delay function to avoid rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test data
const userLat = 17.385;
const userLon = 78.4734;

const doctors = [
  { id: 1, lat: 17.385, lon: 78.4734, name: "Dr. Vikas Singh" },
  { id: 2, lat: 17.4, lon: 78.5, name: "Dr. Test 2" },
  { id: 3, lat: 17.35, lon: 78.45, name: "Dr. Test 3" },
];

(async () => {
  console.log(`\n📍 Testing Distance Calculation & Reverse Geocoding...\n`);
  console.log(`Your Location: ${userLat}, ${userLon}`);
  
  const userCity = await getCityFromCoordinates(userLat, userLon);
  console.log(`Your City: ${userCity}\n`);
  
  console.log(`Sorting doctors by distance:\n`);
  
  const doctorsWithDistance = [];
  for (const doctor of doctors) {
    const distance = calculateDistance(userLat, userLon, doctor.lat, doctor.lon);
    await delay(1000); // 1 second delay between API calls to avoid rate limiting
    const city = await getCityFromCoordinates(doctor.lat, doctor.lon);
    doctorsWithDistance.push({ ...doctor, distance, city });
  }
  
  const sorted = doctorsWithDistance.sort((a, b) => a.distance - b.distance);
  
  sorted.forEach((doc, index) => {
    console.log(`${index + 1}. ${doc.name}`);
    console.log(`   Distance: ${doc.distance} km`);
    console.log(`   City: ${doc.city}\n`);
  });
})();
