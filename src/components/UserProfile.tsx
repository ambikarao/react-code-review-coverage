import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { useNotification } from '../pages/Notification';

interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    smsUpdates: boolean;
    emailNotifications: boolean;
  };
}

const UserProfile: React.FC = () => {
  const { currentUser } = useApp();
  const { addNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    preferences: {
      newsletter: false,
      smsUpdates: false,
      emailNotifications: true
    }
  });

  const [formData, setFormData] = useState<UserProfileData>(profileData);

  useEffect(() => {
    if (currentUser) {
      const userData: UserProfileData = {
        name: currentUser.name,
        email: currentUser.email,
        phone: '+1 (555) 123-4567', // Mock data
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        preferences: {
          newsletter: true,
          smsUpdates: false,
          emailNotifications: true
        }
      };
      setProfileData(userData);
      setFormData(userData);
    }
  }, [currentUser]);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'address') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: String(value)
          }
        }));
        return;
      }
      if (parent === 'preferences') {
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [child]: Boolean(value)
          }
        }));
        return;
      }
      // Fallback: ignore unknown nested parent to safely
      return;
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfileData(formData);
      setIsEditing(false);
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated.'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update your profile. Please try again.'
      });
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="user-profile">
        <h2>Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>User Profile</h2>
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="save-btn">
                Save Changes
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="profile-section">
          <h3>Address</h3>
          <div className="form-group">
            <label>Street:</label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => handleInputChange('address.street', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City:</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ZIP Code:</label>
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Country:</label>
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) => handleInputChange('address.country', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Preferences</h3>
          <div className="preference-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.preferences.newsletter}
                onChange={(e) => handleInputChange('preferences.newsletter', e.target.checked)}
                disabled={!isEditing}
              />
              Subscribe to newsletter
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.preferences.smsUpdates}
                onChange={(e) => handleInputChange('preferences.smsUpdates', e.target.checked)}
                disabled={!isEditing}
              />
              SMS updates
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.preferences.emailNotifications}
                onChange={(e) => handleInputChange('preferences.emailNotifications', e.target.checked)}
                disabled={!isEditing}
              />
              Email notifications
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
