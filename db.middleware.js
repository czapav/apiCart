const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res, next) => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useFindAndModify : false});
    mongoose.set('useCreateIndex', true);
  }
  next();
};
