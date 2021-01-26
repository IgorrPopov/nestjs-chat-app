import React, { useContext, useEffect, useState } from 'react';
import Peer from 'peerjs';
import { StateContext } from './context/StateContext';

const VideoChatPage = props => {
  const { state } = useContext(StateContext);
  const [myPeer] = useState(
    new Peer(undefined, {
      host: '/',
      port: '9000',
    })
  );

  useEffect(() => {
    console.log(window.navigator);

    return;

    if (!state || !myPeer) return;

    props.navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(myStream => {
        // add my video and audio to my page
        const myVideo = document.createElement('video');
        addVideoStream(myVideo, myStream);

        const socket = state.socket;

        // this user wanna make a video call to the partner
        if (state.userToCall && !state.partner) {
          // connection to the peer server
          myPeer.on('open', peer_id => {
            socket.emit('join-video-chat-room', {
              room_id: state.room_id,
              user: {
                _id: state.user._id,
                socket_id: state.user.socket_id,
                peer_id,
              },
              partner: {
                _id: state.userToCall._id,
                socket_id: state.userToCall.socket_id,
              },
            });

            myPeer.on('call', otherUserCall => {
              otherUserCall.answer(myStream);
              const otherUserVideo = document.createElement('video');
              otherUserCall.on('stream', otherUserStream => {
                addVideoStream(otherUserVideo, otherUserStream);
              });
            });
          });
        }

        // this user is answering the video call from a partner
        if (state.partner && !state.userToCall) {
          // connecting to the peer server
          myPeer.on('open', peer_id => {
            const call = myPeer.call(state.partner.peer_id, myStream);

            call.on('stream', otherUserStream => {
              const otherUserVideo = document.createElement('video');
              addVideoStream(otherUserVideo, otherUserStream);
            });
          });
        }
      });
  }, [state, myPeer]);

  const addVideoStream = (video, stream) => {
    const $videoGrid = document.getElementById('video-grid');
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    $videoGrid.append(video);
  };

  return (
    <div className='container'>
      <h1>Video Chat Page</h1>
      <div id='video-grid'></div>
    </div>
  );
};

export default VideoChatPage;
