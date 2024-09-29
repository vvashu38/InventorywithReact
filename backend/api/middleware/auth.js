const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
  try {
    //   get the token from the authorization header
    const token = request.headers.authorization.split(" ")[1];

    //check if the token matches the supposed origin
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // retrieve the user details of the logged in user
    const user = {
      id: decodedToken.userId,
      email: decodedToken.userEmail,
      role: decodedToken.role,
    };    

    // pass the user down to the endpoints here
    request.user = user;

    // pass down functionality to the endpoint
    next();

  } catch (error) {
    response.status(401).json({
      error: "Wrong Token",
    });
  }
};