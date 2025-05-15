import React, { useState, useEffect } from 'react';
import './Profile.css';
import { getUserProfile, updateUserProfile, changePassword } from '../lib/supabase';
import zxcvbn from 'zxcvbn'; // For password strength

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [passwordChangeMode, setPasswordChangeMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState<{ oldPassword: string; newPassword: string }>({
    oldPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState<boolean>(false); // For loading state
  const [passwordStrength, setPasswordStrength] = useState<number>(0); // For password strength score

  useEffect(() => {
    // Fetch logged-in user data from localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setUserData(currentUser);
    setFormData(currentUser);
  }, []);

  const handleProfileEdit = () => {
    setEditing(!editing);
  };

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email");
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleProfileSave = async () => {
    if (!validateForm()) return;

    setLoading(true); // Set loading state to true
    try {
      if (formData.profilePictureFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          await updateUserProfile({
            ...formData,
            profilePicture: base64data,
          });
          setUserData({ ...formData, profilePicture: base64data });
          localStorage.setItem("currentUser", JSON.stringify(formData));
          alert('Profile Updated Successfully!');
        };
        reader.readAsDataURL(formData.profilePictureFile);
      } else {
        await updateUserProfile(formData);
        setUserData(formData);
        localStorage.setItem("currentUser", JSON.stringify(formData));
        alert('Profile Updated Successfully!');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setLoading(false); // Set loading state to false after save
    setEditing(false);
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    try {
      await changePassword(passwordData.newPassword);
      setPasswordChangeMode(false);
      alert('Password Changed Successfully!');
    } catch (error) {
      console.error("Error changing password:", error);
    }
    setLoading(false);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      const file = files?.[0];
      if (file) {
        setFormData({ ...formData, profilePictureFile: file });
        setProfilePicPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePasswordChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });

    // Update password strength score
    if (name === 'newPassword') {
      const strength = zxcvbn(value).score;
      setPasswordStrength(strength);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center dark:bg-gray-900 dark:text-white"
      style={{
        backgroundImage: "url('/path-to-your-image.jpg')", // Replace with your image URL
      }}
    >
      <div className="profile-header text-center p-6">
        <h2 className="text-4xl text-white">User Profile</h2>
      </div>

      <div className="profile-details grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <div className="profile-picture relative">
          <img
            src={profilePicPreview || userData?.profilePicture || '/default-profile.png'}
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover"
          />
          {editing && (
            <div className="tooltip absolute top-0 right-0 bg-black text-white p-2 rounded">
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleProfileChange}
              />
            </div>
          )}
        </div>

        <div className="profile-info">
          <div className="profile-info-item">
            <label className="block text-white">Name:</label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleProfileChange}
                className="input-field"
              />
            ) : (
              <span className="text-white">{userData?.name}</span>
            )}
          </div>

          <div className="profile-info-item">
            <label className="block text-white">Email:</label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleProfileChange}
                className="input-field"
              />
            ) : (
              <span className="text-white">{userData?.email}</span>
            )}
          </div>

          <div className="profile-info-item">
            <label className="block text-white">Phone Number:</label>
            {editing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleProfileChange}
                className="input-field"
              />
            ) : (
              <span className="text-white">{userData?.phone}</span>
            )}
          </div>

          <div className="profile-actions mt-4">
            {editing ? (
              <button
                onClick={handleProfileSave}
                disabled={loading}
                className="save-btn"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            ) : (
              <button onClick={handleProfileEdit} className="edit-btn">
                Edit Profile
              </button>
            )}
            <button onClick={() => setPasswordChangeMode(true)} className="change-password-btn">
              Change Password
            </button>
            <button onClick={handleLogout} className="logout-btn mt-4">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {passwordChangeMode && (
        <div className="password-change-modal bg-gray-800 p-6 rounded-lg">
          <h3>Change Password</h3>
          <div className="password-inputs">
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChangeInput}
              className="input-field"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChangeInput}
              className="input-field"
            />
            <div className="password-strength">
              Strength: {['Weak', 'Fair', 'Good', 'Strong'][passwordStrength]}
            </div>
          </div>
          <div className="password-actions mt-4">
            <button
              onClick={handlePasswordChange}
              disabled={loading}
              className="save-password-btn"
            >
              {loading ? 'Changing...' : 'Save New Password'}
            </button>
            <button onClick={() => setPasswordChangeMode(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
