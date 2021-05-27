import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Followers from "./UserDetails/Followers";
import Followings from "./UserDetails/Followings";
import Posts from "./UserDetails/Posts";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));

export default function FullWidthTabs({ user, id, posts, authUser }) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const fetchFollowerData = async () => {
    try {
      const res = await fetch(`/getAllFollowerData/${user.followers}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json();

      setFollowers(body);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFollowingData = async () => {
    try {
      const res = await fetch(`/getAllFollowingData/${user.followings}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.json();

      setFollowings(body);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFollowerData();
    fetchFollowingData();
  }, [id, user]);

  return (
    <div className={classes.root} className="tabContainer">
      <AppBar position="sticky" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label={`Posts`} {...a11yProps(0)} />
          <Tab
            label={`Followers (${user.followers.length})`}
            {...a11yProps(1)}
          />
          <Tab
            label={`Following (${user.followings.length})`}
            {...a11yProps(2)}
          />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <Posts
          TabPanel={TabPanel}
          dir={value.direction}
          value={value}
          id={id}
          posts={posts}
          user={user}
          authUser={authUser}
        />

        <Followers
          user={user}
          value={value}
          dir={value.direction}
          TabPanel={TabPanel}
          followers={followers}
        />

        <Followings
          user={user}
          value={value}
          dir={value.direction}
          TabPanel={TabPanel}
          followings={followings}
        />
      </SwipeableViews>
    </div>
  );
}
