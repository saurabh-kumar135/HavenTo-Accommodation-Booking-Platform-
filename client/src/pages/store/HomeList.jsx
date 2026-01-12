import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHomes, addToFavourite } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import HomeCard from '../../components/HomeCard';

const HomeList = () => {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomes();
  }, []);

  const fetchHomes = async () => {
    try {
      const response = await getHomes();
      if (response.data.success) {
        setHomes(response.data.registeredHomes);
      }
    } catch (error) {
      console.error('Error fetching homes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavourite = async (homeId) => {
    try {
      await addToFavourite(homeId);
      navigate('/favourites'); // Navigate to favourites page
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };

  return (
    <>
      <Navbar currentPage="Home" />
      <main className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-6xl">
        <h2 className="text-3xl text-red-500 font-bold text-center mb-6">
          Here are our registered homes:
        </h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {homes.map(home => (
              <HomeCard 
                key={home._id} 
                home={home}
                showDetails={true}
                showFavourite={isLoggedIn}
                onAddFavourite={handleAddFavourite}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default HomeList;
