import React from 'react'
import logo from '../assets/logo.png'
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const Footer = () => {
  const contactInfo = [
    { icon: <Email className="text-blue-500" />, text: 'balajielectronic@gmail.com' },
    { icon: <Phone className="text-blue-500" />, text: '+91 (123) 456-7890' },
    { icon: <LocationOn className="text-blue-500" />, text: (
      <a 
        href="https://www.google.com/maps/dir/?api=1&destination=25.344395697240383, 74.6345231602888"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-500 transition-colors"
      >
        Scale Market Complex, Mumbai (25.3444° N, 74.6345° E)
      </a>
    )},
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} className="h-[60px]" alt="Scale Mart Logo" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Scale Mart
              </h2>
            </div>
            <p className="text-gray-600">
              India's leading manufacturer of high-precision weighing scales.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Facebook />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Twitter />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Instagram />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <LinkedIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/" className="text-gray-600 hover:text-blue-500 transition-colors">
                Home
              </Link>
              <Link to="/product" className="text-gray-600 hover:text-blue-500 transition-colors">
                Products
              </Link>
           
              <Link to="/contact" className="text-gray-600 hover:text-blue-500 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3">
                  {info.icon}
                  <span className="text-gray-600">{info.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-center md:text-left">
              © {new Date().getFullYear()} Scale Mart. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-500 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
