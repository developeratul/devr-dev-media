import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import AppBar from "../components/AppBar";
import Loader from "../components/Loader";

// from the material-ui
import UpdateAvatar from "../components/Settings/UpdateAvatar";
import UpdateProfileInfo from "../components/Settings/UpdateProfileInfo";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState({});

  const history = useHistory();

  // for getting the data's of the authenticated user
  // and also for checking if the user is authentcated
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

      setLoading(false);
      setAuthUser(body);

      if (!body._id) {
        history.push("/login");
        toast.dark("You have to login in order to browse");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkAuth();
    document.title = "Dev Media / Settings";
  }, []);
  return (
    <>
      <AppBar />
      {loading ? (
        <Loader />
      ) : (
        <div className="settingsPage">
          <div className="container">
            {/*  */}

            <UpdateAvatar authUser={authUser} />
            <UpdateProfileInfo authUser={authUser} />

            {/*  */}
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
