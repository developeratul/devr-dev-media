import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { toast } from "react-toastify";

const ReplyComment = ({ comment, userId, setReplyAdded }) => {
  const [reply, setReply] = useState("");

  const PostReply = async (commentId) => {
    try {
      const res = await fetch("/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId, reply, userId }),
      });

      const body = await res.json();

      if (res.status === 200) {
        toast.dark(body.success);
        setReply("");
        setReplyAdded(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="reply_section">
      <input
        onChange={(event) => setReply(event.target.value)}
        type="text"
        placeholder={`Reply to ${comment.user.name}`}
        value={reply}
      />
      <Button onClick={() => (reply ? PostReply(comment._id) : null)}>
        Reply
      </Button>
    </div>
  );
};

export default ReplyComment;
