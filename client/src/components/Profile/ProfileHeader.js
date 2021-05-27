import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

// icons
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import CakeOutlinedIcon from "@material-ui/icons/CakeOutlined";
import WorkOutlineOutlinedIcon from "@material-ui/icons/WorkOutlineOutlined";
import LaunchIcon from "@material-ui/icons/Launch";
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";

// from the material-ui
import { Button, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(19),
    height: theme.spacing(19),
  },
}));

const ProfileHeader = ({ user, authUser, id }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const classes = useStyles();

  // for following a user
  const followUser = async () => {
    try {
      const res = await fetch("/followUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUser: authUser,
          gettingFollowUserId: user._id,
        }),
      });

      setIsFollowing(true);
      const body = await res.json();

      toast.dark(body.success);
    } catch (err) {
      console.log(err);
    }
  };

  // for unfollowing
  const unfollowUser = async () => {
    try {
      const res = await fetch("/unfollowUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authUser: authUser,
          gettingFollowUserId: user._id,
        }),
      });

      setIsFollowing(false);
      const body = await res.json();

      toast.dark(body.success);
    } catch (err) {
      console.log(err);
    }
  };

  // checking if the user has already followed
  const checkFollowingStatus = () => {
    user.followers.map((follower) => {
      if (authUser._id === follower || user.followers.includes(authUser._id)) {
        setIsFollowing(true);
      } else setIsFollowing(false);
    });
  };

  useEffect(() => {
    checkFollowingStatus();
  }, [id, user]);

  return (
    <>
      <fieldset className="profile_header">
        <legend>
          <a target="blank" href={user.photoUrl}>
            {/* <img src={user.photoUrl} alt="Profile Picture" /> */}
            <Avatar
              alt={user.name}
              src={user.photoUrl}
              className={classes.large}
            />
          </a>
        </legend>

        <div className="profile_intro">
          <h1>{user.name}</h1>
          <p>{user.bio ? user.bio : "Bio Not Found"}</p>
          <p>
            <div>{user.followers.length} Followers</div>
            <div>{user.followings.length} Following</div>
          </p>
        </div>

        <div className="primary_infos">
          <div className="single_info">
            <div>
              <LocationOnOutlinedIcon />
            </div>
            <span>{user.country}</span>
          </div>
          <div className="single_info">
            <div>
              <CakeOutlinedIcon />
            </div>
            <span>
              Member since:<span>{user.date}</span>
            </span>
          </div>
          <div className="single_info">
            <div>
              <WorkOutlineOutlinedIcon />
            </div>
            <span>
              <span>{user.profession}</span>
            </span>
          </div>
        </div>

        {/*  */}
        <div className="profile_links">
          {user.portfolio ? (
            <div className="singleLink">
              <Tooltip title="Portfolio">
                <a
                  href={user.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LaunchIcon />
                </a>
              </Tooltip>
            </div>
          ) : null}

          {user.twitter ? (
            <div className="singleLink">
              <Tooltip title="Twitter">
                <a
                  href={user.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterIcon />
                </a>
              </Tooltip>
            </div>
          ) : null}

          {user.github ? (
            <div className="singleLink">
              <Tooltip title="Github">
                <a href={user.github} target="_blank" rel="noopener noreferrer">
                  <GitHubIcon />
                </a>
              </Tooltip>
            </div>
          ) : null}

          {user.dev ? (
            <div className="singleLink">
              <Tooltip title="Dev.to">
                <a href={user.dev} target="_blank" rel="noopener noreferrer">
                  <DeveloperModeIcon />
                </a>
              </Tooltip>
            </div>
          ) : null}
        </div>

        {/*  */}
        <div className="profile_options">
          <div className="singleOption">
            {authUser._id === id ? (
              <Tooltip title="Edit your profile">
                <Button>
                  <Link to="/settings">Edit Profile</Link>
                </Button>
              </Tooltip>
            ) : (
              <Button onClick={isFollowing ? unfollowUser : followUser}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
          <div className="singleOption">
            <CopyToClipboard text={user._id}>
              <Tooltip title="Copy User Id">
                <Button>Copy Id</Button>
              </Tooltip>
            </CopyToClipboard>
          </div>
        </div>
      </fieldset>
    </>
  );
};

export default ProfileHeader;
