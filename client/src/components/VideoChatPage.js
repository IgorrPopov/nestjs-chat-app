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
    if (state && myPeer) {
      myPeer.on('open', peer_id => {
        const socket = state.socket;

        socket.emit('join-video-chat-room', {
          room_id: state.room_id,
          user: { _id: state.user._id, socket_id: state.user.socket_id },
          partner: {
            _id: state.userToCall._id,
            socket_id: state.userToCall.socket_id,
          },
        });
      });
    }
  }, [state, myPeer]);

  return (
    <div className='container'>
      <h1>Video Chat Page</h1>
    </div>
  );
};

export default VideoChatPage;
