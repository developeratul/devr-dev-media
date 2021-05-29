import React, { useState, useEffect } from "react";
import AppBar from "../components/AppBar";
import { useHistory, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import ProfileHeader from "../components/Profile/ProfileHeader";
import { toast } from "react-toastify";
import ProfileContent from "../components/Profile/ProfileContent";

const Profile = () => {
  // the user according to the id
  const [user, setUser] = useState({});
  // the authenticated user
  const [authUser, setAuthUser] = useState({});
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { id } = useParams();

  // if the user is not authorized,
  // the user will be redirected to the login page.
  // Here I am fetching a back-end route which has a middleware
  // Which is checking if the user is authorized
  // check out auth.js and routes.js (line:17)
  // this function is just for auth
  // not for fetching data's
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
      setLoading(false);

      if (!body._id) {
        history.push("/login");
        toast.dark("You have to login in order to browse");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // for fetching all the user data of the current page
  // not for the auth user
  const fetchUserData = async () => {
    try {
      const res = await fetch(`/apiProfile/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const body = await res.json();

      if (res.status === 200) {
        setUser(body);
      } else if (res.status === 404) {
        setUser("User not Found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchUserData();
    if (loading) return (document.title = "Dev Media / Loading...");
    if (user === "User not Found")
      document.title = "Dev Media / User Not Found";

    document.title = `Dev Media / ${user.name}`;
  }, [loading, id]);

  return (
    <>
      <AppBar />

      {loading ? (
        <Loader />
      ) : (
        <div className="profile_page">
          {user._id ? (
            <div className="container">
              <div className="profile_page_content_wrapper">
                {/*  */}

                <ProfileHeader user={user} authUser={authUser} id={id} />
                <ProfileContent authUser={authUser} id={id} user={user} />

                {/*  */}
              </div>
            </div>
          ) : (
            <h1 style={{ textAlign: "center", padding: "50px 0px" }}>
              User not Found
            </h1>
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
