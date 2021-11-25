import React, { useEffect, useState } from "react";
import { GoTriangleRight } from "react-icons/go";
import { FaCircle } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import Axios from "axios";

const Video = ({ root, name }) => {
  const history = useHistory();
  const [videoThumb, setVideoThumb] = useState();
  const navigateToWatch = () => {
    history.push(`/watch/${name}`);
  };
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
      <a className="h-full" onClick={navigateToWatch}>
        {videoThumb ? <img src={`data:image/jpg;base64,${videoThumb}`} /> : ""}

        {/* <p
            className="p-2  overflow-hidden"
            style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {name}
          </p> */}
      </a>
      <div className="video-category">FITNESS LONDON</div>
      <div className="video-title text-white">
        Postnatal Wourkout | All Levels | No Equipament | #22
      </div>
      <div className="video-text flex items-center">
        LUCY GORNALL
        <FaCircle color="#E02727" size="4" className="mx-2" />
        30 MIN
        <FaCircle color="#E02727" size="4" className="mx-2" />
        ENGLISH
        <FaCircle color="#E02727" size="4" className="mx-2" />1
      </div>
      <div className="video-time text-white flex items-center">
        <GoTriangleRight color="#EB1515" />
        Started 10 mins ago
      </div>
    </div>
  );
};

export default Video;
