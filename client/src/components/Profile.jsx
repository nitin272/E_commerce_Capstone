import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Alert, AlertTitle, CircularProgress } from '@mui/material';
import { AccountCircle, Cancel, Save } from '@mui/icons-material';
import Navbar from './Navbar';
import Footer from './footer';

const Profile = () => {
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [alert, setAlert] = useState('');
    const [success, setSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_APP_API_URL;

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
                setSuccess("Profile updated successfully");
                setIsEditing(false);
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

    return (
        <div className="bg-gray-50">
            <Navbar option="profile" />
            <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-center" style={{ marginTop: '12vh' }}>
                {loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
                        <CircularProgress />
                    </div>
                )}
                {alert && (
                    <Alert severity="error" className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full md:w-1/2">
                        <AlertTitle className="font-bold">Error</AlertTitle>
                        {alert}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full md:w-1/2">
                        <AlertTitle className="font-bold">Success</AlertTitle>
                        {success}
                    </Alert>
                )}
                {isEditing ? (
                    <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg transition-all duration-300">
                        <h1 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-gray-700">Update Profile</h1>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <TextField
                                    type="text"
                                    name='name'
                                    value={userData.name || ''}
                                    label='Name'
                                    variant="outlined"
                                    fullWidth
                                    onChange={handleChange}
                                    placeholder='Enter your name'
                                    InputProps={{
                                        className: "rounded-md"
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <TextField
                                    type="text"
                                    name='email'
                                    label='Email'
                                    variant="outlined"
                                    fullWidth
                                    value={userData.username || ''}
                                    readOnly
                                    InputProps={{
                                        className: "rounded-md"
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <TextField
                                    type="tel"
                                    name='contact'
                                    label='Contact no.'
                                    variant="outlined"
                                    fullWidth
                                    value={userData.contact || ''}
                                    placeholder='Enter your contact no.'
                                    onChange={handleChange}
                                    inputProps={{ maxLength: 10 }}
                                    InputProps={{
                                        className: "rounded-md"
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <TextField
                                    type="text"
                                    name='address'
                                    value={userData.address || ''}
                                    label='Address'
                                    variant="outlined"
                                    fullWidth
                                    onChange={handleChange}
                                    placeholder='Enter your address'
                                    InputProps={{
                                        className: "rounded-md"
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="file"
                                    name="ownerImg"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 cursor-pointer focus:outline-none focus:ring focus:ring-blue-300"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Profile Preview"
                                        className="mt-4 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 xl:h-80 xl:w-80 object-cover rounded-full mx-auto border-4 border-gray-300 shadow-md"
                                    />
                                )}
                            </div>
                            <div className="flex justify-between mt-4">
                                <Button
                                    variant='contained'
                                    color="primary"
                                    size='large'
                                    endIcon={<Save />}
                                    type="submit"
                                    className="rounded-md hover:bg-blue-600 transition duration-200"
                                >
                                    Update
                                </Button>
                                <Button
                                    variant='contained'
                                    color="secondary"
                                    size='large'
                                    endIcon={<Cancel />}
                                    onClick={() => setIsEditing(false)}
                                    className="rounded-md hover:bg-red-600 transition duration-200"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg text-center transition-all duration-300">
                        {userData.ownerImg ? (
                            <img
                                className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 xl:h-80 xl:w-80 rounded-full mx-auto mb-8 border-4 border-gray-300 shadow-md object-cover"
                                src={userData.ownerImg}
                                alt="Owner"
                            />
                        ) : (
                            <div className="flex justify-center mb-8">
                                <AccountCircle style={{ fontSize: "8rem", color: 'gray' }} />
                            </div>
                        )}
                        <div className="mb-8">
                            <p className="text-xl md:text-2xl font-semibold mb-2 text-gray-700">Name: {userData.name || "-----"}</p>
                            <p className="text-lg md:text-xl mb-2 text-gray-600">Email: {userData.username || "-----"}</p>
                            <p className="text-lg md:text-xl mb-2 text-gray-600">Contact: {userData.contact || "-----"}</p>
                            <p className="text-lg md:text-xl text-gray-600">Address: {userData.address || "-----"}</p>
                        </div>
                        <Button
                            variant='contained'
                            color="primary"
                            size="large"
                            onClick={handleEdit}
                            className="rounded-md hover:bg-blue-600 transition duration-200"
                        >
                            Edit
                        </Button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
    
};

export default Profile;
