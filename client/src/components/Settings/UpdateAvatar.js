import React, { useState } from "react";
import { toast } from "react-toastify";

import Button from "@material-ui/core/Button";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import { useHistory } from "react-router";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(19),
    height: theme.spacing(19),
  },
}));

const UpdateAvatar = ({ authUser }) => {
  const [photo, setPhoto] = useState("");
  const [previewSource, setPreviewSource] = useState("");

  const history = useHistory();
  const classes = useStyles();

  // for updating the avatar only
  // I am using cloudinary for that case
  // I will send the data url to my back-end
  // the it will be uploaded in cloudinary
  // the I am updating the avatar field with the user's selected photo
  // which was uploaded by the user
  const SaveAvatar = async () => {
    try {
      const res = await fetch("/updateAvatar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: authUser._id, photoUrl: previewSource }),
      });

      const body = await res.json();

      if (res.status === 200) {
        toast.dark(body.success);
        history.push(`/profile/${authUser._id}`);
      } else if (res.status === 400) {
        toast.error("Sorry looks like your photo was not compatible.");
      }
    } catch (err) {
      console.log(err);
    }
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

  return (
    <>
      {/* this one is containing the avatar and the buttons */}
      <div className="settings_content_wrapper">
        {/*  */}

        <div className="user_avatar">
          <Avatar
            src={previewSource ? previewSource : authUser.photoUrl}
            alt="Avatar"
            className={classes.large}
          />
        </div>

        <div className="buttonContainer">
          <div className="fileUploadField singleField">
            <input
              accept="image/*"
              id="contained-button-file"
              type="file"
              style={{ display: "none" }}
              onChange={TakePhoto}
            />
            <label htmlFor="contained-button-file">
              <Tooltip title="Change this Avatar">
                <Button variant="contained" component="span">
                  Change Avatar
                </Button>
              </Tooltip>
            </label>
          </div>

          <div className="singleField">
            <Tooltip title="Save Avatar">
              <Button
                disabled={!photo}
                variant="contained"
                color="primary"
                onClick={SaveAvatar}
              >
                <SaveOutlinedIcon /> <span>Save Changes</span>
              </Button>
            </Tooltip>
          </div>
        </div>
        {/*  */}
      </div>
    </>
  );
};

export default UpdateAvatar;
