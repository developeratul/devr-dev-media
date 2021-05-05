import React, { useEffect, useState } from "react";
import AppBar from "../components/AppBar";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import PostRules from "../components/Post/PostRules";
import PostCreation from "../components/Post/PostCreation";

const CreatePost = () => {
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
    document.title = "Dev Media / Write Post";
  }, []);
  return (
    <>
      <AppBar />
      {loading ? (
        <Loader />
      ) : (
        <div className="createPostPage">
          <div className="container">
            <div className="Post_content_wrapper">
              {/*  */}

              <PostRules />
              <PostCreation authUser={authUser} />

              {/*  */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePost;
