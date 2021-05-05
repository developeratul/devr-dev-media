import { Button, Tooltip } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";

const UpdateProfileInfo = ({ authUser }) => {
  const [info, setInfo] = useState({
    userName: "",
    email: "",
    profession: "",
    bio: "",
    skills: "",
    hackingOn: "",
    currentlyLearning: "",
    portfolio: "",
    github: "",
    dev: "",
    twitter: "",
  });

  const history = useHistory();

  const GetInfo = (event) => {
    const { name, value } = event.target;

    setInfo((pre) => ({ ...pre, [name]: value }));
  };

  const {
    userName,
    email,
    bio,
    skills,
    hackingOn,
    currentlyLearning,
    portfolio,
    github,
    dev,
    twitter,
    profession,
  } = info;

  // for updating the infos
  const updateInfo = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/updateProfileInfo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          email,
          bio,
          skills,
          hackingOn,
          currentlyLearning,
          portfolio,
          github,
          dev,
          twitter,
          profession,
          id: authUser._id,
        }),
      });

      const body = await res.json();

      if (res.status === 200) {
        history.push(`/profile/${authUser._id}`);
        toast.dark(body.success);
      } else if (res.status === 400) {
        toast.error(body.err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setInfo({
      userName: authUser.name,
      email: authUser.email,
      profession: authUser.profession,
      bio: authUser.bio,
      skills: authUser.skills,
      hackingOn: authUser.hackingOn,
      currentlyLearning: authUser.currentlyLearning,
      portfolio: authUser.portfolio,
      github: authUser.github,
      dev: authUser.dev,
      twitter: authUser.twitter,
    });
  }, [authUser]);

  return (
    <div className="settings_content_wrapper">
      <h2 className="section_heading">Update Profile Informations</h2>

      <div className="input_s_wrapper">
        <div className="singleInput">
          <label>
            <div className="inputLabelText">User Name</div>
            <input
              onChange={GetInfo}
              type="text"
              name="userName"
              placeholder="User Name"
              value={info.userName}
            />
          </label>
        </div>

        <div className="singleInput">
          <label>
            <div className="inputLabelText">Email</div>
            <input
              onChange={GetInfo}
              type="text"
              name="email"
              placeholder="Email"
              value={info.email}
            />
          </label>
        </div>

        <div className="singleInput">
          <div className="inputLabelText">Profession</div>
          <select value={info.profession} name="profession" onChange={GetInfo}>
            <option value="Web Developer">Web Developer</option>
            <option value="Front-end Developer">Front-end Developer</option>
            <option value="Back-end developer">Back-end developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Game Developer">Game Developer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Machine Learner">Machine Learner</option>
            <option value="Graphic Designer">Graphic Designer</option>
            <option value="Marketer">Marketer</option>
            <option value="Content Writer">Content Writer</option>
            <option value="Youtuber">Youtuber</option>
            <option value="Bussinessman">Bussinessman</option>
            <option value="Motivational Speacker">Motivational Speacker</option>
          </select>
        </div>

        <div className="singleInput">
          <label>
            <div className="inputLabelText">Bio</div>
            <input
              onChange={GetInfo}
              type="text"
              name="bio"
              placeholder="Bio"
              value={info.bio}
            />
          </label>
        </div>

        <div className="singleInput">
          <label>
            <div className="inputLabelText">Skills</div>
            <input
              onChange={GetInfo}
              type="text"
              name="skills"
              placeholder="Not Provided (', ')"
              value={info.skills}
            />
          </label>
        </div>

        <div className="singleInput">
          <label>
            <div className="inputLabelText">Hacking on</div>
            <input
              onChange={GetInfo}
              type="text"
              name="hackingOn"
              placeholder="Not Provided"
              value={info.hackingOn}
            />
          </label>
        </div>

        <div className="singleInput">
          <label>
            <div className="inputLabelText">Currently Learning</div>
            <input
              onChange={GetInfo}
              type="text"
              name="currentlyLearning"
              placeholder="Not Provided"
              value={info.currentlyLearning}
            />
          </label>
        </div>

        <div className="singleInput">
          <label>
            <div className="inputLabelText">Portfolio Site</div>
            <input
              onChange={GetInfo}
              type="text"
              name="portfolio"
              placeholder="Not Provided"
              value={info.portfolio}
            />
          </label>
        </div>

        <div className="singleInput">
          <label>
            <div className="inputLabelText">Twitter Profile</div>
            <input
              onChange={GetInfo}
              type="text"
              name="twitter"
              placeholder="Not Provided"
              value={info.twitter}
            />
          </label>
        </div>

        <div className="singleInput">
          <label>
            <div className="inputLabelText">Github Profile</div>
            <input
              onChange={GetInfo}
              type="text"
              name="github"
              placeholder="Not Provided"
              value={info.github}
            />
          </label>
        </div>

        <div className="singleInput">
          <label>
            <div className="inputLabelText">Dev.TO Profile</div>
            <input
              onChange={GetInfo}
              type="text"
              name="dev"
              placeholder="Not Provided"
              value={info.dev}
            />
          </label>
        </div>

        <div className="singleInput">
          <div className="inputLabelText">Save Changes</div>
          <Tooltip title="Save These informations">
            <Button onClick={updateInfo}>Save Changes</Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileInfo;
