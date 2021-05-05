import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SuggestedUser = () => {
  const [users, setUsers] = useState([]);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/suggestUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json();

      setUsers(body);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="suggestedUsers">
      <h2 className="section_heading">Suggested users</h2>

      <div className="suggestedUserWrapper">
        {users.length === 0 ? (
          <h2 className="loadMessage">Loading...</h2>
        ) : (
          users.map((user) => {
            return (
              <div className="singleUser">
                <div className="user_profile_header">
                  <Avatar src={user.photoUrl} alt={user.name} />

                  <div className="use_details">
                    <h2>
                      <Link to={`/profile/${user._id}`}>{user.name}</Link>
                    </h2>
                    <p>{user.profession}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <h2 className="showmoreText">
          <Link to="/users">Explore more...</Link>
        </h2>
      </div>
    </div>
  );
};

export default SuggestedUser;
