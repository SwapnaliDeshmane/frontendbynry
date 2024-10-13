import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Mock API data
const mockProfiles = [
  {
    id: 1,
    name: "John Doe",
    description: "Software Engineer",
    photo: "https://via.placeholder.com/150",
    address: {
      street: "123 Tech St",
      city: "San Francisco",
      country: "USA",
      coordinates: [37.7749, -122.4194]
    }
  },
  {
    id: 2,
    name: "Jane Smith",
    description: "Data Scientist",
    photo: "https://via.placeholder.com/150",
    address: {
      street: "456 Data Ave",
      city: "New York",
      country: "USA",
      coordinates: [40.7128, -74.0060]
    }
  },
  // Add more mock profiles as needed
];

// Mock API function
const fetchProfilesAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProfiles);
    }, 1000); // Simulate network delay
  });
};

function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const data = await fetchProfilesAPI();
      setProfiles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError('Failed to fetch profiles. Please try again later.');
      setLoading(false);
    }
  };

  const handleShowOnMap = (profile) => {
    setSelectedProfile(profile);
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading profiles...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile-list">
      <h1>Profiles</h1>
      <input
        type="text"
        placeholder="Search profiles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="profiles-container">
        {filteredProfiles.map(profile => (
          <div key={profile.id} className="profile-card">
            <img src={profile.photo} alt={profile.name} />
            <h2>{profile.name}</h2>
            <p>{profile.description}</p>
            <Link to={`/profile/${profile.id}`}>View Details</Link>
            <button onClick={() => handleShowOnMap(profile)}>Show on Map</button>
          </div>
        ))}
      </div>
      {selectedProfile && (
        <div className="map-container">
          <MapContainer center={selectedProfile.address.coordinates} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={selectedProfile.address.coordinates}>
              <Popup>{selectedProfile.name}<br />{selectedProfile.address.street}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default ProfileList;