import React from "react";
import Navbar from "./Navbar";
import Footer from "./footer.jsx";

import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa"; // Importing icons from react-icons

const ContactPage = () => {
  // Function to handle sending a message on WhatsApp
  const handleSendMessage = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const whatsappLink = `https://wa.me/${whatsappNumber}`;

    console.log("WhatsApp Link:", whatsappLink);
    window.open(whatsappLink, "_blank");
  };

  // Function to open Google Maps with directions
  const handleDirections = () => {
    const shopLatitude = 25.344338;
    const shopLongitude = 74.63452;

    // Open Google Maps with directions to the specified coordinates
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${shopLatitude},${shopLongitude}`,
      "_blank"
    );
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-10 p-8 rounded-lg shadow-lg bg-white relative overflow-hidden" 
      style={{marginTop: "21vh"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30"></div>
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-6 relative z-10">Contact Us</h1>
        <hr className="border-gray-300 mb-4" />
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-semibold text-center text-gray-700 mb-4 relative z-10">Shop Address</h2>
          <p className="text-lg text-center text-gray-600 mb-6 relative z-10">
            Damji Govindji, Sarkari Darwaza, Railway Station Road, Bhopal-Ganj,
            Bhilwara, Rajasthan, 311001
          </p>
          <div className="flex flex-col md:flex-row justify-center mt-4 relative z-10">
            <button
              className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition transform duration-300 ease-in-out mx-2 mb-2 md:mb-0 hover:scale-105"
              onClick={handleSendMessage}
            >
              <FaWhatsapp className="mr-2" />
              Contact on WhatsApp
            </button>
            <button
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition transform duration-300 ease-in-out mx-2 hover:scale-105"
              onClick={handleDirections}
            >
              <FaMapMarkerAlt className="mr-2" />
              Directions on Map
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;