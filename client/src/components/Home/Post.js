import { Avatar, Button } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

// icon
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";

const Post = ({ post }) => {
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
            <Button>
              <ThumbUpAltOutlinedIcon /> ({post.likers.length}) Like
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
