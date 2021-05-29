import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AppBar from "../components/AppBar";
import Loader from "../components/Loader";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(19),
    height: theme.spacing(19),
  },
}));

const Users = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState({});
  const history = useHistory();

  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [dataLimit, setDataLimit] = useState(9);

  const [searchResult, setSearchResult] = useState({});

  // for getting the data of the authenticated user
  // and also for checking if the user is authenticated
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

      setAuthUser(body);

      if (!body._id) {
        history.push("/login");
        toast.dark("You have to login in order to browse");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // for getting all the user data's
  const getUserData = async () => {
    try {
      const res = await fetch(`/getUsers?limit=${dataLimit}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();

      if (res.status === 200) {
        setUsers(body);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const GetUserId = (event) => {
    setUserId(event.target.value);
  };

  const SearchSingleUser = async () => {
    try {
      const res = await fetch(`/getUsers/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json();

      if (res.status === 200) {
        setSearchResult(body);
      } else if (res.status === 404) {
        toast.error(body.err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  window.addEventListener("scroll", () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight) {
      setDataLimit(dataLimit + 9);
    }
  });

  useEffect(() => {
    getUserData();
  }, [dataLimit]);

  useEffect(() => {
    document.title = "Dev Media / Users";
    checkAuth();
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <AppBar />

      {loading ? (
        <Loader />
      ) : (
        <div className="usersPage">
          <div className="container">
            <h1 className="heading">Users To Follow</h1>
            {/*  */}

            <div className="searchUser">
              <div className="inputField">
                <TextField
                  name="searchuser"
                  label="Enter User Id"
                  variant="outlined"
                  onChange={GetUserId}
                  value={userId}
                />
                <Button onClick={SearchSingleUser}>Search</Button>
              </div>
            </div>

            {/* The search result */}
            {searchResult._id && userId !== "" ? (
              <div className="users_wrapper">
                <div className="singleuser">
                  <div className="profileAvatar">
                    {/* <img src={searchResult.photoUrl} alt="Profile Avatar" /> */}
                    <Avatar
                      alt={searchResult.name}
                      src={searchResult.photoUrl}
                      className={classes.large}
                    />
                  </div>

                  <div className="user_intro">
                    <h2>
                      <Link to={`/profile/${searchResult._id}`}>
                        {searchResult.name}
                      </Link>
                    </h2>
                    <p>{searchResult.profession}</p>
                    <p>{searchResult.followers.length} Followers</p>
                  </div>
                </div>
              </div>
            ) : (
              // the genuine results shown in the users page
              <div className="users_wrapper">
                {users.map((user, index) => {
                  return (
                    <div
                      style={{
                        border:
                          authUser._id === user._id
                            ? "2px solid #7b78ff"
                            : null,
                      }}
                      key={index}
                      className="singleuser"
                    >
                      <div className="profileAvatar">
                        <Link to={`/profile/${user._id}`}>
                          {/* <img src={user.photoUrl} alt="Profile Avatar" /> */}
                          <Avatar
                            alt={user.name}
                            src={user.photoUrl}
                            className={classes.large}
                          />
                        </Link>
                      </div>

                      <div className="user_intro">
                        <h2>
                          <Link to={`/profile/${user._id}`}>
                            {authUser._id === user._id ? "You" : user.name}
                          </Link>
                        </h2>
                        <p>{user.profession}</p>
                        <p>{user.followers.length} Followers</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/*  */}
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
