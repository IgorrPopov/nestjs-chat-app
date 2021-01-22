import React from 'react';

const Message = ({ _id, message }) => {
  const classNameForMessage =
    _id !== message.owner._id ? 'message' : 'message message--right';

  const time = message.createdAt
    .split(/[T|\.]/g)
    .map((elm, index) => {
      if (index === 0) return elm.replaceAll('-', '.');
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
