import React from "react";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Button } from "@material-ui/core";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

// if the user is genuine and if the userid === authUserId,
// This options will be shown
const AuthUserOptions = ({ authUser, post }) => {
  const [anchorEl, setAnchorEl] = React.useState(null); // material-ui
  const history = useHistory();

  // from the material-ui components
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  //

  // for deleting a post
  const deletePost = async (id) => {
    try {
      const res = await fetch(`/deletePost/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json();

      if (res.status === 200) {
        history.push("/");
        toast.dark(body.success);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {authUser._id === post.userId ||
      authUser._id === "608a4f781d3b051b203ed2cb" ? (
        <>
          <Button onClick={handleClick}>
            <MoreHorizIcon />
          </Button>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => deletePost(post._id)}>
              Delete Post
            </MenuItem>

            <Link
              to={`/editPost/${post._id}`}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <MenuItem onClick={handleClose}>Edit Post</MenuItem>
            </Link>
          </Menu>
        </>
      ) : null}
    </div>
  );
};

export default AuthUserOptions;
