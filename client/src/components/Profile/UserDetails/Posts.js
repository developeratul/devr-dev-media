import { Avatar, Button } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import AuthUserOptions from "../Posts/AuthUserOptions";

const Posts = ({ TabPanel, dir, value, posts, authUser, user }) => {
  return (
    <TabPanel value={value} index={0} dir={dir}>
      {posts.length <= 0 ? (
        <h1 className="no_message">No Posts Yet</h1>
      ) : (
        <div className="post_wrapper">
          {posts.map((post, index) => {
            return (
              <div className="singlepost" key={index}>
                <div className="postHeader">
                  <div className="postAvatar">
                    <Avatar src={user.photoUrl} alt={user.name} />

                    <div className="postInfo">
                      <h2>
                        <Link to={`/profile/${user._id}`}>{user.name}</Link>
                      </h2>
                      <p>
                        {post.time} - {post.date}
                      </p>
                    </div>
                  </div>

                  {/* if the user is genuine and if the userid === authUserId,
                   This options will be shown and by using this options,
                   the user can update and delete his posts */}
                  <AuthUserOptions authUser={authUser} post={post} />
                </div>

                <p className="postTitle">{post.title}</p>

                {/* if the user has posted an images in the post,
                it will be showed up */}
                {post.imgUrl ? (
                  <div className="postImg">
                    <img src={post.imgUrl} alt={post.title} />
                  </div>
                ) : null}

                <div className="visitPostButton">
                  <Link to={`/post/${post._id}`}>
                    <Button>View Post</Button>
                  </Link>{" "}
                  <span className="likeCount">{post.likers.length} Likes</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </TabPanel>
  );
};

export default Posts;
