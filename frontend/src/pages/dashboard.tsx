import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { Navigate } from "react-router-dom";
import { LogOut, Sun, Moon, X } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [transportType, setTransportType] = useState("Flight");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [bookedTicket, setBookedTicket] = useState<{ type: string, origin: string, destination: string, date: string } | null>(null);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !date) return;
    setBookedTicket({ type: transportType, origin, destination, date });
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-gray-800 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Transport Booking
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setShowLogoutDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition shadow-md"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-12">

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">

          {/* Top Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8">

            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name}
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-800"
              />
            </div>

            <div className="mt-6 sm:mt-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {user.email}
              </p>
              <span className="inline-block mt-3 px-3 py-1 text-xs font-semibold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                User ID: {user.id}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-gray-200 dark:bg-gray-800"></div>

          {/* Ticket Booking Form */}
          <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Book a Ticket
            </h3>
            
            {bookedTicket ? (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center animate-fadeIn">
                <h4 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Booking Confirmed!</h4>
                <p className="text-green-700 dark:text-green-400">
                  Your {bookedTicket.type} ticket from <strong>{bookedTicket.origin}</strong> to <strong>{bookedTicket.destination}</strong> on <strong>{bookedTicket.date}</strong> has been successfully booked.
                </p>
                <button 
                  onClick={() => setBookedTicket(null)}
                  className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition shadow-md"
                >
                  Book Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="grid md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transport Type</label>
                  <select 
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="Flight">✈️ Flight</option>
                    <option value="Train">🚂 Train</option>
                    <option value="Bus">🚌 Bus</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Origin</label>
                  <input 
                    type="text" 
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="E.g. New York"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination</label>
                  <input 
                    type="text" 
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="E.g. London"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2 mt-2">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-lg"
                  >
                    Book Ticket
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </main>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] max-w-md p-6 relative animate-fadeIn">

            <button
              onClick={() => setShowLogoutDialog(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Confirm Logout
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mt-3">
              Are you sure you want to logout from your account?
            </p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;