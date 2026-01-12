import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    // Fetch user data from backend after Google OAuth
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/google/success', {
          credentials: 'include' // Include cookies
        });

        const data = await response.json();

        if (data.success) {
          // Update auth context with user data
          setUser(data.user);
          // Redirect to homepage
          navigate('/');
        } else {
          // Authentication failed
          navigate('/login?error=google_auth_failed');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login?error=google_auth_failed');
      }
    };

    fetchUserData();
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#A67C52]"></div>
        <p className="mt-4 text-gray-600">Completing Google Sign-In...</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
