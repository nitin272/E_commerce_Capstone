const express = require('express');
const mongoose = require('mongoose');
const product = require('./routes/product');
const auth = require('./routes/auth');
const message = require('./routes/messages');
const cors = require('cors');
const { app, server } = require('./utils/socket');
const { sendNotification } = require('./utils/nodeMailer');

const admin  = require("./utils/FireBaseAdmin");


require('dotenv').config();
const port = 4000;

const cookieParser = require('cookie-parser');

app.use(cookieParser());


const allowedOrigins = [
  'http://localhost:4500', "http://localhost:4000" ,"https://e-commerce-capstone.onrender.com","http://e-commerce-capstone.onrender.com","https://scale-mart1.vercel.app",

];



const corsOptions = {


  origin: function (origin, callback) {

    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200, 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGOOSE_URL, {
  dbName: 'Shop',
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.log(err);
});

app.use('/products',product);
app.use('/', auth);
app.use('/message', message);

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Nitin:Nitin@cluster0.w5qqoa0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

async function listUserEmails() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("Shop"); 
    const usersCollection = database.collection("user"); 

    const users = await usersCollection.find().toArray();
    users.forEach(user => {
      console.log(user.email); 
    });
  } finally {
    await client.close();
  }
}

app.post('/send-notification', (req, res) => {
  const { token, title, body } = req.body;

  

  if (!token || !title || !body) {
      console.error('Error: Missing token, title, or body');
      return res.status(400).send('Missing token, title, or body');
  }
  const message = {
      notification: {
          title: title,
          body: body,
      },
      token: token,
  };

  admin.messaging().send(message)
      .then((response) => {
          res.send('Notification sent');
      })
      .catch((error) => {
          console.error('Error sending notification:', error);
          res.status(500).send('Error sending notification');
      });
});

listUserEmails().catch(console.error);