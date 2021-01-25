import React, { useState } from 'react';

const VideoChatPage = props => {
  console.log({ props });
  const [user] = useState(props?.location?.state?.user || null);
  const [userToCall] = useState(props?.location?.state?.userToCall || null);
  const [video_chat_room_id] = useState(
    props?.location?.state?.video_chat_room_id || null
  );
  const [socket] = useState(props?.location?.state?.socket || null);

  //   console.log({ user });
  //   console.log({ userToCall });
  //   console.log({ video_chat_room_id });
  //   console.log({ socket });

  return (
    <div className='container'>
      <h1>Video Chat Page</h1>
    </div>
  );
};

export default VideoChatPage;
