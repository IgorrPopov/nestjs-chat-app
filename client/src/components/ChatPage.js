import React, { useEffect, useState } from 'react';
import socket from '../servise/socket';

const ChatPage = props => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log(socket);

    socket.on('msgToClient', text => {
      setMessages(prevMsg => {
        return [...prevMsg, text];
      });
    });
  }, []);

  const handleFormSubmit = e => {
    console.log('handleFormSubmit');
    e.preventDefault();
    socket.emit('msgToServer', text);
    setText('');
  };

  const handleTextInputChange = e => {
    const value = e.target.value;
    setText(value);
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input type='text' value={text} onChange={handleTextInputChange} />
        <button className='btn'>Send</button>
      </form>
      <ul>
        {messages.map((msg, index) => {
          return <li key={index}>{msg}</li>;
        })}
      </ul>
    </div>
  );
};

export default ChatPage;
