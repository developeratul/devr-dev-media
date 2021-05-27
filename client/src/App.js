import React from "react";
import "./styles/style.css"; // global styles
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import CreatePost from "./pages/CreatePost";
import Settings from "./pages/Settings";
import EditPost from "./pages/EditPost";
import SinglePost from "./pages/SinglePost";
import Error from "./pages/Error";

// All the user data's are fetched in individual files
// Cause I don't need that globally
// for example checkout Home.js

const App = () => {
  return (
    <>
      {/* the toast container */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />

      {/* All the routes */}
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/profile/:id" component={Profile} />
          <Route path="/editPost/:id" component={EditPost} />
          <Route path="/post/:id" component={SinglePost} />
          <Route path="/users" component={Users} />
          <Route path="/createPost" component={CreatePost} />
          <Route path="/settings" component={Settings} />
          <Route path="/*" component={Error} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
