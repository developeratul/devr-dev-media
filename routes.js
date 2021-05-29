const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");

const router = express.Router();

const auth = require("./middlewares/auth");

const {
  authenticate,
  logOutUser,
  getProfile,
  getUsers,
  suggestUser,
  getSingleUser,
  getFollowerData,
  getFollowingData,
  getUserPosts,
  getSinglePost,
  getUserFeedPosts,
  getPostLikers,
  getComments,
  getReplies,
  register,
  login,
  postSomething,
  reply,
  postComment,
  updateAvatar,
  updateProfileInfo,
  followUser,
  unFollowUser,
  updatePost,
  likePost,
  unLikePost,
  deletePost,
  deleteSinglePost,
  deleteReply,
  getAllUsersPost,
} = require("./controller");

router.use(express.json({ limit: "20mb" }));
router.use(express.urlencoded({ extended: true, limit: "20mb" }));
router.use(cookieParser());
router.use(cors());

// * All the get routes starts from here
// router.get("/", (req, res) => res.send("Server is up and running"));

// this middleware route is giving me all the data of the user
// in the front-end side
// for more information, check out auth.js
router.get("/auth", auth, authenticate);

// for logging out the user
router.get("/logout", auth, logOutUser);

// for individual users profile page data
router.get("/apiProfile/:id", getProfile);

// for getting all the user data
router.get("/getUsers", auth, getUsers);

// for suggesting some users
router.get("/suggestUser", auth, suggestUser);

// for getting a single user data in the user's page after search
router.get("/getUsers/:id", auth, getSingleUser);

// for getting all the follower details
router.get("/getAllFollowerData/:ids", auth, getFollowerData);

// for getting all the following details
router.get("/getAllFollowingData/:ids", auth, getFollowingData);

// for getting a certain amount of post
router.get("/posts/:id", auth, getUserPosts);

// for getting all the posts of an user
router.get("/getUsersPost/:id", auth, getAllUsersPost);

// for getting the data of a single post
// according to the id
router.get("/singlePost/:id", auth, getSinglePost);

// for showing the posts in the home page according to the
// following list
router.get("/followingPost/:ids", auth, getUserFeedPosts);

// for getting all the likers data
// who has liked the post
router.get("/getLikersData/:ids", auth, getPostLikers);

// for getting all the comments for a specific post
// according to the id
router.get("/allComments/:postId", auth, getComments);

// for getting all the particular replies of a comment
router.get("/getReplies/:id", auth, getReplies);

// * all the post routes starts from here
// for registering a user's account
router.post("/register", register);

// for logging in/authenticating the user
router.post("/login", login);

// for posting something in the news feed
router.post("/post", auth, postSomething);

// for replying to a comment
router.post("/reply", auth, reply);

// for posting a comment
router.post("/postComment", auth, postComment);

// * all the put requests starts from here
// for updating the user avatar
router.put("/updateAvatar", auth, updateAvatar);

// for updating the profile information
router.put("/updateProfileInfo", auth, updateProfileInfo);

// for following a user
router.put("/followUser", auth, followUser);

// for unFollowing a user
router.put("/unfollowUser", auth, unFollowUser);

// for updating a post
router.put("/updatePost", auth, updatePost);

// for liking a post
router.put("/like", auth, likePost);

// for unLiking a post
router.put("/unlike", auth, unLikePost);

// * all the delete routes starts from here
// for deleting a post
// and his comments (kids 🤣)
router.delete("/deletePost/:id", auth, deletePost);

// for deleting a comment
// ! spelling wrong
router.delete("/deleteCommet/:id", auth, deleteSinglePost);

// for deleting a reply
router.delete("/deleteReply/:id", auth, deleteReply);

module.exports = router;
