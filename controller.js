// schemas
const Users = require("./models/user");
const Posts = require("./models/post");
const Comments = require("./models/comments");
const Reply = require("./models/reply");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { cloudinary } = require("./cloudinary");

// TODO: you might not understand anything here
// TODO: please checkout routes.js

module.exports = {
  authenticate: (req, res) => res.send(req.user),

  logOutUser: async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter(
        (e) => e.token !== req.user.token
      );
      res.clearCookie("jwt");

      await req.user.save();

      res.status(200).json({ success: `Bye Bye ${req.user.name}` });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  getProfile: async (req, res) => {
    try {
      const id = req.params.id;

      const user = await Users.findOne({ _id: id });

      res.status(200).send(user);
    } catch (err) {
      res.status(404).json({ err: "User Not Found" });
    }
  },

  getUsers: async (req, res) => {
    try {
      const { limit } = req.query;
      const users = await Users.find().limit(Number(limit));

      res.status(200).send(users);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  getSingleUser: async (req, res) => {
    try {
      const id = req.params.id;

      const user = await Users.findOne({ _id: id });

      res.status(200).send(user);
    } catch (err) {
      res.status(404).json({ err: "User Not Found" });
    }
  },

  suggestUser: async (req, res) => {
    try {
      const user = await Users.find().limit(7);

      res.status(200).send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  getFollowerData: async (req, res) => {
    try {
      const ids = req.params.ids;

      const id = ids.split(",");

      const user = await Users.find({ _id: { $in: id } });

      res.status(200).send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  getFollowingData: async (req, res) => {
    try {
      const ids = req.params.ids;

      const id = ids.split(",");

      const user = await Users.find({ _id: { $in: id } });

      res.status(200).send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  getUserPosts: async (req, res) => {
    try {
      const id = req.params.id;
      const { limit } = req.query;

      const posts = await Posts.find({ userId: id })
        .sort({ date: -1 })
        .limit(Number(limit));

      res.status(200).send(posts);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  getAllUsersPost: async (req, res) => {
    try {
      const { id } = req.params;

      const posts = await Posts.find({ userId: id });

      res.status(200).send(posts);
    } catch (err) {
      res.status(404).json({ err: "Not Found" });
    }
  },

  getSinglePost: async (req, res) => {
    try {
      const id = req.params.id;

      const post = await Posts.findOne({ _id: id });
      const user = await Users.findOne({ _id: post.userId });

      res.status(200).send({ post, user });
    } catch (err) {
      res.status(404).json({ err: "Post Not Found" });
    }
  },

  getUserFeedPosts: async (req, res) => {
    try {
      const ids = req.params.ids.split(",");
      const { limit } = req.query;

      const posts = await Posts.find({ userId: { $in: ids } })
        .sort({ date: -1 })
        .limit(Number(limit));
      const users = await Users.find({ _id: { $in: ids } });

      res.status(200).send({ posts, users });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  getPostLikers: async (req, res) => {
    try {
      const ids = req.params.ids.split(",");

      const likers = await Users.find({ _id: { $in: ids } });

      res.status(200).send(likers);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  getComments: async (req, res) => {
    try {
      const postId = req.params.postId;

      const comments = await Comments.find({ postId: postId }).sort({
        date: -1,
      });
      const users = await Users.find({
        _id: comments.map((comment) => comment.userId),
      });

      res.status(200).send({ comments, users });
    } catch (err) {
      res.status(400).json({ err: "No Comments Yet" });
    }
  },

  getReplies: async (req, res) => {
    try {
      const id = req.params.id;

      const replies = await Reply.find({ commentId: id });
      const users = await Users.find({
        _id: replies.map((reply) => reply.userId),
      });

      res.status(200).send({ users, replies });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password, gender, country, profession, conPass } =
        req.body;

      if (
        !name ||
        !email ||
        !password ||
        !gender ||
        !country ||
        !profession ||
        !conPass
      ) {
        res.status(401).json({ err: "Please fill all the fields properly" });
      }

      if (password !== conPass) {
        res.status(403).json({ err: "Passwords doesn't matched" });
      }

      if (!validator.isEmail(email)) {
        res.status(405).json({ err: "Your email is invalid" });
      }

      const emailExists = await Users.findOne({ email });

      if (emailExists) {
        res.status(402).json({ err: "Email already exists" });
      }

      if (name.length > 12) {
        res
          .status(406)
          .json({ err: "Name cannot contain more than 12 character" });
      }

      if (
        name &&
        email &&
        password &&
        gender &&
        country &&
        profession &&
        password === conPass &&
        name.length <= 12
      ) {
        const userData = new Users({
          name,
          email,
          password,
          gender,
          country,
          profession,
          photoUrl: "",
          date: new Date().toLocaleDateString(),

          skills: "",
          bio: "",
          hackingOn: "",
          currentlyLearning: "",
          portfolio: "",
          twitter: "",
          github: "",
          dev: "",
        });

        const token = await userData.generateAuthToken();

        res.cookie("jwt", token);

        await userData.save();

        res.status(200).json({ success: "Your account has been registered!" });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });

      const passwordMatched = await bcrypt.compare(password, user.password);

      if (passwordMatched) {
        const token = await user.generateAuthToken();

        res.cookie("jwt", token);

        res.status(200).json({ success: `Welcome back ${user.name}` });
      } else if (!passwordMatched) {
        res.status(403).json({ err: "Your login details are invalid" });
      }
    } catch (err) {
      res.status(400).json({ err: "Invalid credentials" });
    }
  },

  postSomething: async (req, res) => {
    try {
      const { title, body, imgUrl, userId } = req.body;

      if (!title) {
        res.status(401).json({ err: "Posts must contain a title" });
      }

      if (imgUrl || imgUrl !== "") {
        let pic = await cloudinary.uploader.upload(imgUrl, {
          upload_preset: "ml_default",
        });

        const post = new Posts({
          title,
          body,
          imgUrl: pic.secure_url,
          userId,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });

        await post.save();
        res.status(200).json({ success: "Posted Successfully" });
      } else if (!imgUrl || imgUrl === "") {
        const post = new Posts({
          title,
          body,
          imgUrl: "",
          userId,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });

        await post.save();
        res.status(200).json({ success: "Posted Successfully" });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  },

  reply: async (req, res) => {
    try {
      const { userId, commentId, reply } = req.body;

      const replyComment = new Reply({
        userId,
        commentId,
        reply,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      });

      await replyComment.save();

      res.status(200).json({ success: "Reply Added" });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  postComment: async (req, res) => {
    try {
      const { postId, userId, comment } = req.body;

      const newComment = new Comments({
        postId,
        userId,
        comment,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      await newComment.save();

      res.status(200).json({ success: "Comment Posted" });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  updateAvatar: async (req, res) => {
    try {
      const { photoUrl, id } = req.body;

      const pic = await cloudinary.uploader.upload(photoUrl, {
        upload_preset: "ml_default",
      });

      await Users.findById(id, (err, user) => {
        user.photoUrl = pic.secure_url;

        user.save();

        res.status(200).json({ success: "Avatar Updated" });
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  updateProfileInfo: async (req, res) => {
    try {
      const {
        name,
        email,
        id,
        skills,
        bio,
        hackingOn,
        currentlyLearning,
        portfolio,
        twitter,
        github,
        dev,
        profession,
      } = req.body;

      await Users.findById(id, (err, user) => {
        if (name) user.name = name;
        if (email) {
          if (!validator.isEmail(email)) {
            res.status(400).json({ err: "Your email is invalid" });
          }
          if (validator.isEmail(email)) {
            user.email = email;
          }
        }
        if (profession) user.profession = profession;
        if (bio) user.bio = bio;
        if (skills) user.skills = skills;
        if (hackingOn) user.hackingOn = hackingOn;
        if (currentlyLearning) user.currentlyLearning = currentlyLearning;
        if (portfolio) user.portfolio = portfolio;
        if (twitter) user.twitter = twitter;
        if (github) user.github = github;
        if (dev) user.dev = dev;

        if (bio === "") user.bio = "";
        if (skills === "") user.skills = "";
        if (hackingOn === "") user.hackingOn = "";
        if (currentlyLearning === "") user.currentlyLearning = "";
        if (portfolio === "") user.portfolio = "";
        if (twitter === "") user.twitter = "";
        if (github === "") user.github = "";
        if (dev === "") user.dev = "";

        user.save();

        res.status(200).json({ success: "Successfully Updated" });
      });
    } catch (err) {
      res.status(403).err(err);
    }
  },

  followUser: async (req, res) => {
    try {
      const authUser = req.body.authUser; // this guy is following some one
      // const gettingFollowUser = req.body.gettingFollowUser; // * this guy is getting follow from the authUser
      // const authUserId = req.body.authUserId;
      const gettingFollowUserId = req.body.gettingFollowUserId;

      Users.findByIdAndUpdate(
        gettingFollowUserId,
        {
          $push: { followers: authUser._id },
        },
        { new: true },
        (err, result) => {
          if (err) {
            res.status(403).send(err);
          }

          Users.findByIdAndUpdate(
            authUser._id,
            {
              $push: { followings: gettingFollowUserId },
            },
            { new: true }
          )
            .then((result) => res.status(200).json({ success: "Followed" }))
            .catch((err) => res.status(402).send(err));
        }
      );
    } catch (err) {
      res.status(400).send(err);
    }
  },

  unFollowUser: async (req, res) => {
    try {
      const authUser = req.body.authUser; // this guy is following some one
      // const gettingFollowUser = req.body.gettingFollowUser; // * this guy is getting follow from the authUser
      // const authUserId = req.body.authUserId;
      const gettingFollowUserId = req.body.gettingFollowUserId;

      Users.findByIdAndUpdate(
        gettingFollowUserId,
        {
          $pull: { followers: authUser._id },
        },
        { new: true },
        (err, result) => {
          if (err) {
            res.status(403).send(err);
          }

          Users.findByIdAndUpdate(
            authUser._id,
            {
              $pull: { followings: gettingFollowUserId },
            },
            { new: true }
          )
            .then((result) => res.status(200).json({ success: "Unfollowed" }))
            .catch((err) => res.status(402).send(err));
        }
      );
    } catch (err) {
      res.status(400).send(err);
    }
  },

  updatePost: async (req, res) => {
    try {
      const { id, imgUrl, title, body } = req.body;

      const thePost = await Posts.findOne({ _id: id });

      if (thePost.imgUrl !== imgUrl) {
        const pic = await cloudinary.uploader.upload(imgUrl, {
          upload_preset: "ml_default",
        });

        await Posts.findById(id, (err, post) => {
          post.title = title;
          post.body = body;
          post.imgUrl = pic.secure_url;

          post.save();
          res.status(200).json({ success: "Post has been updated" });
        });
      }

      // if the previous picUrl and the present url is same,
      // this one should be executed
      else if (thePost.imgUrl === imgUrl) {
        await Posts.findById(id, (err, post) => {
          post.title = title;
          post.body = body;

          post.save();
          res.status(200).json({ success: "Post has been updated" });
        });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  },

  likePost: async (req, res) => {
    try {
      const authUserId = req.body.userId;
      const postId = req.body.postId;

      await Posts.findById(postId, (err, post) => {
        post.likers = post.likers.concat({ liker: authUserId });

        post.save();

        res.status(200).json({ success: "Liked 👍" });
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  unLikePost: async (req, res) => {
    try {
      const authUserId = req.body.userId;
      const postId = req.body.postId;

      await Posts.findById(postId, (err, post) => {
        post.likers = post.likers.filter((liker) => liker.liker !== authUserId);

        post.save();

        res.status(200).json({ success: "Unliked 👎" });
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  deletePost: async (req, res) => {
    try {
      const id = req.params.id;
      const comments = await Comments.find({ postId: id });
      const replies = await Reply.find({
        commentId: comments.map((comment) => comment._id),
      });

      await Posts.findByIdAndRemove(id).exec();
      await Comments.findByIdAndRemove(comments).exec();
      await Reply.findByIdAndRemove(replies).exec();

      res.status(200).json({ success: "Post has been deleted" });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  deleteSinglePost: async (req, res) => {
    try {
      const id = req.params.id;

      await Comments.findByIdAndRemove(id).exec();

      res.status(200).json({ success: "Comment Deleted" });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  deleteReply: async (req, res) => {
    try {
      const id = req.params.id;

      await Reply.findByIdAndRemove(id).exec();

      res.status(200).json({ success: "Reply Deleted" });
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
