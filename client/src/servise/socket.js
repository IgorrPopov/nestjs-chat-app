import io from 'socket.io-client';
import { SOCKET_URL } from '../config/config';

const socketConnection = {
  socket: null,

  getConnection(access_token) {
    if (!this.socket) {
      // this.socket = io(SOCKET_URL, {
      this.socket = io('/', {
        query: { access_token },
      });
    }

    return this.socket;
  },
};

export default socketConnection;
