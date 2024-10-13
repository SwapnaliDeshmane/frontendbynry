import React, { useState, useEffect } from 'react';

// Mock profiles data
let mockProfiles = [
  {
    id: 1,
    name: "John Doe",
    description: "Software Engineer",
    photo: "https://via.placeholder.com/150",
    email: "john@example.com",
    phone: "123-456-7890",
    address: {
      street: "123 Tech St",
      city: "San Francisco",
      country: "USA",
      coordinates: [37.7749, -122.4194]
    }
  },
  // Add more mock profiles as needed
];

// Mock API functions
const fetchProfilesAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProfiles);
    }, 500);
  });
};

const addProfileAPI = (newProfile) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = mockProfiles.length + 1;
      const profileWithId = { ...newProfile, id };
      mockProfiles.push(profileWithId);
      resolve(profileWithId);
    }, 500);
  });
};

const deleteProfileAPI = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockProfiles = mockProfiles.filter(profile => profile.id !== id);
      resolve({ success: true });
    }, 500);
  });
};

function AdminDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [newProfile, setNewProfile] = useState({
    name: '',
    description: '',
    photo: '',
    email: '',
    phone: '',
    address: { street: '', city: '', country: '', coordinates: [0, 0] }
  });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewProfile(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const addedProfile = await addProfileAPI(newProfile);
      setProfiles(prev => [...prev, addedProfile]);
      setNewProfile({
        name: '',
        description: '',
        photo: '',
        email: '',
        phone: '',
        address: { street: '', city: '', country: '', coordinates: [0, 0] }
      });
      setLoading(false);
    } catch (error) {
      console.error('Error adding profile:', error);
      setError('Failed to add profile. Please try again later.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteProfileAPI(id);
      setProfiles(prev => prev.filter(profile => profile.id !== id));
      setLoading(false);
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError('Failed to delete profile. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={newProfile.name} onChange={handleInputChange} placeholder="Name" required />
        <input type="text" name="description" value={newProfile.description} onChange={handleInputChange} placeholder="Description" required />
        <input type="text" name="photo" value={newProfile.photo} onChange={handleInputChange} placeholder="Photo URL" required />
        <input type="email" name="email" value={newProfile.email} onChange={handleInputChange} placeholder="Email" required />
        <input type="tel" name="phone" value={newProfile.phone} onChange={handleInputChange} placeholder="Phone" required />
        <input type="text" name="street" value={newProfile.address.street} onChange={handleAddressChange} placeholder="Street" required />
        <input type="text" name="city" value={newProfile.address.city} onChange={handleAddressChange} placeholder="City" required />
        <input type="text" name="country" value={newProfile.address.country} onChange={handleAddressChange} placeholder="Country" required />
        <button type="submit">Add Profile</button>
      </form>
      <h2>Existing Profiles</h2>
      <ul>
        {profiles.map(profile => (
          <li key={profile.id}>
            {profile.name} - {profile.email}
            <button onClick={() => handleDelete(profile.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;