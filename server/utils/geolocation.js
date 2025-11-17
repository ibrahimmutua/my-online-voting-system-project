/**
 * Server-side Geolocation Verification Utility
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
 * Verify if voter is within allowed region for election
 */
const verifyVoterLocation = (voterLat, voterLon, region) => {
  if (!region || region.centerLatitude === 0 || region.centerLongitude === 0) {
    return { allowed: true, reason: 'No region restrictions' }
  }

  const distance = calculateDistance(
    voterLat,
    voterLon,
    region.centerLatitude,
    region.centerLongitude
  )

  if (distance <= region.radiusKm) {
    return {
      allowed: true,
      reason: `You are within the voting region (${distance.toFixed(2)} km from center)`,
      distance
    }
  } else {
    return {
      allowed: false,
      reason: `You are outside the voting region. Your location is ${distance.toFixed(2)} km from the election center. Allowed radius: ${region.radiusKm} km`,
      distance,
      allowedRadius: region.radiusKm
    }
  }
}

/**
 * Validate geolocation data format
 */
const validateGeoLocationData = (latitude, longitude, accuracy) => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return { valid: false, error: 'Invalid latitude or longitude' }
  }

  if (latitude < -90 || latitude > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' }
  }

  if (longitude < -180 || longitude > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' }
  }

  if (accuracy && accuracy > 2000) {
    return { valid: false, error: 'Location accuracy too poor (> 2km). Please try again.' }
  }

  return { valid: true }
}

module.exports = {
  calculateDistance,
  verifyVoterLocation,
  validateGeoLocationData
}
