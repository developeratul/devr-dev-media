import React, { useEffect, useState } from "react";
import FullWidthTabs from "./UserdetailsPosts";

// icons
import PostAddIcon from "@material-ui/icons/PostAdd";
import GroupIcon from "@material-ui/icons/Group";
import GroupAddIcon from "@material-ui/icons/GroupAdd";

const ProfileContent = ({ user, id, authUser }) => {
  const [posts, setPosts] = useState([]);
  const [totalPostsPublished, setTotalPostsPublished] = useState(0);
  const [postLimit, setPostLimit] = useState(3);

  // for fetching all the posts
  // posted by the current user
  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`/posts/${id}?limit=${postLimit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json();

      setPosts(body);
    } catch (err) {
      console.log(err);
    }
  };

  window.addEventListener("scroll", () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight) {
      setPostLimit(postLimit + 3);
    }
  });

  const fetchAllUserPostAtaTime = async () => {
    const res = await fetch(`/getUsersPost/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const body = await res.json();

    if (res.status === 200) {
      setTotalPostsPublished(body.length);
    }
  };

  useEffect(() => {
    fetchUserPosts();
    fetchAllUserPostAtaTime();
  }, [user, id, postLimit]);

  return (
    <div className="profile_content">
      <div className="profile_content_wrapper">
        {/*  */}

        <div className="userInfoAndActivity">
          <div className="singleInfo">
            <h2 className="heading">Skills</h2>
            <p>{user.skills ? user.skills : "Not Provided"}</p>
          </div>

          <div className="singleInfo">
            <h2 className="heading">Currently Learning</h2>
            <p>
              {user.currentlyLearning ? user.currentlyLearning : "Not Provided"}
            </p>
          </div>

          <div className="singleInfo">
            <h2 className="heading">Hacking On</h2>
            <p>{user.hackingOn ? user.hackingOn : "Not Provided"}</p>
          </div>

          <div className="singleInfo">
            <h2 className="heading">Summary</h2>
            <p>
              <div>
                <PostAddIcon />
              </div>
              <div>{totalPostsPublished} Posts Published</div>
            </p>
            <p>
              <div>
                <GroupIcon />
              </div>
              <div>{user.followers.length} Followers</div>
            </p>
            <p>
              <div>
                <GroupAddIcon />
              </div>
              <div>{user.followings.length} Following</div>
            </p>
          </div>
        </div>

        <div className="userPosts">
          {/* I am passing the posts array to this component
          And this component is passing it to the Posts.js under the
          UserDetailsPosts.js */}
          <FullWidthTabs
            user={user}
            authUser={authUser}
            id={id}
            posts={posts}
          />
        </div>

        {/*  */}
      </div>
    </div>
  );
};

export default ProfileContent;
