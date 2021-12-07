import React, { useEffect, useState } from "react";
import { fetchVideos } from "../../actions/appActions";
import { connect } from "react-redux";
import NavBar from "./NavBar";
import Axios from "axios";
import "./UploadPage.css";

const ShowVideos = ({ root, name }) => {
  const [videoThumb, setVideoThumb] = useState();
  useEffect(() => {
    Axios.get(`/video/${name}`)
      .then(({ data: video }) => {
        let videoThumbnail = Buffer.from(video.videoThumbnail.data);
        let bufferString = videoThumbnail.toString("base64");
        setVideoThumb(bufferString);
      })
      .catch(({ response = {} }) => {
        const status = response.status;
        if (status === 500) console.log("error");
      });
  }, []);
  return (
    <div className="rounded-md shadow-xs  hover:shadow-lg ">
      <a className="h-full" href={`/watch/${root}`}>
        {videoThumb ? (
          <img
            className="rounded-t-md"
            src={`data:image/jpg;base64,${videoThumb}`}
          />
        ) : (
          ""
        )}
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

const UploadPage = ({ fetchVideos, videos }) => {
  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="mainDiv">
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

export default connect(mapStateToProp, { fetchVideos })(UploadPage);
