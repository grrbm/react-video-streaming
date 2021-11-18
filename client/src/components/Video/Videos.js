import React, { useEffect } from "react";
import { fetchVideos } from "../../actions/appActions";
import { connect } from "react-redux";
import NavBar from "./NavBar";

const ShowVideos = ({ root, name }) => {
  return (
    <div className="rounded-md shadow-xs  hover:shadow-lg ">
      <a className="h-full" href={`/watch/${root}`}>
        <img className="rounded-t-md" src={`/video/${root}/frame.jpg`} />
        <p
          className="p-2  overflow-hidden"
          style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {name}
        </p>
      </a>
    </div>
  );
};

const Videos = ({ fetchVideos, videos }) => {
  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 m-4">
        {videos.map((video) => (
          <ShowVideos {...video} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProp = ({ app }) => ({
  videos: app.videos1,
});

export default connect(mapStateToProp, { fetchVideos })(Videos);
