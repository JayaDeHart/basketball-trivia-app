import React from "react";
import { Image } from "react-bootstrap";
import profilepic from "./profilepic.jpg";
import "./AboutMe.css";

function AboutMe() {
  return (
    <div className="about-me">
      <Image className="profile-image" src={profilepic} />
      <div className="blurb">
        My name is Jaya DeHart. I am a self taught Javascript developer who
        likes making fun games and stuff. I built this project as part of the
        process to test into the 401 class at CodeFellows bootcamp.
      </div>
    </div>
  );
}

export default AboutMe;
