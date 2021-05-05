import React, { useEffect, useState } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { toast } from "react-toastify";

// icons
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import PostAddIcon from "@material-ui/icons/PostAdd";

// components from material ui
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";

const AppBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null); // from the material-ui
  // for containing the user data
  const [user, setUser] = useState({});
  const history = useHistory();

  // for logging out the user
  const logOut = async () => {
    try {
      const res = await fetch("/logout", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          credencials: "include",
        },
      });

      const body = await res.json();

      if (res.status === 200) {
        toast.dark(body.success);
        history.push("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // if the user is not authorized,
  // the user will be redirected to the login page.
  // Here I am fetching a back-end route which has a middleware
  // Which is checking if the user is authorized
  // check out auth.js and routes.js (line:17)
  const checkAuth = async () => {
    try {
      const res = await fetch("/auth", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          credencials: "include",
        },
      });

      const body = await res.json();

      setUser(body);

      if (!body._id) {
        history.push("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // this function is fetching the data's
    // of the authenticated user
    checkAuth();
  }, []);

  // * all these are just for styling the menu and icons
  const iconStyle = {
    fontSize: "2rem",
  };
  const subMenuLinkStyle = {
    textDecoration: "none",
    color: "#000",
  };

  // for toggling the nav
  const ToggleNav = () => {
    document.querySelector(".nav_link").classList.toggle("nav-active");
    document.querySelector(".bars").classList.toggle("toogle");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <nav>
        <h2 className="nav_title">
          <Tooltip title="Back To Home">
            <Link to="/">Dev Media</Link>
          </Tooltip>
        </h2>

        <ul className="nav_link">
          <li>
            <NavLink activeClassName="nav_active_link" to="/" exact>
              <Tooltip title="New Feed">
                <Button>
                  <HomeOutlinedIcon style={iconStyle} />
                  <span className="placeholderText">Home</span>
                </Button>
              </Tooltip>
            </NavLink>
          </li>

          <li>
            <NavLink activeClassName="nav_active_link" to="/createPost" exact>
              <Tooltip title="Write Post">
                <Button>
                  <PostAddIcon style={iconStyle} />
                  <span className="placeholderText">Post</span>
                </Button>
              </Tooltip>
            </NavLink>
          </li>

          <li>
            <NavLink activeClassName="nav_active_link" to="/users" exact>
              <Tooltip title="Browse Users">
                <Button>
                  <GroupAddIcon style={iconStyle} />
                  <span className="placeholderText">Users</span>
                </Button>
              </Tooltip>
            </NavLink>
          </li>

          <li>
            <Tooltip title="Account Options">
              <Button onClick={handleClick}>
                <Avatar alt={user.name} src={user.photoUrl} style={iconStyle} />
                <span className="placeholderText">Options</span>
              </Button>
            </Tooltip>
          </li>

          {/* the sub menu from
          material-ui */}
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link style={subMenuLinkStyle} to={`/profile/${user._id}`}>
                Profile
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link style={subMenuLinkStyle} to="/settings">
                Settings
              </Link>
            </MenuItem>
            <MenuItem style={subMenuLinkStyle} onClick={logOut}>
              LogOut
            </MenuItem>
          </Menu>
        </ul>

        {/* the burger icon */}
        <div className="bars" onClick={ToggleNav}>
          <div className="line line1"></div>
          <div className="line line2"></div>
          <div className="line line3"></div>
        </div>
      </nav>
    </>
  );
};

export default AppBar;
