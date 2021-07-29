import React, { useState, useContext, useEffect } from "react";
import { players } from "../elements/players";
//players is an array of nba player objects that includes a unique ID that will let us query their statistics on the NBA stats api
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form, Image, Button, Row, Col } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import ControlledInput from "../elements/ControlledInput";
import "./Game.css";
import { X, Check } from "react-bootstrap-icons";

const schema = yup.object().shape({
  ppgAnswer: yup
    .number()
    .typeError("Your answer must be a number!")
    .required("You have to fill out this field!")
    .test(
      "len",
      "Answer to the nearest percent!",
      (val) => val.toString().length === 2
    ),
  fgpAnswer: yup
    .number()
    .typeError("Your answer must be a number!")
    .required("You have to fill out this field!")
    .test(
      "len",
      "Answer to the nearest percent!",
      (val) => val.toString().length === 2
    ),
  firstYearAnswer: yup
    .number()
    .typeError("Your answer must be a number!")
    .required("You have to fill out this field!")
    .test(
      "len",
      "Your answer must be a valid year",
      (val) => val.toString().length === 4
    ),
});
//yup form validation to ensure we're not sending bad data to our backend

function Game() {
  const { user } = useContext(UserContext);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: { ppgAnswer: "", fgpAnswer: "", firstYearAnswer: "" },
  });
  //initialize react-hook-form config
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [responseData, setResponseData] = useState({
    ppg: null,
    fgp: null,
    firstYear: null,
    ppgGuess: null,
    fgpGuess: null,
    yearGuess: null,
    ratio: user?.ratio || "undefined",
  });
  //set up our stateful variables. We are tracking our position in the players array, the current player name, the current url of our player images api and the response data from our server
  async function newPlayer() {
    reset();

    setResponseData((prev) => ({
      ...prev,
      ppgGuess: null,
      fgpGuess: null,
      yearGuess: null,
    }));
    if (currentPlayer !== 48) {
      setCurrentPlayer((prev) => prev + 1);
    }
    if (currentPlayer === 48) {
      setCurrentPlayer(0);
    }
    //loop back around if we reach the end of the list
    const url = `https://nba-players.herokuapp.com/players/${players[currentPlayer].lastName}/${players[currentPlayer].firstName}`;
    setPlayerName(
      `${players[currentPlayer].firstName} ${players[currentPlayer].lastName}`
    );
    try {
      const response = await axios(url);
      if (
        response.data ===
        "Sorry, that player was not found. Please check the spelling."
      )
        setImgUrl(
          "https://2wcvjr2o0jc97l6eq1lut4y1-wpengine.netdna-ssl.com/wp-content/uploads/2016/09/no-profile-img.jpg"
        );
      else {
        setImgUrl(url);
      }
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }

  //this function runs every time the user hits the "next" button. It increments our position in the players array, gets the url for the current player image and clears any right/wrong answer messages from the previous player

  useEffect(() => {
    newPlayer();
  }, []);
  //having newplayer run once on pageload initializes stateful variables

  async function onSubmit(data) {
    if (!user) {
      alert("You have to sign in first!");
      return;
    }
    const url = `${process.env.REACT_APP_CONNECTION_URL}/sendAnswer`;
    const postData = {
      ...data,
      playerID: players[currentPlayer].playerId,
    };
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    try {
      const response = await axios.post(url, postData, config);
      setResponseData({
        ...response.data,
      });
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }
  //the above function:
  //checks for user sign in
  //sends the users answer data + JSON webtoken to the backend
  //assigns the response object to a stateful variable for use in the UI

  return (
    <div className="game">
      <Row className="game-content">
        <Col className="player-info" lg={{ span: 6, offset: 3 }}>
          <h1>{playerName}</h1>
          <Image className="player-image" src={imgUrl} />
        </Col>
        <Col className="player-controls" lg={3}>
          <div>{`Lifetime accuracy: ${responseData.ratio}%`}</div>
          <Button variant="light" onClick={newPlayer}>
            next
          </Button>
        </Col>
      </Row>

      <Form className="stats-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-and-icon">
          <ControlledInput
            title="Career Points Per Game"
            name="ppgAnswer"
            errors={errors}
            control={control}
            formText="Answer to the nearest point"
          />
          {responseData.ppgGuess && <Check color="green" size={45} />}
          {responseData.ppgGuess === false && (
            <span>
              <X color="red" size={45} />
              The correct answer was {responseData.ppg}
            </span>
          )}
          {/* conditionally render some components that tell the user about their guess */}
        </div>
        <div className="input-and-icon">
          <ControlledInput
            title="Career Field Goal Percentage"
            name="fgpAnswer"
            errors={errors}
            control={control}
            formText="Answer to the nearest percent"
          />
          {responseData.fgpGuess && <Check color="green" size={45} />}
          {responseData.fgpGuess === false && (
            <span>
              <X color="red" size={45} />
              The correct answer was {responseData.fgp}%
            </span>
          )}
        </div>
        <div className="input-and-icon">
          <ControlledInput
            title="First Year in the League"
            name="firstYearAnswer"
            errors={errors}
            control={control}
            formText="yyyy format"
          />
          {responseData.yearGuess && <Check color="green" size={45} />}
          {responseData.yearGuess === false && (
            <span>
              <X color="red" size={45} />
              The correct answer was {responseData.firstYear}
            </span>
          )}
        </div>

        <Button className="submit-button" variant="dark" type="submit">
          Check my answers!
        </Button>
      </Form>
    </div>
  );
}

export default Game;
