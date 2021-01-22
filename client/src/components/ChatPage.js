import React, { useEffect, useLayoutEffect, useState } from 'react';
import socketInit from '../servise/socket';

const ChatPage = props => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [user] = useState(props?.location?.state?.user || null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      props.history.push('/login');
    } else {
      setSocket(socketInit());
    }
  }, []);

  useEffect(() => {
    if (socket && socket._callbacks['$events'] === undefined) {
      socket.on('events', text => {
        console.log(text);
        setMessages(prevMsg => {
          return [...prevMsg, text];
        });

        const $chatBox = document.getElementsByClassName('chat-box');

        if ($chatBox !== undefined && $chatBox.length > 0) {
          $chatBox[0].scrollTop = $chatBox[0].scrollHeight;
        }
      });
    }
  }, [socket]);

  const handleFormSubmit = e => {
    console.log('handleFormSubmit');
    e.preventDefault();

    if (socket) {
      socket.emit('events', text);
    }

    setText('');
  };

  const handleTextInputChange = e => {
    const value = e.target.value;
    setText(value);
  };

  return (
    <div className='container'>
      <div className='chat-wrapper'>
        <div className='chat-box'>
          {messages.map((msg, index) => {
            return (
              <div className='message' key={index}>
                {msg}
              </div>
            );
          })}
        </div>
        <div className='chat-input'>
          <form onSubmit={handleFormSubmit} className='chat-form'>
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
