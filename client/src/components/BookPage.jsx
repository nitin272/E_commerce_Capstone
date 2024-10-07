import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useConversation from '../Zustand/getConversation'

//MUI component
import { Button } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos,ArrowBack,Chat, LocalMall } from '@mui/icons-material'
const BookPage = () => {
    const { id } = useParams()
    const [product, setData] = useState([])
    const [imgIndex, setIndex] = useState(0)
    const [onlineUser,setOnlineUser] = useState([])
    const [user, setUser] = useState([])
    const [reload, setreload] = useState(false)
    const navigate = useNavigate()
    const { setSelectedConversation } = useConversation()
    const apiUrl = import.meta.env.VITE_APP_API_URL
    //Fetch data
    useEffect(() => {
        setIndex(0)
        const fetchData = async () => {
            try {
                const responnse = await axios.get(`${apiUrl}/product/${id}`)
                // console.log(responnse);
                setreload(true)
                setData(responnse.data)
                console.log(product);
            } catch (error) {
                console.log(error);
            }
        }
        //Fetch User
        const fetchUser = async () => {
            try {
                const id = localStorage.getItem('id')
                const response = await axios.get(`${apiUrl}/login/success`, {
                    headers: id ? { 'Authorization': `Bearer ${id}` } : {},
                    withCredentials: true
                  });
                setOnlineUser(response.data.user)
            } catch (error) {
                console.log(error);
                navigate('/error')
            }
        }
        // console.log("user",user);
        
        //fetch Owner
        const fetchOwner = async () => {
            try {
                const owner = await axios(`${apiUrl}/user`)
                console.log("Owner", owner.data);
                console.log("product data", product.email);
                const actualUser = owner.data.filter((item) => item.username === product.email)

                console.log("actual user", actualUser);
                setUser(actualUser[0])
            } catch (error) {
                console.log(error);
            }
        }

        Promise.all([fetchUser(), fetchData(), fetchOwner()]).then(() => {
            // All functions have completed execution
            console.log("All functions executed successfully");
        }).catch((error) => {
            console.log("Error occurred:", error);
        });

    }, [id, reload])

    console.log("onlineUSer",onlineUser);

    //Handle payment
    const handelPayment = async () => {
        try {
            const response = await axios.post(`${apiUrl}/product/payment`, {
                price: product.price
            })
            console.log(response.data.order.amount);
            const options = {
                amount: product.price && product.price,
                key: import.meta.env.VITE_RAZORPAY_API_KEY,
                currency: "INR",
                name: "Crafters hub",
                description: "Crafters hub",
                image: "https://res.cloudinary.com/dhruv1184/image/upload/v1712914306/uyumc8u8kp4zihunsb2c.png",
                order_id: response.data.order.id,
                callback_url: `${apiUrl}/product/paymentVerification?username=${onlineUser.username}`,
                prefill: {
                    "name": user.name,
                    "email": user.username,
                    "contact": user.contact
                },
                notes: {
                    "address": "Razorpay Corporate Office"
                },
                theme: {
                    "color": "#528FF0"
                }
            };

            const razor = new window.Razorpay(options)
            razor.open()
        } catch (error) {
            console.log(error);
        }
    }

    //image index
    const countIncrease = () => {
        setIndex(prevIndex => {
            if (prevIndex === product.productImg.length - 1) {
                return 0;
            } else {
                return prevIndex + 1;
            }
        });
    };

    const countDecrease = () => {
        setIndex(prevIndex => {
            if (prevIndex === 0) {
                return product.productImg.length - 1;
            } else {
                return prevIndex - 1;
            }
        });
    };

    return (
        <>
        <div className='cursor-pointer m-5 border border-[#1870CB] rounded-full w-max '
        onClick={()=>navigate('/product')}>
            <ArrowBack style={{fontSize:'7vh', color:'#1870CB'}}/>
        </div>
        <div className='sm:flex sm:justify-evenly sm:items-center'>
            <div className='justify-center sm:w-max w-full border shadow-[#1976D2] shadow-[1px_1px_5px_3px] p-5 sm:h-[90vh] '>
                <h1 className='text-3xl font-serif font-bold text-[#001F2B] text-center'>Dealer Information</h1>
                <div className='flex flex-col sm:items-center'>
                    <img
                        src={user && user.ownerImg && user.ownerImg[0]}
                        alt="Owner image"
                        className='sm:w-[30vw] sm:h-[40vh] my-4' />
                    <div className='sm:text-xl mt-4'>
                        {user && user.name && <span>Owner name:- <span className='sm:text-2xl text-xl font-serif font-semibold'>{user.name}</span></span>}
                        <br />
                        {user && user.username && <span>Email:- <span className='sm:text-2xl text-xl font-serif font-semibold'>{user.username}</span></span>}
                        <br />
                        {user && user.contact && <span>Contact no.:- <span className='sm:text-2xl text-xl font-serif font-semibold'>{user.contact}</span></span>}
                        <br />
                    </div>
                    <div className='flex justify-center mt-[10vh]'>
                        <Button
                            variant='contained'
                            color='primary'
                            size='large'
                            onClick={() => {
                                setSelectedConversation(user)
                                navigate('/chat')
                            }}
                            endIcon={<Chat/>}
                        >Start chat</Button>
                    </div>
                </div>
            </div>
            <div className='border w-max shadow-[#1976D2] shadow-[1px_1px_5px_3px] my-3 sm:h-[90vh] sm:overflow-auto scrollbar-thin scrollbar-webkit'>
                <h1 className='text-3xl font-serif font-bold text-[#001F2B] text-center mt-3'>Product Details</h1>
                <div className='flex items-center my-4'>
                    <Button
                        className="text-xs sm:text-xl sm:h-[5vh] w-min"
                        onClick={() => countDecrease()}><ArrowBackIos /></Button>
                    <img src={product.productImg && product.productImg[imgIndex]}
                        className='sm:w-[30vw]  sm:h-[40vh] w-[68vw] h-[40vh]'
                        alt="product image" 
                    />
                    <Button
                        className="text-xs sm:text-xl sm:h-[5vh] w-min"
                        onClick={() => countIncrease()}><ArrowForwardIos /></Button>
                </div>
                <div className='flex flex-col justify-center items-center'>
                <div>
                    <span className='text-2xl'>Product name:- <span className='sm:text-2xl text-xl font-serif font-semibold'>{product.productName}</span></span>
                    <br />
                    <span className='text-2xl'>Price:- <span className='sm:text-2xl text-xl font-serif font-semibold'>Rs.{product.price}</span></span>
                    <br />
                    <span className='text-2xl'>Description:- <span className='sm:text-2xl text-xl font-serif font-semibold'>{product.description}</span></span>
                    <br />
                    <span className='text-2xl'>Material:- <span className='sm:text-2xl text-xl font-serif font-semibold'>{product.material}</span></span>
                    <br />
                    <span className='text-2xl'>Dimensions:- <span className='sm:text-2xl text-xl font-serif font-semibold'>{product.dimensions}</span></span>
                    <br />
                    <span className='text-2xl'>Weight:- <span className='sm:text-2xl text-xl font-serif font-semibold'>{product.weight}</span></span>
                    <br />
                    <span className='text-2xl'>Category:- <span className='sm:text-2xl text-xl font-serif font-semibold'>{product.category}</span></span>
                    <br />
                    <span className='text-2xl'>Material:- <span className='sm:text-2xl text-xl font-serif font-semibold'> {product.material}</span></span>
                    <br />
                    {user && user.address && <span className='text-2xl'>Product manufacture:- <span className='sm:text-2xl text-xl font-serif font-semibold'>{user.address}</span></span>}

                    {product.stock > 0 ?
                        <h1 className='text-2xl sm:text-3xl font-serif font-semibold mt-6 text-center'>{product.stock > 10 ? <span className='text-[#270]'>In stock</span> :
                            <span className='text-[#FFCC00]'>Limited stock available</span>}</h1>
                        : <h1 className='text-3xl text-center text-[#D8000C] font-serif font-semibold mt-6'> Out of stock</h1>}
                </div>
                    <br />
                    <div className='flex justify-center mb-3'>
                        <Button
                            variant='contained'
                            color='primary'
                            size='large'
                            onClick={() => handelPayment()}
                            endIcon={<LocalMall/>}
                        >Buy now</Button>
                    </div>
            </div>
            </div>
        </div>
        </>
    )
}

export default BookPage
