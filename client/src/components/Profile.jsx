import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Alert, AlertTitle, CircularProgress, Dialog, Box, Typography } from '@mui/material';
import { AccountCircle, Cancel, Save, Person, Email, Phone, LocationOn, Edit as EditIcon, CloudUpload } from '@mui/icons-material';
import Navbar from './Navbar';
import Footer from './footer';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import saveAnimation from '../assets/animations/Profile-save.json';

const Profile = () => {
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [alert, setAlert] = useState('');
    const [success, setSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSaveAnimation, setShowSaveAnimation] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const navigate = useNavigate();
    const apiUrl = "https://e-commerce-capstone.onrender.com";

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const userResponse = await axios.get(`${apiUrl}/login/success`, {
                    withCredentials: true,  
                });
                const userData = userResponse.data.user;
                setUserData(userData);
                setImagePreview(userData.ownerImg);
            } catch (error) {
                console.error(error);
                navigate('/error');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate, apiUrl]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const contact = userData.contact || '';

        if (contact.length === 0 || contact.length === 10) {
            try {
                const formData = new FormData();
                formData.append('name', userData.name);
                formData.append('contact', contact);
                formData.append('address', userData.address || '');

                if (userData.ownerImg) {
                    formData.append('ownerImg', userData.ownerImg);
                }

                setLoading(true);
                await axios.put(`${apiUrl}/update/${userData._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true, 
                });
                setSaveMessage("Profile Updated Successfully!");
                setShowSaveAnimation(true);
                setTimeout(() => {
                    setShowSaveAnimation(false);
                    setIsEditing(false);
                    navigate('/profile');
                }, 2000);
            } catch (err) {
                console.error(err);
                setAlert("Failed to update profile. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            setAlert("Contact number must be exactly 10 digits if provided.");
        }
    };

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess('');
                navigate('/profile');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);


    const handleChange = (e) => {
        if (e.target.name === 'ownerImg') {
            const file = e.target.files[0];
            setUserData({ ...userData, ownerImg: file });
            setImagePreview(URL.createObjectURL(file));
        } else {
            setUserData({ ...userData, [e.target.name]: e.target.value });
        }
    };

    const SaveAnimation = () => (
        <Dialog
            open={showSaveAnimation}
            PaperProps={{
                sx: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ 
                width: 300, 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2
            }}>
                <Box sx={{ width: 150, height: 150 }}>
                    <Lottie
                        animationData={saveAnimation}
                        loop={false}
                        style={{ width: '100%', height: '100%' }}
                    />
                </Box>
                <Typography
                    sx={{
                        color: '#fff',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        mt: 2,
                        backgroundColor: 'rgba(37, 99, 235, 0.9)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {saveMessage}
                </Typography>
            </Box>
        </Dialog>
    );

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-100">
            <Navbar option="profile" />
            
            <div className="container mx-auto px-4 py-16" style={{ marginTop: '4vh' }}>
                {/* Professional Loading Overlay */}
                <AnimatePresence>
                    {loading && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center"
                        >
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-md mx-4"
                            >
                                <div className="relative">
                                    <CircularProgress size={60} className="text-slate-800" />
                                    <div className="absolute inset-0 animate-ping bg-slate-400 rounded-full opacity-20"></div>
                                </div>
                                <p className="mt-6 text-xl font-semibold text-slate-700">Loading Profile Data...</p>
                                <p className="mt-2 text-slate-500">Please wait while we fetch your information</p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Enterprise-style Alerts with right padding */}
                <AnimatePresence>
                    {(alert || success) && (
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-8 sm:px-0 right-8"
                            style={{ right: '10vh' }}
                        >
                            {alert && (
                                <Alert 
                                    severity="error" 
                                    className="shadow-2xl rounded-xl backdrop-blur-xl bg-white/95 border-l-4 border-red-500"
                                    icon={<Cancel className="text-2xl" />}
                                >
                                    <AlertTitle className="font-bold text-lg">Error</AlertTitle>
                                    <p className="text-sm">{alert}</p>
                                </Alert>
                            )}
                            {success && (
                                <Alert 
                                    severity="success" 
                                    className="shadow-2xl rounded-xl backdrop-blur-xl bg-white/95 border-l-4 border-emerald-500"
                                    icon={<Save className="text-2xl" />}
                                >
                                    <AlertTitle className="font-bold text-lg">Success</AlertTitle>
                                    <p className="text-sm">{success}</p>
                                </Alert>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto"
                >
                    {isEditing ? (
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 sm:p-12">
                            <div className="max-w-4xl mx-auto">
                                <motion.div 
                                    className="text-center mb-12"
                                    initial={{ y: -20 }}
                                    animate={{ y: 0 }}
                                >
                                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                                        Edit Profile Information
                                    </h1>
                                    <p className="mt-3 text-slate-500">Update your account details and preferences</p>
                                </motion.div>

                                <div className="grid md:grid-cols-12 gap-8">
                                    {/* Left Column - Professional Image Upload */}
                                    <motion.div 
                                        className="md:col-span-5 space-y-6"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="relative group">
                                            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Profile Preview"
                                                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                                                        <AccountCircle style={{ fontSize: '6rem' }} className="text-slate-300" />
                                                    </div>
                                                )}
                                                <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                                                    <CloudUpload className="text-white text-4xl mb-3" />
                                                    <span className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-white/20">
                                                        Change Photo
                                                    </span>
                                                    <input
                                                        type="file"
                                                        name="ownerImg"
                                                        accept="image/*"
                                                        onChange={handleChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                            <p className="mt-2 text-sm text-slate-500 text-center">
                                                Click to upload a new profile picture
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Right Column - Professional Form Fields */}
                                    <motion.div 
                                        className="md:col-span-7 space-y-6"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {[
                                            { icon: <Person />, name: 'name', label: 'Full Name' },
                                            { icon: <Email />, name: 'username', label: 'Email Address' },
                                            { icon: <Phone />, name: 'contact', label: 'Phone Number' },
                                            { icon: <LocationOn />, name: 'address', label: 'Shipping Address' }
                                        ].map((field, index) => (
                                            <motion.div 
                                                key={field.name}
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 + (index * 0.1) }}
                                            >
                                                <label className="text-sm font-medium text-slate-700 mb-1 block">
                                                    {field.label}
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                        {field.icon}
                                                    </div>
                                                    <TextField
                                                        name={field.name}
                                                        value={userData[field.name] || ''}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        fullWidth
                                                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                                                        className="bg-slate-50"
                                                        InputProps={{
                                                            startAdornment: <div className="w-10" />,
                                                            className: "rounded-xl border-slate-200 hover:border-slate-300 transition-colors"
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>

                                {/* Professional Action Buttons */}
                                <motion.div 
                                    className="flex justify-end space-x-4 mt-12 pt-6 border-t border-slate-200"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2 rounded-lg border-2 border-slate-300 text-slate-600 hover:bg-slate-50"
                                        startIcon={<Cancel />}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleUpdate}
                                        className="px-6 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white"
                                        startIcon={<Save />}
                                    >
                                        Save Changes
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    ) : (
                        // Professional View Mode
                        <motion.div 
                            className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
                            whileHover={{ boxShadow: "0 20px 40px rgb(0,0,0,0.12)" }}
                        >
                            {/* Profile Header */}
                            <div className="relative h-48 bg-gradient-to-r from-slate-800 to-slate-900">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-400 via-slate-500 to-slate-600"></div>
                            </div>

                            <div className="relative px-8 sm:px-12 pb-12 -mt-24">
                                <motion.div 
                                    className="text-center"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    <div className="relative inline-block">
                                        {userData.ownerImg ? (
                                            <img
                                                src={userData.ownerImg}
                                                alt="Profile"
                                                className="w-48 h-48 rounded-2xl object-cover border-4 border-white shadow-xl"
                                            />
                                        ) : (
                                            <div className="w-48 h-48 rounded-2xl bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center">
                                                <AccountCircle className="text-slate-300" style={{ fontSize: '5rem' }} />
                                            </div>
                                        )}
                                        <motion.button
                                            className="absolute -bottom-3 -right-3 p-3 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
                                            whileHover={{ scale: 1.1 }}
                                            onClick={handleEdit}
                                        >
                                            <EditIcon className="text-slate-600" />
                                        </motion.button>
                                    </div>

                                    <motion.h2 
                                        className="mt-6 text-3xl font-bold text-slate-800"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {userData.name || "Your Name"}
                                    </motion.h2>
                                    <motion.p 
                                        className="mt-2 text-slate-500"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {userData.username || "email@example.com"}
                                    </motion.p>
                                </motion.div>

                                <motion.div 
                                    className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {[
                                        { icon: <Phone className="text-slate-400" />, label: 'Contact Number', value: userData.contact },
                                        { icon: <LocationOn className="text-slate-400" />, label: 'Shipping Address', value: userData.address }
                                    ].map((item, index) => (
                                        <motion.div 
                                            key={item.label}
                                            className="p-6 rounded-xl bg-slate-50 border border-slate-100"
                                            whileHover={{ 
                                                scale: 1.02,
                                                backgroundColor: '#ffffff',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 rounded-lg bg-slate-100">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">{item.label}</p>
                                                    <p className="text-lg font-semibold text-slate-800">
                                                        {item.value || "Not provided"}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
            <SaveAnimation />
            <Footer />
        </div>
    );
};

export default Profile;
