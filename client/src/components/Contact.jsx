import React from "react";
import Navbar from "./Navbar";
import Footer from "./footer.jsx";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa"; // Importing icons from react-icons

const ContactPage = () => {
  // Function to handle sending a message on WhatsApp
  const handleSendMessage = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const whatsappLink = `https://wa.me/${whatsappNumber}`;
    window.open(whatsappLink, "_blank");
  };

  // Function to open Google Maps with directions
  const handleDirections = () => {
    const shopLatitude = 25.344338;
    const shopLongitude = 74.63452;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${shopLatitude},${shopLongitude}`,
      "_blank"
    );
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-10 p-8 rounded-lg shadow-2xl bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden" style={{ marginTop: "15vh" }}>
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 opacity-40 blur-sm"></div>

        {/* Content Container */}
        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold text-center text-gray-900 mb-6 tracking-wider">Contact Us</h1>
          <hr className="border-gray-300 mb-8" />

          {/* Address Section */}
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">Our Shop Location</h2>
            <p className="text-lg text-center text-gray-600 mb-8 max-w-2xl">
              Damji Govindji, Sarkari Darwaza, Railway Station Road, Bhopal-Ganj, Bhilwara, Rajasthan, 311001
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 relative z-10">
            <button
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-transform transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
              onClick={handleSendMessage}
            >
              <FaWhatsapp className="mr-3 text-xl" />
              <span className="text-lg">WhatsApp Us</span>
            </button>

            <button
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-transform transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
              onClick={handleDirections}
            >
              <FaMapMarkerAlt className="mr-3 text-xl" />
              <span className="text-lg">Get Directions</span>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
