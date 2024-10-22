// mongooseConnection.js

const mongoose = require('mongoose');

// Connection URI
const uri = 'mongodb+srv://aryanmaurya698:Aryan12345@proteineats.kir4b.mongodb.net/?retryWrites=true&w=majority&appName=ProteinEats';
// const uri = 'mongodb+srv://Mayur:Mayur@cluster0.pofppjq.mongodb.net/Edu-Tech?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to MongoDB:', err);
  });

module.exports = mongoose;
