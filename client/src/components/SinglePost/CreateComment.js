import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { toast } from "react-toastify";

const CreateComment = ({ postUser, postId, comments, setcommentAdded }) => {
  const [comment, setComment] = useState("");

  // for posting a comment
  const postComment = async () => {
    try {
      const res = await fetch("/postComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId: postUser._id, comment }),
      });

      const body = await res.json();

      if (res.status === 200) {
        setComment("");
        comments.push({
          comment,
          user: postUser,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });
        setcommentAdded(true);
        toast.dark(body.success);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="create_comment">
      <textarea
        id="createCommentbox"
        placeholder="Write Your Comment Here"
        onChange={(event) => setComment(event.target.value)}
        value={comment}
      ></textarea>
      <Button onClick={() => (comment ? postComment() : null)}>Post</Button>
    </div>
  );
};

export default CreateComment;
