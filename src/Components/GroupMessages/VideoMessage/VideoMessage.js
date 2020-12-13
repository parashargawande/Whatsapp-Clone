import React, { useRef, useState, useEffect } from 'react';
import { useRecordWebcam } from 'react-record-webcam'
import RecordRTC from 'recordrtc';
import firebase from '../../../Firebase';
import { Spinner, SpinnerSize, ProgressIndicator } from 'office-ui-fabric-react';
import './VideoMessage.css';

const VideoMessage = (props) => {
    const recordWebcam = useRecordWebcam();
    const videoRef = useRef(null);
    const [rtcStream, setRtcStream] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [recordingStatus, setRecordingStatus] = useState('');
    const [previewSrc, setPreviewSrc] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (props.recording) {
            streamCamVideo();
        } else {
            stopVideo().then(sucess=>{
                console.log('recording stoped');
            });
        }
    }, [props.recording]);

    const getFileBlob = (url, cb) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function () {
            cb(xhr.response);
        });
        xhr.send();
    };

    const sendVideo = (media) => {
        if (media) {
            setShowSpinner(true);
            let messageTime = (new Date()).toISOString();
            let userStorageRef = firebase.storage().ref(props.user.uid + '/messages/' + messageTime);
            getFileBlob(media, blob => {
                let task = userStorageRef.put(blob);
                task.on('state_changed',
                    function progress(snapshot) {
                        let percentage = (snapshot.bytesTransfered / snapshot.totalBytes);
                        console.log(snapshot);
                        setUploadProgress(snapshot.bytesTransferred / snapshot.totalBytes);
                    },
                    function error(err) {
                        console.log(err.message);
                    },
                    function complete() {
                        setShowSpinner(null);
                        firebase.storage().ref().child(props.user.uid + '/messages/' + messageTime).getDownloadURL().then(url=>{
                            console.log(url);
                            props.sendMessage('',url,false);
                            setRecordingStatus('');
                        });
                    }
                );
            });
        }
    }


    const stopVideo = () => {
        let resolvePromise = new Promise((resolve,reject)=>{
            if (rtcStream) {
                rtcStream.stopRecording(() => {
                    // rtcStream.save();
                    videoRef.current.src = videoRef.current.srcObject = null;
                    videoRef.current.muted = false;
                    videoRef.current.volume = 1;
                    videoRef.current.src = URL.createObjectURL(rtcStream.getBlob()); //rtcStream.toURL();
                    setPreviewSrc(URL.createObjectURL(rtcStream.getBlob()));
                    rtcStream.destroy();
                    setRtcStream(null);
                    setRecordingStatus('previewing');
                    resolve('recording stoped');
                });
            }else{
                resolve('recording stoped');
            }
            if (mediaStream) {
                const stream = mediaStream;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        });
        return resolvePromise;
    }

    const streamCamVideo = () => {
        
        setShowSpinner(false);
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

        let constraints = { audio: false, video: { width: 1280, height: 720 } };
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function (mediaStream) {
                setMediaStream(mediaStream);

                let localRtcStream = RecordRTC(mediaStream, { type: 'video' });
                localRtcStream.startRecording();
                setRtcStream(localRtcStream);

                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = function (e) {
                    videoRef.current.play();
                };
                setRecordingStatus('recording');
                props.showHiddenMessage();
                //recordVideo();
            })
            .catch(function (err) {
                console.log(err.name + ": " + err.message);
            }); // always check for errors at the end.
    }

    return (
        <div>
            <div className='Group-message outgoing' hidden={recordingStatus !== '' ? false : true}>
                <div className="Video-message-container">
                    {showSpinner === true ?
                        <Spinner size={SpinnerSize.large} className='Video-message-spinner' /> : ''}
                    <video muted={true} className='Video-message-camera' autoPlay={true} ref={videoRef} ></video>
                </div>
                <br />
                {/* <button onClick={streamCamVideo}>Start streaming</button>
                <button onClick={stopVideo}>stop streaming</button> */}
                {showSpinner == false ?
                    <button onClick={() => { stopVideo().then(sucess=>{sendVideo(previewSrc)})} }>Send Message</button> : ''
                }
                {
                    showSpinner ?
                        <ProgressIndicator percentComplete={uploadProgress} /> : ''
                }
            </div>
            {/* <p>Camera status: {recordWebcam.status}</p>
            <button onClick={recordWebcam.start}>Start recording</button>
            <button onClick={recordWebcam.stop}>Stop recording</button>
            <button onClick={recordWebcam.retake}>Retake recording</button>
            <button onClick={recordWebcam.download}>Download recording</button>
            <video ref={recordWebcam.webcamRef} autoPlay muted />
            <video ref={recordWebcam.previewRef} autoPlay muted loop /> */}
        </div>
    )
}
export default VideoMessage;