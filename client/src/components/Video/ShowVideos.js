import React from "react";

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
export default ShowVideos;
