import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import AppBar from "../components/AppBar";

// icon
import CommentSection from "../components/SinglePost/CommentSection";
import Post from "../components/SinglePost/Post/Post";
import SuggestedUser from "../components/SinglePost/Post/SuggestedUser";

const SinglePost = () => {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [hasLiked, setHasLiked] = useState(false);
  const [likers, setLikers] = useState([]);
  const [likeCount, setLikeCount] = useState(0);

  const { id } = useParams();
  const history = useHistory();

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
      setLoading(false);

      if (!body._id) {
        history.push("/login");
        toast.dark("You have to login in order to browse");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPostData = async () => {
    try {
      const res = await fetch(`/singlePost/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json();

      if (res.status === 200) setPostData(body);
      else if (res.status === 404) {
        history.push("/");
        toast.error("Post not found!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // for liking a post
  const LikePost = async () => {
    try {
      const res = await fetch("/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, postId: postData.post._id }),
      });

      const body = await res.json();
      setLikeCount(likeCount + 1);
      likers.push(user);

      if (res.status === 200) {
        toast.dark(body.success);
        setHasLiked(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // for unliking a post
  const UnlikePost = async () => {
    try {
      const res = await fetch("/unlike", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, postId: postData.post._id }),
      });

      const body = await res.json();
      setLikeCount(likeCount - 1);
      setLikers(likers.filter((liker) => liker._id !== user._id));

      if (res.status === 200) {
        toast.dark(body.success);
        setHasLiked(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // for checking if the user has liked the post
  const checkLikeStatus = () => {
    for (let i = 0; i < postData.post.likers.length; i++) {
      if (postData.post.likers[i].liker === user._id) {
        setHasLiked(true);
      }
    }
  };

  // for getting the user infos who has liked
  // the post
  const getLikers = async () => {
    try {
      const res = await fetch(
        `/getLikersData/${postData.post.likers.map((liker) => liker.liker)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const body = await res.json();

      if (res.status === 200) {
        setLikers(body);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getLikers();
    checkAuth();
    fetchPostData();

    if (postData.post) checkLikeStatus();

    setLikeCount(postData.post ? postData.post.likers.length : 0);

    document.title = "Dev Media / Post";
  }, [loading, !postData.post]);

  return (
    <div>
      <AppBar />

      {loading ? (
        <Loader />
      ) : (
        <div className="singlePostPage">
          <div className="container">
            <div className="singlePostContent_wrapper">
              {/*  */}

              <Post
                postData={postData}
                user={user}
                likeCount={likeCount}
                likers={likers}
                hasLiked={hasLiked}
                UnlikePost={UnlikePost}
                LikePost={LikePost}
              />

              <SuggestedUser />

              {/*  */}
            </div>

            {/* The comment section of every post */}
            {postData.post ? (
              <CommentSection post={postData.post} user={user} />
            ) : null}

            {/*  */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
