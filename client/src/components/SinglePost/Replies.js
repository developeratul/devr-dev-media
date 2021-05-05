import { Avatar, Button } from "@material-ui/core";
import DeleteOutlineOutlined from "@material-ui/icons/DeleteOutlineOutlined";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Replies = ({ comment, user, setReplyAdded, replyAdded }) => {
  const [replies, setReplies] = useState([]);

  const fetchReplies = async () => {
    try {
      const res = await fetch(`/getReplies/${comment._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { replies, users } = await res.json();

      const replyWithUser = replies.map((reply) => ({
        ...reply,
        user: users.filter((user) => user._id === reply.userId)[0],
      }));

      setReplies(replyWithUser);
      setReplyAdded(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [replyAdded]);
  return (
    <div className="allReplies">
      <details>
        <summary>View Replies</summary>

        {replies.length === 0 ? (
          <h2 className="empty">No Replies</h2>
        ) : (
          replies.map((reply, index) => {
            return (
              <div className="singleReply" key={index}>
                <div className="reply_header">
                  <div className="reply_user_Details">
                    <Avatar src={reply.user.photoUrl} alt={reply.user.name} />
                    <div className="desc">
                      <h2>
                        <Link to={`/profile/${reply.user._id}`}>
                          {reply.user.name}
                        </Link>
                      </h2>
                      <p>
                        {reply.time} - {reply.date}
                      </p>
                    </div>
                  </div>

                  {reply.userId === user._id ||
                  user._id === "608a4f781d3b051b203ed2cb" ? (
                    <div className="authUserOptions">
                      <Button
                        onClick={async () => {
                          const res = await fetch(`/deleteReply/${reply._id}`, {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                            },
                          });

                          const body = await res.json();

                          if (res.status === 200) {
                            toast.dark(body.success);
                            setReplyAdded(true);
                          }
                        }}
                      >
                        <DeleteOutlineOutlined />
                      </Button>
                    </div>
                  ) : null}
                </div>

                <div className="replyBody">
                  <p>{reply.reply}</p>
                </div>
              </div>
            );
          })
        )}
      </details>
    </div>
  );
};

export default Replies;
