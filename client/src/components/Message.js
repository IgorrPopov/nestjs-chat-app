import React from 'react';

const Message = ({ user_id, message }) => {
  const classNameForMessage =
    user_id !== message.owner._id ? 'message' : 'message message--right';

  const milliseconds = Date.parse(message.createdAt);
  const data = new Date(milliseconds - new Date().getTimezoneOffset() * 60000);

  const time = data
    .toISOString()
    .split(/[T|.]/g)
    .map((elm, index) => {
      // if (index === 0) return elm.replaceAll('-', '.');
      if (index === 1) return elm;
      return '';
    })
    .join(' ')
    .trim();

  return (
    <div className={classNameForMessage} key={message._id}>
      <div className='message__owner'>
        <div>
          <i className='material-icons prefix'>person</i>
        </div>
        <div>{message.owner.name}</div>
      </div>
      <div className='message__text'>{message.text}</div>
      <div className='message__time'>{time}</div>
    </div>
  );
};

export default Message;
