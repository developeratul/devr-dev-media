import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import AppBar from "../components/AppBar";
import { Avatar, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import AuthUserOptions from "../components/Profile/Posts/AuthUserOptions";

// icon
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import CommentSection from "../components/SinglePost/CommentSection";

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

              <div className="singlePost">
                {postData.user ? (
                  <div className="post_header">
                    <div className="post_user_details">
                      <Avatar
                        src={postData.user.photoUrl}
                        alt={postData.user.name}
                      />
                      <div className="post_details">
                        <h2>
                          <Link to={`/profile/${postData.user._id}`}>
                            {postData.user.name}
                          </Link>
                        </h2>
                        <p>
                          {postData.post.date} - {postData.post.time}
                        </p>
                      </div>
                    </div>

                    <AuthUserOptions authUser={user} post={postData.post} />
                  </div>
                ) : null}

                {postData.post ? (
                  <div className="post_content">
                    <div className="post_desc">
                      <h2>{postData.post.title}</h2>
                      <br />
                      {postData.post.body ? <p>{postData.post.body}</p> : null}
                    </div>

                    {postData.post.imgUrl ? (
                      <div className="postImg">
                        <img
                          src={postData.post.imgUrl}
                          alt={postData.post.title}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {postData.post ? (
                  <div className="postLikersList">
                    <p className="showLikers">
                      {likeCount} People has Liked
                      <div className="likerList">
                        {likers.length === 0 ? (
                          <p>No body has liked</p>
                        ) : (
                          likers.map((liker, index) => {
                            return (
                              <div className="singleLiker" key={index}>
                                <p>
                                  <Link to={`/profile/${liker._id}`}>
                                    {liker.name}
                                  </Link>
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </p>
                  </div>
                ) : null}

                <div className="postOptions">
                  <div className="likePost">
                    <Button
                      style={{ background: hasLiked ? "#ff00b3" : null }}
                      onClick={hasLiked ? UnlikePost : LikePost}
                    >
                      <ThumbUpAltOutlinedIcon />{" "}
                      <span style={{ padding: "0px 5px" }}>
                        ({postData.post ? likeCount : null})
                      </span>{" "}
                      Like
                    </Button>
                  </div>
                  <div className="comment">
                    <Button
                      onClick={() =>
                        document.querySelector("#createCommentbox").focus()
                      }
                    >
                      <MessageOutlinedIcon /> Comment
                    </Button>
                  </div>
                </div>
              </div>

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
