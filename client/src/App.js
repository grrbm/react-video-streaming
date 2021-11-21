import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./style/tailwind.css";
import { VideoPlayer, VideoPlayerAlt, Videos } from "./components/Video";
import Main from "./Pages/main";
import "./app.css";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const App = ({ video }) => {
  return (
    <Router>
      <ScrollToTop />
      <NavigationBar />
      <div className="relative bg-gray-1000">
        <Switch>
          <Route path="/watch/:id" component={VideoPlayerAlt} exact />
          <Route path="/" component={Main} exact />
          {/* <Route path="/main" component={Main} exact /> */}
          <Route path="/upload" component={Videos} exact />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
};

const mapStateToProp = ({ app }) => ({ video: app.video });
export default connect(mapStateToProp, {})(App);
