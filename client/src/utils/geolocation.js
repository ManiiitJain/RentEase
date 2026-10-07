// Gujarat Major City Coordinates
const CITIES_COORDS = [
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Gandhinagar', lat: 23.2156, lng: 72.6369 },
  { name: 'Surat', lat: 21.1702, lng: 72.8311 },
  { name: 'Vadodara', lat: 22.3072, lng: 73.1812 },
];

// Haversine formula to compute distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const detectUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Try free reverse geocoding via OpenStreetMap Nominatim
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (response.ok) {
            const data = await response.json();
            const address = data.address || {};
            const detectedCity =
              address.city ||
              address.town ||
              address.suburb ||
              address.state_district ||
              address.county;

            if (detectedCity) {
              // Check if detected city matches our database cities
              const matchedCity = CITIES_COORDS.find((c) =>
                detectedCity.toLowerCase().includes(c.name.toLowerCase())
              );

              if (matchedCity) {
                resolve({
                  city: matchedCity.name,
                  fullAddress: data.display_name,
                  latitude,
                  longitude,
                });
                return;
              }
            }
          }
        } catch (e) {
          console.warn('Reverse geocoding fetch failed, falling back to nearest city:', e);
        }

        // Fallback: find nearest supported city
        let nearest = CITIES_COORDS[0];
        let minDistance = calculateDistance(
          latitude,
          longitude,
          nearest.lat,
          nearest.lng
        );

        for (let i = 1; i < CITIES_COORDS.length; i++) {
          const dist = calculateDistance(
            latitude,
            longitude,
            CITIES_COORDS[i].lat,
            CITIES_COORDS[i].lng
          );
          if (dist < minDistance) {
            minDistance = dist;
            nearest = CITIES_COORDS[i];
          }
        }

        resolve({
          city: nearest.name,
          distanceKm: Math.round(minDistance),
          latitude,
          longitude,
        });
      },
      (error) => {
        let msg = 'Could not access your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        reject(new Error(msg));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
};
