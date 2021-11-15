import React, { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';

import PlayIcon from '@material-ui/icons/PlayArrowRounded';
import PauseIcon from '@material-ui/icons/PauseRounded';
import PlayIconFilled from '@material-ui/icons/PlayCircleFilledWhiteRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import FullscreenIcon from '@material-ui/icons/FullscreenRounded';
import VolumeOn from '@material-ui/icons/VolumeUpRounded';
import VolumeOff from '@material-ui/icons/VolumeOffRounded';
import Fab from '../Fab';

const VideoPlayer = ({ events, root, name, match }) => {
  const videoRef = useRef();
  const [source, setSource] = useState(false);
  const [play, setPlay] = useState(true);
  const [volume, setVolume] = useState(true);
  const [current, setCurrent] = useState(0);
  const [stall, setStall] = useState(false);
  const forward = video => (video.currentTime += 10);
  const replay = video => (video.currentTime -= 10);
  const togglePlay = () => setPlay(prev => !prev);
  const toggleVolume = () => setVolume(prev => !prev);
  const animateBar = () => {
    const video = videoRef.current;
    const current = video.currentTime / video.duration;
    setCurrent(() => current);
  };
  const zoomVideo = () => {
    const video = videoRef.current;
    video.requestFullscreen =
      video.requestFullscreen ||
      video.mozRequestFullscreen ||
      video.msRequestFullscreen ||
      video.webkitRequestFullscreen;
    video.requestFullscreen && video.requestFullscreen();
  };
  const keyControl = K => {
    const video = videoRef.current;
    if (K.code == 'ArrowRight') {
      forward(video);
    } else if (K.code == 'ArrowLeft') {
      replay(video);
    }
  };
  useEffect(() => {
    const video = videoRef.current;
    if (!(video.src || source)) {
      const id = match.params.id;
      const HlsURL = `/video/${id}/video.m3u8`;
      const normalURL = `/video/${id}/video`;
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(HlsURL);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          play && video.play();
        });
      } else {
        setSource({ src: normalURL });
      }
    }
    play ? video.play() : video.pause();
    video.volume = volume ? 1 : 0;
    document.addEventListener('keydown', keyControl);
    document.addEventListener('keypress', togglePlay);
    return () => {
      document.removeEventListener('keydown', keyControl);
      document.removeEventListener('keypress', togglePlay);
    };
  }, [play, volume]);
  return (
    <div className='w-full h-64 sm:h-left  relative bg-black'>
      <video
        ref={videoRef}
        controls={false}
        className='w-full h-full'
        onTimeUpdate={animateBar}
        onPlaying={() => setStall(false)}
        onWaiting={() => setStall(true)}
        onStalled={() => setStall(true)}>
        {source && <source src={source.src}></source>}
      </video>
      <div
        className=' absolute text-6xl text-white  top-0 left-0 right-0 bottom-0 w-12 h-32 '
        style={{ margin: 'auto' }}>
        <span className='cursor-pointer'>
          {!play && !stall ? (
            <PlayIconFilled onClick={togglePlay} fontSize='inherit' />
          ) : (
            ''
          )}
          {stall ? <CircularProgress color='inherit' /> : ''}
        </span>
      </div>
      <div className='absolute bottom-0 w-full '>
        <div className='px-1 bottom-0 w-full flex justify-between text-base '>
          <div className='flex'>
            <Fab
              onClick={togglePlay}
              icon={play ? <PauseIcon /> : <PlayIcon />}
            />
          </div>
          <div className='flex'>
            <Fab
              onClick={toggleVolume}
              icon={volume ? <VolumeOn /> : <VolumeOff />}
            />
            <Fab onClick={zoomVideo} icon={<FullscreenIcon />} />
          </div>
        </div>
        <div className='sm:m-3  relative '>
          <p
            className='h-1 relative z-1 w-full bg-transparent-white sm:rounded-lg cursor-pointer'
            onClick={event => {
              const {
                offsetX,
                target: { offsetWidth },
              } = event.nativeEvent;
              const video = videoRef.current;
              const time = (offsetX / offsetWidth) * video.duration;
              video.currentTime = time;
            }}></p>
          <p
            className='ease-linear transition-all h-1   absolute  cursor-pointer top-0 bg-white sm:rounded-lg bar-circle '
            style={{ width: `${current * 100}%` }}></p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
