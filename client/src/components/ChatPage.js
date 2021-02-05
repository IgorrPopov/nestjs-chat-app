import React, { useEffect, useContext, useState } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import { v4 as uuidV4 } from 'uuid';
import socketConnection from '../servise/socket';
import { StateContext } from './context/StateContext';
import Message from './Message';
import User from './User';

const ChatPage = props => {
  const { setState } = useContext(StateContext);

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [user] = useState(props?.location?.state?.user || null);
  const [users, setUsers] = useState([]);
  const [userToCall, setUserToCall] = useState(null);
  const [userWhoIsCalling, setUserWhoIsCalling] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      props.history.push('/login');
    } else {
      setSocket(socketConnection.getConnection(user.access_token));
    }
  }, []);

  useEffect(() => {
    if (socket && socket._callbacks['$events'] === undefined) {
      socket.on('events', data => {
        setMessages(prevMsg => {
          return [...prevMsg, { ...data.message }];
        });

        scrollToBottom();
      });

      // load old messages
      socket.emit('loadMessages', { access_token: user.access_token }, data => {
        console.log('loadMessages');
        setMessages([...messages, ...data.messages]);
      });

      socket.on('exception', data => {
        alert(data?.message);
      });

      // load connected users
      socket.emit('loadUsers', { access_token: user.access_token });

      socket.on('loadUsers', data => {
        const uniqueOtherUsers = data.users.reduce((accum, curr) => {
          if (
            curr._id !== user._id &&
            !accum.find(user => user._id === curr._id)
          ) {
            accum.push(curr);
          }

          return accum;
        }, []);

        setUsers([...uniqueOtherUsers]);
      });

      socket.on('video-chat-invitation', ({ room_id, user: partner }) => {
        partner.room_id = room_id;
        setUserWhoIsCalling(partner);
      });
    }
  }, [socket]);

  useEffect(() => {
    const elems = document.querySelectorAll('#video_call');
    const instances = M.Modal.init(elems, {});
  }, []);

  useEffect(() => {
    if (userWhoIsCalling) {
      const elems = document.querySelector('#video_call_answer');
      const instance = M.Modal.init(elems, {});
      instance.open();
    }
  }, [userWhoIsCalling]);

  const handleFormSubmit = e => {
    e.preventDefault();

    if (socket) {
      socket.emit('events', {
        text,
        owner: user._id,
        access_token: user.access_token,
      });
    }

    setText('');
  };

  const handleTextInputChange = e => {
    const value = e.target.value;
    setText(value);
  };

  const handleClickOnUser = user => {
    setUserToCall(user);
  };

  const makeVideoCall = () => {
    const room_id = uuidV4();
    setState({ user, userToCall, room_id, socket });
    props.history.push(`/video-chat/${room_id}`);
  };

  const answerVideoCall = () => {
    if (userWhoIsCalling) {
      const { room_id, peer_id, _id } = userWhoIsCalling;
      setState({ user, partner: { _id, peer_id }, room_id, socket });
      props.history.push(`/video-chat/${room_id}`);
    }
  };

  const scrollToBottom = () => {
    const $chatBoxMsg = document.getElementsByClassName('chat-box__messages');
    if ($chatBoxMsg !== undefined && $chatBoxMsg.length > 0) {
      $chatBoxMsg[0].scrollTop = $chatBoxMsg[0].scrollHeight;
    }
  };

  return (
    <div className='container'>
      <div>
        <div className='chat-box'>
          <div className='chat-box__messages'>
            {messages.map(message => {
              return (
                <Message
                  user_id={user._id}
                  message={message}
                  key={message._id}
                />
              );
            })}
          </div>
          <div className='chat-box__users'>
            {users.map(user => {
              return (
                <User
                  user={user}
                  handleClickOnUser={handleClickOnUser}
                  key={user._id}
                />
              );
            })}
          </div>
        </div>
        <div className='chat-box__input'>
          <form onSubmit={handleFormSubmit} className='chat-box__form'>
            <input type='text' value={text} onChange={handleTextInputChange} />
            <button
              className='btn waves-effect waves-light chat-button'
              type='submit'
              name='action'
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* make a video call modal */}
      <div className='modal' id='video_call'>
        <div className='modal-content'>
          <h4>
            Do you want to make a video call to <b>{userToCall?.name}</b>
          </h4>
          <div className='modal-footer'>
            <a
              // href=''
              onClick={makeVideoCall}
              className='modal-close btn green'
            >
              Yes
            </a>{' '}
            <a href='#' className='modal-close btn red'>
              No
            </a>
          </div>
        </div>
      </div>

      {/* answer to video call modal */}
      <div className='modal' id='video_call_answer'>
        <div className='modal-content'>
          <h4>
            User <b>{userWhoIsCalling && userWhoIsCalling.name}</b> is calling
            you via video call
          </h4>
          <div className='modal-footer'>
            <a
              // href='#'
              onClick={answerVideoCall}
              className='modal-close btn green'
            >
              Answer
            </a>{' '}
            <a href='#' className='modal-close btn red'>
              Reject
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
