/**
 * Geolocation Utility Service
 * Handles browser geolocation and distance calculations
 */

export const requestGeolocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        })
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  })
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Check if voter is within allowed region
 * Region is defined by a center point and radius in kilometers
 */
export const isVoterInRegion = (voterLat, voterLon, regionLat, regionLon, radiusKm = 50) => {
  const distance = calculateDistance(voterLat, voterLon, regionLat, regionLon)
  return distance <= radiusKm
}

/**
 * Get human-readable location info from coordinates
 */
export const getLocationInfo = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    )
    const data = await response.json()
    return {
      city: data.address?.city || data.address?.town || 'Unknown',
      county: data.address?.county || '',
      country: data.address?.country || 'Unknown',
      address: data.display_name
    }
  } catch (error) {
    console.error('Failed to get location info:', error)
    return {
      city: 'Unknown',
      county: '',
      country: 'Unknown',
      address: `${latitude}, ${longitude}`
    }
  }
}

const geolocationUtils = {
  requestGeolocation,
  calculateDistance,
  isVoterInRegion,
  getLocationInfo
}

export default geolocationUtils
