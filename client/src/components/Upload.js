import React, { useRef } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from './Button';
import { connect } from 'react-redux';
import { uploadVideo } from '../actions/appActions';

const UploadForm = ({ uploadVideo, upload }) => {
  const ref = useRef();
  return (
    <>
      {upload && <CircularProgress size={30} />}
      <input
        onChange={() => {
          const file = ref.current.files[0];
          uploadVideo(file);
        }}
        ref={ref}
        accept='video/mp4,video/x-m4v,video/*'
        type='file'
        className='hidden'
        style={{ position: 'absolute', top: '-10000px' }}
      />
      <Button
        color='indigo'
        Prop={{
          onClick: () => !upload && ref.current && ref.current.click(),
          disabled: upload,
        }}
        classes={`${upload && 'cursor-not-allowed opacity-50'} ml-4`}
        children='Upload a video'
      />
    </>
  );
};
const mapStateToProp = ({ app }) => ({ upload: app.upload });
export default connect(mapStateToProp, { uploadVideo })(UploadForm);

