import React, { useRef, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '../Button';
import './video.css'
import { uploadVideo } from '../../actions/appActions';
import { connect } from 'react-redux';
const UploadVideos = ({ uploadVideo, upload }) => {
    const ref = useRef();
    const [modalShow, setModalShow] = useState(false)
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    const [videoInformation, setVideoInformation] = useState("")
    const handleChange = (e) => {
        setVideoInformation(e.target.value)
    }
    return (
        <>
            {upload && <CircularProgress size={30} />}
            <button onClick={() => { setModalShow(true) }}>Upload Video</button>

            {modalShow ? (
                <div className="upload-modal">
                    <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
        flex items-center justify-center">
                        <div className="w-full h-100">
                            <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Upload Video</h1>
                            <form className="mt-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-gray-700">Video Description</label>
                                    <textarea type="text" name="description" placeholder="Write about Video"
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus={true} autoComplete="true" required />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-gray-700">Password</label>
                                    <input type="text" name="pwd" placeholder="Enter Password" minLength={6} className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                focus:bg-white focus:outline-none"/>
                                </div>
                                <input
                                    onChange={() => {
                                        const file = ref.current.files[0];
                                        uploadVideo(file, videoInformation);
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
                            </form>
                            <hr className="my-6 border-gray-300 w-full" />
                            {<button className="w-full mt-5 block bg-blue-600 hover:bg-grap-100 rounded-lg px-4 py-3 border border-gray-300 text-white" onClick={() => setModalShow(false)}>close</button>}
                        </div>
                    </div>
                </div>) : ""}
        </>
    );
};
const mapStateToProp = ({ app }) => ({ upload: app.upload });
export default connect(mapStateToProp, { uploadVideo })(UploadVideos);

