import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import logo from "../img/logo.png";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const history = useHistory();

  const InputEvent = (event) => {
    const { name, value } = event.target;

    setInput((pre) => ({ ...pre, [name]: value }));
  };

  const loginUser = async (e) => {
    e.preventDefault();

    const { email, password } = input;

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();

      // once the use has logged in,
      // the user will be redirected to the home page
      if (res.status === 200) {
        toast.dark(body.success);
        history.push("/");
      } else {
        toast.error(body.err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    document.title = "Dev Media / Login";
  }, []);
  return (
    <>
      <div className="loginPage">
        <div className="container">
          <fieldset className="loginForm" method="POST" autoComplete="on">
            <legend>
              <img src={logo} alt="Logo" />
            </legend>

            <div className="singleField">
              <input
                type="email"
                onChange={InputEvent}
                name="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="singleField">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={InputEvent}
              />
            </div>
            <div className="singleField">
              <Button type="submit" onClick={loginUser}>
                Login
              </Button>
            </div>

            <div className="formFooter">
              <Link to="/register">I don't have any account</Link>
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
};

export default Login;
