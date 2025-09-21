import React, { useEffect, useRef } from 'react';

const SafeSpotsMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Check if the user's browser supports geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          // Initialize the map once we have the user's location
          initMap(userLatLng);
        },
        () => {
          // Handle case where geolocation is not supported or permission is denied
          alert('Geolocation is not supported or permission was denied. Cannot show nearby safe spots.');
        }
      );
    } else {
      alert('Your browser does not support geolocation.');
    }
  }, []);

  const initMap = (userLatLng) => {
    // Placeholder for your Google Maps API Key
    const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
    
    // Dynamically load the Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLatLng,
        zoom: 15,
        mapId: "DEMO_MAP_ID", // Optional: Use a custom map ID
      });

      // Place a marker for the user's current location
      new window.google.maps.Marker({
        position: userLatLng,
        map,
        title: "Your Location",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });

      // Mock data for nearby places
      const safePlaces = [
        { lat: userLatLng.lat + 0.002, lng: userLatLng.lng - 0.003, name: "Nearby Police Station", type: "police" },
        { lat: userLatLng.lat - 0.001, lng: userLatLng.lng + 0.005, name: "Women's Help Center", type: "help_center" },
      ];

      // Add markers for safe places
      safePlaces.forEach((place) => {
        const iconUrl = place.type === "police" ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png" : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
        
        new window.google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map,
          title: place.name,
          icon: {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });
      });
    };
    document.head.appendChild(script);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Nearby Safe Spots</h3>
      <div id="map" ref={mapRef} style={{ width: '100%', height: '500px', borderRadius: '12px' }}></div>
    </div>
  );
};

export default SafeSpotsMap;