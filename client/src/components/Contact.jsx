import React from "react";
import Navbar from "./Navbar";
import Footer from "./footer.jsx";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa"; // Importing icons from react-icons

const ContactPage = () => {
  // Function to handle sending a message on WhatsApp
  const handleSendMessage = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const defaultMessage =
      "Hello! I need assistance regarding your products.\n" +
      "I recently visited your website and wanted to contact you for more information.\n" +
      "Could you please provide me with the details I need?"; // Default message
    const encodedMessage = encodeURIComponent(defaultMessage); // Encode the message for URL
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
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
      <div className="container mx-auto my-10 p-6 rounded-lg shadow-2xl bg-gradient-to-b from-white to-gray-100 relative overflow-hidden" style={{ marginTop: "15vh" }}>
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-blue-300 opacity-30 blur-sm"></div>

        {/* Content Container */}
        <div className="relative z-10 p-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-center text-gray-800 mb-4 tracking-wide">
            Contact Us
          </h1>
          <hr className="border-gray-300 mb-6" />

          {/* Address Section */}
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-2">
              Our Shop Location
            </h2>
            <p className="text-base sm:text-lg text-center text-gray-600 mb-6 max-w-2xl">
              Damji Govindji, Sarkari Darwaza, Railway Station Road, Bhopal-Ganj, Bhilwara, Rajasthan, 311001
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <button
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
              onClick={handleSendMessage}
            >
              <FaWhatsapp className="mr-2 text-xl" />
              <span className="text-lg">WhatsApp Us</span>
            </button>

            <button
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
              onClick={handleDirections}
            >
              <FaMapMarkerAlt className="mr-2 text-xl" />
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
