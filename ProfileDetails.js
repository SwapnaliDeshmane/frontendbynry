import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Mock API function
const fetchProfileAPI = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: id,
        name: "John Doe",
        description: "Software Engineer",
        photo: "https://via.placeholder.com/150",
        email: "john.doe@example.com",
        phone: "+1 123-456-7890",
        address: {
          street: "123 Tech St",
          city: "San Francisco",
          country: "USA",
          coordinates: [37.7749, -122.4194]
        }
      });
    }, 1000); // Simulate network delay
  });
};

function ProfileDetails() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchProfileDetails();
  }, [id]);

  const fetchProfileDetails = async () => {
    try {
      const data = await fetchProfileAPI(id);
      setProfile(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to fetch profile details. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profile) {
    return <div className="error">Profile not found.</div>;
  }

  return (
    <div className="profile-details">
      <h1>{profile.name}</h1>
      <img src={profile.photo} alt={profile.name} />
      <p>{profile.description}</p>
      <h2>Contact Information</h2>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
      <h2>Address</h2>
      <p>{profile.address.street}, {profile.address.city}, {profile.address.country}</p>
      <div className="map-container">
        <MapContainer center={profile.address.coordinates} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={profile.address.coordinates}>
            <Popup>{profile.name}<br />{profile.address.street}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default ProfileDetails;