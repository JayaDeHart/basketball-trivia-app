const jwt = require("jsonwebtoken");

const HttpError = require("../models/HttpError");

async function verfiyJWT(req, res, next) {
  //recieve the token from the request headers
  //decode it and attatch the ID to the req object for later use
  //failure at any of these steps will throw an error, preventing the request from reaching the protected route
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userID = payload.id;
    next();
  } catch (err) {
    return next(new HttpError("User not verified. Try signing in again!", 401));
  }
}

exports.verfiyJWT = verfiyJWT;
