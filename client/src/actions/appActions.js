import { SET_VIDEOS, SET_UPLOAD } from './types';
import { setErr} from './msgActions';
import Axios from 'axios';
export const uploadVideo = file => (dispatch, getState) => {
  const formData = new FormData();
  const {
    app: { videos },
  } = getState();
  formData.append('file', file);
  dispatch(setUpload(true));
  Axios.post('/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(({ data: video }) => {
      dispatch(setVideos([...videos, video]));
    })
    .catch(({ response = {} }) => {
      dispatch(setUpload(false));
      const status = response.status;
      if (status === 500) setErr('Unknown error occured');
    });
};

export const fetchVideos = () => dispatch => {
  Axios.get('/video/all')
    .then(({ data: videos }) => {
      dispatch(setVideos(videos));
    })
    .catch(({ response = {} }) => {
      const status = response.status;
      if (status === 500) setErr('Unknown error occured');
    });
};

const setVideos = videos => ({ type: SET_VIDEOS, payload: videos });

const setUpload = percent => ({ type: SET_UPLOAD, payload: percent });
