import io from 'socket.io-client';
import { SOCKET_URL } from '../config/config';

const socketConnection = {
  socket: null,

  getConnection(_id) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        query: { _id },
      });
    }

    return this.socket;
  },
};

export default socketConnection;
