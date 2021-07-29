import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MainNavBar from "./components/containers/MainNavBar";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AboutMe from "./components/containers/AboutMe";
import Game from "./components/containers/Game";
import Authenticate from "./components/containers/Authenticate";
import { useState } from "react";
import { UserContext } from "./components/context/UserContext";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );

  //app wide useState for user gets passed to react context, so any child element can access or set user

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <MainNavBar />
        <Switch>
          <Route path="/aboutMe">
            <AboutMe />
          </Route>
          <Route path="/game">
            <Game />
          </Route>
          <Route path="/authenticate">
            <Authenticate />
          </Route>
          <Route exact path="/">
            {user ? <Redirect to="/game" /> : <Redirect to="/authenticate" />}
          </Route>
          {/* default route changes depending on login status */}
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
