import Navbar from '../../components/Navbar';

const Bookings = () => {
  return (
    <>
      <Navbar currentPage="bookings" />
      <main className="container mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 max-w-6xl">
        <h2 className="text-3xl text-red-500 font-bold text-center mb-6">
          My Bookings
        </h2>
        <div className="text-center text-gray-600">
          <p>No bookings yet. Start exploring homes to make your first booking!</p>
        </div>
      </main>
    </>
  );
};

export default Bookings;
