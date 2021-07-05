import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import CreateComment from "./CreateComment";
import { toast } from "react-toastify";

import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import ReplyComment from "./ReplyComment";
import Replies from "./Replies";

const CommentSection = ({ post, user }) => {
  const [comments, setComments] = useState([]);
  const [commentAdded, setcommentAdded] = useState(false);
  const [replyAdded, setReplyAdded] = useState(false);

  const history = useHistory();

  const fetchComments = async () => {
    try {
      const res = await fetch(`/allComments/${post._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { comments, users } = await res.json();

      if (res.status === 200) {
        const commentWithUser = comments.map((comment) => ({
          ...comment,
          user: users.filter((user) => user._id === comment.userId)[0],
        }));

        setComments(commentWithUser);
        setcommentAdded(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [commentAdded]);

  //
  return (
    <div className="comment_section">
      <CreateComment
        setcommentAdded={setcommentAdded}
        postId={post._id}
        postUser={user}
        comments={comments}
      />

      <h2 style={{ marginBottom: "20px", fontFamily: "'Raleway', sans-serif" }}>
        Comments
      </h2>

      <div className="allComment">
        {comments.length === 0 ? (
          <h2 className="no_message">No Comments Yet</h2>
        ) : (
          comments.map((comment) => {
            return (
              <div className="singleComment">
                <div className="comment_headers">
                  <div className="comment_details">
                    <Avatar src={comment.user.photoUrl} />
                    <div className="desc">
                      <h2>
                        <Link to={`/profile/${comment.user._id}`}>
                          {comment.user.name}
                        </Link>
                      </h2>
                      <p>
                        {comment.time} - {comment.date}
                      </p>
                    </div>
                  </div>

                  {comment.userId === user._id ||
                    post.userId === user._id ||
                    user._id === "608a4f781d3b051b203ed2cb" ? (
                    <div className="authUserOptions">
                      <Button
                        variant="text"
                        // for deleting a comment
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `/deleteCommet/${comment._id}`,
                              {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                              }
                            );

                            const body = await res.json();

                            if (res.status === 200) {
                              setComments(
                                comments.filter(
                                  (theComments) =>
                                    theComments._id !== comment._id
                                )
                              );
                              toast.dark(body.success);
                            }
                          } catch (err) {
                            console.log(err);
                          }
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </Button>
                    </div>
                  ) : null}
                </div>

                <div className="comment_body">
                  <p style={{ whiteSpace: "pre-wrap" }}>{comment.comment}</p>
                </div>

                <ReplyComment
                  comment={comment}
                  setReplyAdded={setReplyAdded}
                  userId={user._id}
                />
                <Replies
                  replyAdded={replyAdded}
                  setReplyAdded={setReplyAdded}
                  user={user}
                  comment={comment}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;
