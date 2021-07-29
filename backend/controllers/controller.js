const User = require("../models/User");
const axios = require("axios").default;
const HttpError = require("../models/HttpError");
const utils = require("../utils/utils");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

async function sendAnswers(req, res, next) {
  //recieve and destructure request
  const { playerID, firstYearAnswer, ppgAnswer, fgpAnswer } = req.body;
  const { userID } = req;
  //get relevant data from NBA stats api
  const url = `https://data.nba.net/data/10s/prod/v1/2020/players/${playerID}_profile.json`;
  let response;
  try {
    response = await axios.get(url);
  } catch (err) {
    return next(new HttpError("Could not fetch API data", 404));
  }
  const { ppg, fgp } = response.data.league.standard.stats.careerSummary;
  const length =
    response.data.league.standard.stats.regularSeason.season.length;
  const firstYear =
    response.data.league.standard.stats.regularSeason.season[length - 1]
      .seasonYear;
  //use helper function to compare answers
  const results = utils.compareAnswers(
    ppgAnswer,
    fgpAnswer,
    firstYearAnswer,
    ppg,
    fgp,
    firstYear
  );

  //check for user
  let user;
  try {
    user = await User.findById(userID);
  } catch (err) {
    console.log(err);
    return next(new HttpError("No such user", 401));
  }

  //increment user's correct and incorrect guesses
  try {
    let user = await User.findOneAndUpdate(
      { _id: userID },
      {
        $inc: {
          correctGuesses: results.numCorrect,
          incorrectGuesses: results.numIncorrect,
        },
      },
      { new: true }
    );
    let ratio =
      (user.correctGuesses / (user.correctGuesses + user.incorrectGuesses)) *
      100;

    //send response with relavent API and user data
    res.status(200).json({
      ppg,
      fgp,
      firstYear,
      ppgGuess: results.ppgCorrect,
      fgpGuess: results.fgpCorrect,
      yearGuess: results.yearCorrect,
      ratio: ratio.toFixed(2),
    });
  } catch (err) {
    console.log(err);
    return next(new HttpError("Could not get user data!", 500));
  }
}

async function signup(req, res, next) {
  const { username, password } = req.body;
  let hashedpassword;
  try {
    hashedpassword = await bcrypt.hash(password, saltRounds);
  } catch (err) {
    return next(
      new HttpError(
        "I don't know how you submitted that without a password",
        422
      )
    );
  }

  const newUser = new User({
    username,
    password: hashedpassword,
  });

  try {
    let savedUser = await newUser.save();
    res.status(201).json({ message: "Successfully signed up!" });
  } catch (err) {
    return next(
      new HttpError(
        "Username already in use. Log in instead if this is your email",
        422
      )
    );
  }
}

async function login(req, res, next) {
  const { username, password } = req.body;
  let user;
  try {
    user = await User.findOne({ username: username }).orFail();
  } catch (err) {
    return next(
      new HttpError(
        "Could not sign in. Check your credentials, or sign up if you do not have an account",
        401
      )
    );
  }
  let match;
  try {
    match = await bcrypt.compare(password, user.password);
  } catch (err) {
    return next(new HttpError("Incorrect password", 422));
  }

  if (user && match) {
    //attach the user ID in the payload to identify them later
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    let ratio =
      (user.correctGuesses / (user.correctGuesses + user.incorrectGuesses)) *
      100;

    res.status(200).json({
      username: user.username,
      message: "Logged in",
      token: token,
      ratio: ratio.toFixed(2),
    });
  } else {
    return next(
      new HttpError(
        "Could not sign in. Check your credentials, or sign up if you do not have an account",
        401
      )
    );
  }
}

module.exports.sendAnswers = sendAnswers;
module.exports.signup = signup;
module.exports.login = login;
