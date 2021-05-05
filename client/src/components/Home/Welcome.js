import React from "react";
import Img from "../../img/welcome.svg";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

const Welcome = ({ user }) => {
  return (
    <div className="no_message">
      <div className="no_img">
        <img src={Img} alt="Image" />
      </div>
      <h2>
        Hi <span>{user.name}</span>
      </h2>
      <p>Welcome To Dev-Media. I am so happy to see you here.</p>
      <p>Your news feed is totally quite for now.</p>
      <p>
        Cause You are now following anybody or the people, you are following,
        has't posted anything.
      </p>
      <p>So go and start following people and build your community.</p>
      <p>
        Before that, You should edit your profile. Change the Avatar, add your
        social media links and the other informations.
      </p>

      <div className="buttoncontainer">
        <div className="singleButton">
          <Link to="/users">
            <Button>Explore Users</Button>
          </Link>
        </div>
        <div className="singleButton">
          <Link to="/settings">
            <Button>Edit Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
