import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import AppBar from "../components/AppBar";
import { Button } from "@material-ui/core";

const EditPost = () => {
  const { id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState({});
  const [post, setPost] = useState({});

  const [input, setInput] = useState({
    title: post.title,
    desc: post.body,
  });
  const [photo, setPhoto] = useState("");
  const [previewSource, setPreviewSource] = useState("");

  // if the user is not authorized,
  // the user will be redirected to the login page.
  // Here I am fetching a back-end route which has a middleware
  // Which is checking if the user is authorized
  // check out auth.js and routes.js (line:17)
  // this function is just for auth
  // not for fetching data's
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

      setLoading(false);
      setAuthUser(body);

      if (!body._id) {
        history.push("/login");
        toast.dark("You have to login in order to browse");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // for fething the post data according to the id
  const getPostData = async () => {
    try {
      const res = await fetch(`/singlePost/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json();

      const { post } = body;

      setPost(post);
    } catch (err) {
      console.log(err);
    }
  };

  // for handling all the input's
  const InputEvent = (event) => {
    const { name, value } = event.target;

    setInput((pre) => ({ ...pre, [name]: value }));
  };

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

  // for updating the post
  const updatePost = async (e) => {
    e.preventDefault();

    const { title, desc } = input;

    try {
      const res = await fetch("/updatePost", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body: desc,
          id: post._id,
          imgUrl: previewSource ? previewSource : post.imgUrl,
        }),
      });

      const body = await res.json();

      if (res.status === 200) {
        history.push(`/post/${post._id}`);
        toast.dark(body.success);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkAuth();
    document.title = "Dev Media / Edit Post";
    getPostData();

    setInput({
      title: post.title,
      desc: post.body,
    });
  }, [loading, post.title]);

  return (
    <>
      <AppBar />

      {loading ? (
        <Loader />
      ) : (
        <div className="EditPostPage">
          <div className="container">
            <div className="editPostContentWrapper">
              {/*  */}

              <h2 className="heading">Edit Post</h2>

              {post.imgUrl ? (
                <>
                  <div className="singleField">
                    <img
                      src={previewSource ? previewSource : post.imgUrl}
                      alt={post.title}
                    />
                  </div>

                  <div className="singleField">
                    <input
                      accept="image/*"
                      id="contained-button-file"
                      type="file"
                      style={{ display: "none" }}
                      onChange={TakePhoto}
                    />
                    <label htmlFor="contained-button-file">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                      >
                        Change Photo
                      </Button>
                    </label>

                    {previewSource ? (
                      <Button
                        style={{ margin: "0px 5px", background: "Red" }}
                        variant="contained"
                        color="primary"
                        onClick={() => setPreviewSource("")}
                      >
                        Remove Image
                      </Button>
                    ) : null}
                  </div>
                </>
              ) : null}

              <div className="singleField">
                <input
                  type="text"
                  placeholder="Title"
                  name="title"
                  onChange={InputEvent}
                  value={input.title}
                />
              </div>

              <div className="singleField">
                <textarea
                  onChange={InputEvent}
                  name="desc"
                  placeholder="Content"
                  cols="30"
                  rows="10"
                  value={input.desc}
                ></textarea>
              </div>

              <div className="singleField">
                <Button
                  onClick={updatePost}
                  variant="contained"
                  color="primary"
                >
                  Save Changes
                </Button>
              </div>

              {/*  */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPost;
