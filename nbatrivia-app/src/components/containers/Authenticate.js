import React, { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Button, Row, Col, Alert, Container } from "react-bootstrap";
import "./Authenticate.css";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useHistory } from "react-router";
import { UserContext } from "../context/UserContext";
import ControlledInput from "../elements/ControlledInput";

const schema = yup.object().shape({
  username: yup.string().required("You need a username!"),
  password: yup
    .string()
    .required("You need a password!")
    .min(8, "Password must be at least 8 characters long")
    .matches(/.*[0-9].*/, "Password must contain at least one number"),
});
//yup form validation to ensure we're not sending bad data to our backend

function Authenticate() {
  const { setUser } = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(true);
  const [serverErrorMessage, setServerErrorMessage] = useState();
  const [accountAlert, setAccountAlert] = useState();
  const history = useHistory();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: { username: "", password: "" },
  });

  //initialize react-hook-form. This library lets us work with react-bootstrap inputs and simplifies validation + accessing form data

  async function onSubmit(data) {
    let url;
    if (isLogin) {
      url = `${process.env.REACT_APP_CONNECTION_URL}/login`;
    }
    if (!isLogin) {
      url = `${process.env.REACT_APP_CONNECTION_URL}/signup`;
    }
    //reuse some form components, but send the data to a different route if depending on the mode
    try {
      const response = await axios({
        method: "post",
        url: url,
        data: data,
      });
      if (isLogin) {
        setUser({
          ...response.data,
        });
        localStorage.setItem("userData", JSON.stringify(response.data));
        history.push("/game");
        setTimeout(() => {
          setUser(null);
          localStorage.removeItem("userData");
          history.push("/authenticate");
          alert("Login session timed out. Please sign back in");
        }, 360000);
      }
      //store the user data in two places, react context and local storage. This ensures user data is maintained even if the page refreshes or is closed
      //token is valid for one hour. To reflect this on the frontend we use settimeout to remove the token after an hour. This functionality would be improved with refresh tokens but I didn't see the need for it on an application of this size
      if (!isLogin) {
        setAccountAlert("Account Created!");
        reset({ ...getValues(), password: "" });
        setIsLogin(true);
        setServerErrorMessage(null);
      }
    } catch (err) {
      setServerErrorMessage(err.response.data.message);
    }
  }

  function changeMode() {
    setIsLogin((prev) => !prev);
    setServerErrorMessage("");
    setAccountAlert("");
  }

  return (
    <Container fluid>
      <Row className="h-100">
        <Col lg={7} className="d-none d-lg-block authenticate-left">
          <h1>Basketball Stats Master</h1>
          <h3>Test your knowledge of basketball stats</h3>
          <h3>Create an account to track your accuracy over time</h3>
        </Col>
        <Col lg={5} sm={12} className="authenticate-right">
          <h3 className="form-header">{isLogin ? "Log In" : "Sign Up"}</h3>
          {accountAlert && <Alert variant="success">{accountAlert}</Alert>}
          {serverErrorMessage && (
            <Alert variant="danger">{serverErrorMessage}</Alert>
          )}
          <Form className="main-form" onSubmit={handleSubmit(onSubmit)}>
            <ControlledInput
              title="Username"
              control={control}
              errors={errors}
              name="username"
            />
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="password"
                    isInvalid={!!errors.password && !isLogin}
                  />
                )}
              />
              {!isLogin && (
                <Form.Text className="text-muted">
                  Password must contain at least 8 characters and a number
                </Form.Text>
              )}
              {errors.password && !isLogin && (
                <Form.Control.Feedback type="invalid">
                  {errors.password.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* for all the other inputs I used my ControlledInput element, but for password I had to add more customization than that would allow */}
            <Button className="form-submit-button" variant="dark" type="submit">
              {isLogin ? "Login" : "Sign up"}
            </Button>
          </Form>
          {isLogin && (
            <p className="mode-change-text">
              No account? <span onClick={changeMode}>Sign up</span> instead.
            </p>
          )}
          {!isLogin && (
            <p className="mode-change-text">
              Already have an account? <span onClick={changeMode}>Login</span>{" "}
              instead.
            </p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Authenticate;
