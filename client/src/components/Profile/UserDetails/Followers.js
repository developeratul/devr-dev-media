import { Avatar } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const Followers = ({ value, dir, user, TabPanel, followers }) => {
  return (
    <>
      <TabPanel value={value} index={1} dir={dir}>
        {user.followers.length === 0 ? (
          <h1 className="no_message">No Followers</h1>
        ) : (
          <div className="follower_content_wrapper">
            {followers.map((follower, index) => {
              return (
                <div className="singleFollower" key={index}>
                  <div className="followerAvatar">
                    <Avatar src={follower.photoUrl} alt={follower.name} />
                  </div>
                  <div className="followerInfo">
                    <h2>
                      <Link to={`/profile/${follower._id}`}>
                        {follower.name}
                      </Link>
                    </h2>
                    <p>{follower.profession}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </TabPanel>
    </>
  );
};

export default Followers;
