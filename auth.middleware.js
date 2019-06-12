const User = require('./model/user');

const authMiddleware = async (req, res, next) => {
  const user = await User.findOne({token: req.headers['authorization']});
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send('User not found');
  }
};

module.exports = authMiddleware;


