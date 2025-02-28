import React from "react";
import Navbar from "./Navbar";
import Footer from "./footer.jsx";
import { motion } from "framer-motion";
import { FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaStore } from "react-icons/fa";

const ContactPage = () => {
  const handleSendMessage = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const defaultMessage =
      "Hello! I need assistance regarding your products.\n" +
      "I recently visited your website and wanted to contact you for more information.\n" +
      "Could you please provide me with the details I need?"; 
    const encodedMessage = encodeURIComponent(defaultMessage); 
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, "_blank");
  };

  const handleDirections = () => {
    const shopLatitude = 25.344338;
    const shopLongitude = 74.63452;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${shopLatitude},${shopLongitude}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16" style={{ marginTop: "10vh" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Elegant Header Section */}
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 relative"
            >
              Contact Us
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto"
            >
              We're here to assist you with any questions about our products
            </motion.p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: <FaPhone className="text-2xl" />,
                title: "Phone",
                content: "+91 1234567890",
                color: "bg-blue-500/10 text-blue-600"
              },
              {
                icon: <FaEnvelope className="text-2xl" />,
                title: "Email",
                content: "info@damjigovindji.com",
                color: "bg-purple-500/10 text-purple-600"
              },
              {
                icon: <FaClock className="text-2xl" />,
                title: "Business Hours",
                content: "Mon - Sat: 10:00 AM - 8:00 PM",
                color: "bg-green-500/10 text-green-600"
              },
              {
                icon: <FaStore className="text-2xl" />,
                title: "Store Location",
                content: "Bhilwara, Rajasthan",
                color: "bg-red-500/10 text-red-600"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color} mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Store Location Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden mb-16 border border-slate-200/50"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-6">Visit Our Store</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <FaMapMarkerAlt className="text-2xl text-blue-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-xl mb-2">Store Address</h3>
                        <p className="text-slate-300 leading-relaxed">
                          Damji Govindji, Sarkari Darwaza,<br />
                          Railway Station Road, Bhopal-Ganj,<br />
                          Bhilwara, Rajasthan, 311001
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={handleDirections}
                        className="flex items-center space-x-2 bg-blue-500/90 hover:bg-blue-600 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-95"
                      >
                        <FaMapMarkerAlt />
                        <span>Get Directions</span>
                      </button>
                      <button
                        onClick={handleSendMessage}
                        className="flex items-center space-x-2 bg-green-500/90 hover:bg-green-600 px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-95"
                      >
                        <FaWhatsapp />
                        <span>WhatsApp Us</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[500px] relative">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.6774366569584!2d${74.63452}!3d${25.344338}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDIwJzM5LjYiTiA3NMKwMzgnMDQuMyJF!5e0!3m2!1sen!2sin!4v1635835657898!5m2!1sen!2sin`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
