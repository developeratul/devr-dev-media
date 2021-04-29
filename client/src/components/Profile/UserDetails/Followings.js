import { Avatar } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const Followings = ({ value, dir, user, TabPanel, followings }) => {
  return (
    <>
      <TabPanel value={value} index={2} dir={dir}>
        {user.followings.length === 0 ? (
          <h2 className="no_message">{user.name} is not following anybody</h2>
        ) : (
          <div className="follower_content_wrapper">
            {followings.map((follower, index) => {
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

export default Followings;
