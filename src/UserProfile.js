import React, { useEffect, useState } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // ✅ Hardcoded for testing
  const testStudentId = "0122430034";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/profile/${testStudentId}`);
        if (!response.ok) throw new Error("Profile not found");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div className="user-profile-container">Loading...</div>;
  if (!user) return <div className="user-profile-container">User not found.</div>;

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <div className="profile-item"><span>Name:</span> {user.username}</div>
      <div className="profile-item"><span>Student ID:</span> {user.studentId}</div>
      <div className="profile-item"><span>Email:</span> {user.email}</div>
      <div className="profile-item"><span>Total Uploaded Files:</span> {user.uploadedFiles || 0}</div>
    </div>
  );
};

export default UserProfile;
