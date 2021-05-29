import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AppBar from "../components/AppBar";
import Loader from "../components/Loader";

import Welcome from "../components/Home/Welcome";
import Post from "../components/Home/Post";

const Home = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postLimit, setPostLimit] = useState(6);

  const history = useHistory();

  // if the user is not authorized,
  // the user will be redirected to the login page.
  // Here I am fetching a back-end route which has a middleware
  // Which is checking if the user is authorized
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
      setLoading(false);

      if (!body._id) {
        history.push("/login");
        toast.dark("You have to login in order to browse");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // for fetching the posts of the following users of the auth User
  const fetchFollowingPost = async () => {
    try {
      if (!loading) {
        const res = await fetch(
          `/followingPost/${user.followings}?limit=${postLimit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const body = await res.json();

        // I am getting two thing under an object from the back-end
        // one is the posting users array another is the posts array
        // under that object
        // So I am adding a new field to every object in the post array
        // Which will contain the user data
        // under another array under the user property
        if (res.status === 200) {
          const postWithUser = body.posts.map((post) => ({
            ...post,
            user: body.users.filter((user) => user._id === post.userId),
          }));

          setPosts(postWithUser);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  window.addEventListener("scroll", () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight) {
      setPostLimit(postLimit + 9);
    }
  });

  useEffect(() => {
    checkAuth();
    document.title = "Dev Media / Home";
  }, [loading]);

  useEffect(() => {
    fetchFollowingPost();
  }, [postLimit, loading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <AppBar />
      {loading ? (
        <Loader />
      ) : (
        <div className="home_page">
          <div className="container">
            <div className="home_content_wrapper">
              {/*  */}

              {posts.length === 0 || (!posts && !loading) ? (
                <Welcome user={user} />
              ) : (
                posts.map((post, index) => {
                  return <Post key={index} post={post} user={user} />;
                })
              )}

              {/*  */}
            </div>
          </div>
        </div>
      )}
      )
    </>
  );
};

export default Home;
