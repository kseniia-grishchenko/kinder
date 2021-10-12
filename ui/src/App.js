import React from "react";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/header/header";
import Home from "./views/home/home";
import Login from "./views/login/login";
import Subscriptions from "./views/subscriptions/subscriptions";
import Followers from "./views/followers/followers";
import UserInfo from "./views/userInfo/userInfo";
import Profile from "./views/profile/profile";
import Registration from "./views/registration/registration";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Registration} />
        <Route path="/subscriptions/:id" component={Subscriptions} />
        <Route path="/followers/:id" component={Followers} />
        <Route path="/user/:id" component={UserInfo} />
        <Route path="/profile/" component={Profile} />
      </Switch>
    </Router>
  );
}

export default App;
