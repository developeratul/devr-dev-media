import { Avatar, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// icon
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";

const Post = ({ post, user }) => {
  const [hasLiked, setHasLiked] = useState(false);

  const checkLikeStatus = () => {
    for (let i = 0; i < post.likers.length; i++) {
      if (post.likers[i].liker === user._id) {
        setHasLiked(true);
      }
    }
  };

  useEffect(() => {
    checkLikeStatus();
  }, []);

  return (
    <div className="singlePost">
      {/*  */}

      <div className="post_header">
        <div className="post_header_Details">
          <Avatar src={post.user[0].photoUrl} alt={""} />
          <div className="poster_details">
            <h2>
              <Link to={`/profile/${post.user[0]._id}`}>
                {post.user[0].name}
              </Link>
            </h2>
            <p>
              {post.date} - {post.time}
            </p>
          </div>
        </div>
      </div>

      <div className="post_desc">
        <Link to={`/post/${post._id}`}>
          <p className="post_title">{post.title}</p>
        </Link>
      </div>

      <Link to={`/post/${post._id}`}>
        <div
          className="post_img"
          style={{
            background: post.imgUrl
              ? `url(${post.imgUrl})`
              : "url('https://res.cloudinary.com/devr/image/upload/v1621575911/ewn2utffbn3uzuxjnpbj.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </Link>

      <div className="postOptions">
        <div className="likePost">
          <Link to={`/post/${post._id}`}>
            <Button style={{ background: hasLiked && "#ff00b3" }}>
              <ThumbUpAltOutlinedIcon /> ({post.likers.length}){" "}
              {hasLiked ? "Liked" : "Like"}
            </Button>
          </Link>
        </div>
        <div className="comment">
          <Link to={`/post/${post._id}`}>
            <Button>
              <MessageOutlinedIcon /> Comment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
