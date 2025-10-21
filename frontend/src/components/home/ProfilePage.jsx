import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../../services/api/userApi';
import { useTheme } from '../../hooks/useTheme';
import { User, Mail, Palette, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setUser(response.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'
        }`}
      >
        <div className="text-center">
          <p className="text-gray-400 mb-4 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="border border-gray-400 px-4 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 text-sm transition-colors ${
              theme === 'light'
                ? 'text-gray-600 hover:text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
          <div></div>
        </div>

        {/* Profile Card */}
        <div
          className={`rounded-2xl border p-10 transition-all duration-500 ${
            theme === 'light'
              ? 'bg-gray-50 border-gray-300' // ← stronger border color
              : 'bg-white/5 border-white/10'
          }`}
        >
          {/* Avatar */}
          <div className="flex flex-col items-center mb-10">
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center mb-4 ${
                theme === 'light' ? 'bg-gray-200' : 'bg-white/10'
              }`}
            >
              <User
                size={56}
                className={`${theme === 'light' ? 'text-black' : 'text-white'}`}
              />
            </div>
            <h2 className="text-2xl font-medium mb-1">{user?.username}</h2>
            <p
              className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              {user?.email}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Username */}
            <div
              className={`rounded-lg p-5 border transition-colors ${
                theme === 'light'
                  ? 'border-gray-300 hover:border-gray-400' // ↑ stronger border
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <User
                  size={16}
                  className={`${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  Username
                </span>
              </div>
              <p className="text-lg">{user?.username}</p>
            </div>

            {/* Email */}
            <div
              className={`rounded-lg p-5 border transition-colors ${
                theme === 'light'
                  ? 'border-gray-300 hover:border-gray-400'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Mail
                  size={16}
                  className={`${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  Email
                </span>
              </div>
              <p className="text-lg">{user?.email}</p>
            </div>

            {/* Theme Selection */}
            <div
              className={`rounded-lg p-5 border transition-colors sm:col-span-2 ${
                theme === 'light'
                  ? 'border-gray-300 hover:border-gray-400'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Palette
                  size={16}
                  className={`${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  Theme Preference
                </span>
              </div>

              <div className="flex gap-6">
                {/* Dark Option */}
                <label className="flex items-center gap-2 cursor-pointer group">
                  <span
                    className={`w-4 h-4 rounded-full border transition-all ${
                      theme === 'dark'
                        ? 'border-black bg-black'
                        : 'border-gray-400 bg-transparent'
                    }`}
                  ></span>
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={() => handleThemeChange('dark')}
                    className="hidden"
                  />
                  <span
                    className={`text-sm ${
                      theme === 'dark'
                        ? 'text-black dark:text-white'
                        : 'text-gray-500 group-hover:text-black'
                    }`}
                  >
                    Dark
                  </span>
                </label>

                {/* Light Option */}
                <label className="flex items-center gap-2 cursor-pointer group">
                  <span
                    className={`w-4 h-4 rounded-full border transition-all ${
                      theme === 'light'
                        ? 'border-black bg-black'
                        : 'border-gray-400 bg-transparent'
                    }`}
                  ></span>
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={() => handleThemeChange('light')}
                    className="hidden"
                  />
                  <span
                    className={`text-sm ${
                      theme === 'light'
                        ? 'text-black'
                        : 'text-gray-400 group-hover:text-white'
                    }`}
                  >
                    Light
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div
            className={`border-t mt-10 pt-6 text-sm ${
              theme === 'light' ? 'border-gray-300' : 'border-white/10'
            }`}
          >
            <h3
              className={`font-medium mb-4 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}
            >
              Account Information
            </h3>
            <div
              className={`grid sm:grid-cols-2 gap-4 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              <div>
                <p>Member since</p>
                <p
                  className={`${
                    theme === 'light' ? 'text-black' : 'text-white'
                  }`}
                >
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p>Last login</p>
                <p
                  className={`${
                    theme === 'light' ? 'text-black' : 'text-white'
                  }`}
                >
                  {user?.lastLoggedIn
                    ? new Date(user.lastLoggedIn).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
