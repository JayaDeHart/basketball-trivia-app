**This is the github repo from my basketball trivia app, hosted at:https://basketball-trivia-app.netlify.app/**

<h2>General Info</h2>
It was built by me, Jaya DeHart

It is a full stack application built using the MERN stack that accesses the official NBA stats api to create a fun player stats trivia game

Users can create accounts to track their accuracy as they play the game

Due to time constraints I didn't have any discreet versions of this project, it was pretty much created in one go.

<h2>Setup</h2>

Uses react-bootstrap, axios, react-router and react-hook-form on the frontend, and express, bcrypt, axios and jsonwebtoken on the backend. All the necessary dependencies can
be installed by simply running "npm install" once you've cloned the repo.

Once you've cloned the repo and installed your dependencies theres a couple of things you will need to do. On the frontend, create a .env file. The only variable you need
there is "REACT_APP_CONNECTION_URL", set its value to http://localhost:5000, or change it to another port if you feel like it.

On the backend, create a .env file with a key of "JWT_SECRET_KEY", and set that to whatever you like. By default it will try to connect to a local mongoDB server so make
sure you have "mongod" running before you start the app. Alternatively, you can set up a mongodb atlas server and connect to that with the environment variable 
"CONNECTION_URL"

<h2>Testing</h2>

For route testing, there are only 3 routes: signup, login and sendAnswer. They are all POST routes
signup and login take an object with {username:"xyz",password:"abc"}
sendAnswer requires an object with {"playerID":"201939", "firstYearAnswer":"2009", "ppgAnswer":"12", "fgpAnswer":"45"}
playerID values can be found in the players.js file
sendAnswer also requires a valid JWT with the header "authorization". You can attatch this manually in postman or if you sign in on the app it will happen automatically

The database stores users, which have {username, password, correctGuesses, incorrectGuesses} properties. Username is a unique identifier to prevent duplicates.
