import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router";
import { toast } from "react-toastify";

const PostCreation = ({ authUser }) => {
  const [photo, setPhoto] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [postData, setPostData] = useState({
    title: "",
    desc: "",
  });

  const history = useHistory();

  // for handling the file input button
  const TakePhoto = (event) => {
    const file = event.target.files[0];
    previewFile(file);
    setPhoto(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const TakePost = (event) => {
    const { name, value } = event.target;

    setPostData((pre) => ({ ...pre, [name]: value }));
  };

  const { title, desc } = postData;

  const SubmitPost = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body: desc,
          userId: authUser._id,
          imgUrl: previewSource,
        }),
      });

      const body = await res.json();

      if (res.status === 200) {
        toast.dark(body.success);
        history.push("/");
      } else if (res.status === 401) {
        toast.error(body.err);
      } else if (res.status === 400) {
        toast.error("Can't post soory. Server error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="post_creation_box">
      <h2 className="heading">
        You are posting as <span>{authUser.name}</span>
      </h2>

      <div className="postform">
        {previewSource ? (
          <div className="singleField">
            <img src={previewSource} alt="" />
            <div className="singleField">
              <Button
                style={{ background: "Red" }}
                onClick={() => setPreviewSource("")}
                variant="contained"
                color="primary"
              >
                Remove Image
              </Button>
            </div>
          </div>
        ) : null}

        {previewSource ? null : (
          <div className="singleField">
            <input
              accept="image/*"
              id="contained-button-file"
              type="file"
              style={{ display: "none" }}
              onChange={TakePhoto}
            />
            <label htmlFor="contained-button-file">
              <Button color="primary" variant="contained" component="span">
                Upload Image
              </Button>
            </label>
          </div>
        )}

        <div className="singleField">
          <input
            onChange={TakePost}
            name="title"
            type="text"
            placeholder="Post Title"
          />
        </div>

        <div className="singleField">
          <textarea
            name="desc"
            placeholder="Post Content"
            cols="30"
            rows="10"
            onChange={TakePost}
          ></textarea>
        </div>

        <div className="singleField">
          <Button onClick={SubmitPost} color="primary" variant="contained">
            Submit Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCreation;
