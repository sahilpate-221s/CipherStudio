import React, { useState, useEffect } from "react";
import LoginSignupModal from "./LoginSignupModal";
import { Link, useNavigate } from "react-router-dom";
import { getUserProfile, logoutUser } from "../../services/api/userApi";
import { useTheme } from "../../hooks/useTheme";
import { Sun, Moon } from "lucide-react";

export default function Navbar({ onEnter }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getUserProfile();
        setUser(response.user);
      } catch {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-200/45 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo1.png"
              alt="Logo"
              className="w-20 h-10 object-contain"
            />
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg border border-gray-700 dark:border-gray-400 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5 text-black" />
              )}
            </button>

            {user ? (
              <>
                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-800 dark:text-gray-300
                     hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-lg border border-gray-600 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <span>{user.username}</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
                      <Link
                        to="/projects"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Projects
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                <button
                  className="inline-flex border border-gray-600 dark:border-gray-700 dark:bg-gray-900  dark:text-white text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={onEnter}
                >
                  Open CipherStudio
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  Log in
                </button>
                <button
                  className="inline-flex border border-gray-300 dark:border-gray-700 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={onEnter}
                >
                  Open CipherStudio
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              aria-label="Menu"
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile dropdown */}
      {isDropdownOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white/90 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 rounded-b-3xl">
          <div className="max-w-full mx-auto px-6 sm:px-8 py-4 flex flex-col space-y-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer self-center"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {user ? (
              <div className="relative self-center">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <span>{user.username}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to="/projects"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsDropdownOpen(false);
                      }}
                    >
                      My Projects
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsDropdownOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsDropdownOpen(false);
                }}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-4 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 text-center"
              >
                Log in
              </button>
            )}
            <button
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold px-4 py-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200"
              onClick={() => {
                onEnter();
                setIsDropdownOpen(false);
              }}
            >
              Open CipherStudio
            </button>
          </div>
        </div>
      )}

      <LoginSignupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
