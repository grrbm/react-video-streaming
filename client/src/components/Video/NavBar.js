import React from 'react';
import Upload from './Upload';
import UploadVideos from './UploadVideos'
const NavBar = () => (
  <nav className='p-4 border-b flex items-center '>
    <div className='flex-1'></div>
    <Upload />
    <UploadVideos />
  </nav>
);

export default NavBar;
