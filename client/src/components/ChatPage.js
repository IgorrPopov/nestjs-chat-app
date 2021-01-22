import React, { useEffect, useLayoutEffect, useState } from 'react';
import socketInit from '../servise/socket';
import Message from './Message';
import User from './User';

const ChatPage = props => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [user] = useState(props?.location?.state?.user || null);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      props.history.push('/login');
    } else {
      console.log({ user });
      setSocket(socketInit(user._id));
    }
  }, []);

  useEffect(() => {
    if (socket && socket._callbacks['$events'] === undefined) {
      socket.on('events', data => {
        setMessages(prevMsg => {
          return [...prevMsg, { ...data.message }];
        });

        // scroll to the bottom of the chat box
        const $chatBoxMsg = document.getElementsByClassName(
          'chat-box__messages'
        );

        if ($chatBoxMsg !== undefined && $chatBoxMsg.length > 0) {
          $chatBoxMsg[0].scrollTop = $chatBoxMsg[0].scrollHeight;
        }
      });

      // load old messages
      socket.emit('loadMessages', data => {
        setMessages([...messages, ...data.messages]);
      });

      // load load connected users
      socket.emit('loadUsers');

      socket.on('loadUsers', data => {
        data.users = data.users.filter(item => item._id !== user._id);
        setUsers([...data.users]);
      });
    }
  }, [socket]);

  const handleFormSubmit = e => {
    console.log('handleFormSubmit');
    e.preventDefault();

    if (socket) {
      socket.emit('events', { text, owner: user._id });
    }

    setText('');
  };

  const handleTextInputChange = e => {
    const value = e.target.value;
    setText(value);
  };

  const handleClickOnUser = user => {
    console.log({ user });
  };

  return (
    <div className='container'>
      <div>
        <div className='chat-box'>
          <div className='chat-box__messages'>
            {messages.map(message => {
              return <Message _id={user._id} message={message} />;
            })}
          </div>
          <div className='chat-box__users'>
            {users.map(user => {
              return <User user={user} handleClickOnUser={handleClickOnUser} />;
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
    </div>
  );
};

export default ChatPage;
