import React from "react";
import { Avatar, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import AuthUserOptions from "../../Profile/Posts/AuthUserOptions";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";

// icon
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";

const Post = ({
  postData,
  likeCount,
  likers,
  user,
  hasLiked,
  UnlikePost,
  LikePost,
}) => {
  return (
    <div className="singlePost">
      {postData.user ? (
        <div className="post_header">
          <div className="post_user_details">
            <Avatar src={postData.user.photoUrl} alt={postData.user.name} />
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
              <img src={postData.post.imgUrl} alt={postData.post.title} />
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
                        <Link to={`/profile/${liker._id}`}>{liker.name}</Link>
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
            onClick={() => document.querySelector("#createCommentbox").focus()}
          >
            <MessageOutlinedIcon /> Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Post;
