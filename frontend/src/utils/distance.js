/**
 * Calculate distance between two geographic coordinates using Haversine formula
 * @param {number} lat1 - User latitude
 * @param {number} lon1 - User longitude
 * @param {number} lat2 - Doctor latitude
 * @param {number} lon2 - Doctor longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

// Cache for city names to avoid repeated API calls
const cityCache = {};

/**
 * Get city name from coordinates using OpenStreetMap Nominatim API (FREE)
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<string>} City or district name
 */
export const getCityFromCoordinates = async (latitude, longitude) => {
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
