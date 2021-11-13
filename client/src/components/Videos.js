import React, { useEffect } from 'react';
import { fetchVideos } from '../actions/appActions';
import { connect } from 'react-redux';

const Video = ({ root, name }) => (
  <div className='bg-gray-100 rounded-md shadow-xs  hover:shadow-lg '>
    <a className='h-full' href={`/watch/${root}`}>
      <img className='rounded-t-md' src={`/video/${root}/frame.jpg`} />
      <p
        className='p-2  overflow-hidden'
        style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {name}
      </p>
    </a>
  </div>
);

const Videos = ({ fetchVideos, videos }) => {
  useEffect(() => {
    fetchVideos();
  }, []);
  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 m-4'>
      {videos.map((video, key) => (
        <Video {...video} key={key}/>
      ))}
    </div>
  );
};

const mapStateToProp = ({ app }) => ({ videos: app.videos });
export default connect(mapStateToProp, { fetchVideos })(Videos);
