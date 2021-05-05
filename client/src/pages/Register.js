import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useHistory, Link } from "react-router-dom";
import { Button } from "@material-ui/core";

const Register = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    conPass: "",
    gender: "",
    country: "",
    profession: "",
  });
  const [country, setCountry] = useState([]);
  const history = useHistory();

  const InputEvent = (event) => {
    const { name, value } = event.target;

    setInput((pre) => ({ ...pre, [name]: value }));
  };

  // for the select option field
  const fetchCountryData = async () => {
    try {
      const res = await fetch("https://restcountries.eu/rest/v2/all");

      const body = await res.json();

      setCountry(body);
    } catch (err) {
      console.log(err);
    }
  };

  // for registering the user
  const RegisterUser = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      gender,
      country,
      profession,
      conPass,
    } = input;

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          gender,
          country,
          profession,
          conPass,
        }),
      });

      const body = await res.json();

      if (res.status === 200) {
        toast.dark(body.success);
        history.push("/");
      } else if (res.status === 403) {
        toast.error(body.err);
      } else if (res.status === 401) {
        toast.error(body.err);
      } else if (res.status === 402) {
        toast.error(body.err);
      } else if (res.status === 400) {
        toast.error(body.err);
      } else if (res.status === 405) {
        toast.error(body.err);
      } else if (res.status === 406) {
        toast.error(body.err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    document.title = "Dev Media / Register Account";
    fetchCountryData();
  }, []);
  return (
    <>
      <div className="registration_page">
        <div className="container">
          <div className="content_wrapper">
            <div className="side_infos">
              <h2>Welcome To Dev Media</h2>

              <p>Community Rules:</p>
              <ol type="i">
                <li>✔ Always be a gentle man.</li>
                <li>✔ No Cyberbullying.</li>
                <li>✔ Be Polite.</li>
                <li>✔ Do not plagiarize.</li>
                <li>✔ Maintain Your privacy.</li>
                <li>✔ Be yourself (Optional).</li>
                <li>✔ And Post Something 😋.</li>
              </ol>
            </div>

            <fieldset method="POST" className="regitration_form">
              <legend>Register Account</legend>

              <div className="singleField">
                <input
                  type="text"
                  onChange={InputEvent}
                  name="name"
                  placeholder="Name"
                />
              </div>

              <div className="singleField">
                <input
                  type="email"
                  onChange={InputEvent}
                  name="email"
                  placeholder="Email"
                />
              </div>

              <div className="singleField">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={InputEvent}
                />
              </div>

              <div className="singleField">
                <input
                  type="password"
                  name="conPass"
                  placeholder="Confirm Password"
                  onChange={InputEvent}
                />
              </div>

              <div className="singleField">
                <select name="gender" onChange={InputEvent}>
                  <option defaultValue="" selected disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="singleField">
                <select name="country" onChange={InputEvent}>
                  <option defaultValue="" selected disabled>
                    Select Country
                  </option>
                  {country.map((country, key) => {
                    return (
                      <option key={key} value={country.name}>
                        {country.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="singleField">
                <select name="profession" onChange={InputEvent}>
                  <option defaultValue="" selected disabled>
                    Profession
                  </option>
                  <option value="Web Developer">Web Developer</option>
                  <option value="Front-end Developer">
                    Front-end Developer
                  </option>
                  <option value="Back-end developer">Back-end developer</option>
                  <option value="Full Stack Developer">
                    Full Stack Developer
                  </option>
                  <option value="Game Developer">Game Developer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Machine Learner">Machine Learner</option>
                  <option value="Graphic Designer">Graphic Designer</option>
                  <option value="Marketer">Marketer</option>
                  <option value="Content Writer">Content Writer</option>
                  <option value="Youtuber">Youtuber</option>
                  <option value="Bussinessman">Bussinessman</option>
                  <option value="Motivational Speacker">
                    Motivational Speacker
                  </option>
                </select>
              </div>
              <div className="singleField">
                {/* <button type="submit" onClick={RegisterUser}>
                  Register Account
                </button> */}
                <Button type="submit" onClick={RegisterUser}>
                  Register Account
                </Button>
              </div>

              <div className="formFooter">
                <Link to="/login">I already have an account</Link>
                <br />
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
