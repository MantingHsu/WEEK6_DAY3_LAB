require('dotenv').config();  // loads .env file into process.env
const mongoose = require('mongoose');


mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection
  .on('open', () => {
    console.log('✅ Mongoose connection open');
  })
  .on('error', (err) => {
    console.error('❌ Connection error:', err);
  });

// Register model
require('./models/Registration');


// Start Express app
const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Express is running on port ${server.address().port}`);
});
