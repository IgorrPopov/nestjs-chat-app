import io from 'socket.io-client';
import { SOCKET_URL } from '../config/config';

const socket = _id =>
  io(SOCKET_URL, {
    query: { _id },
  });

export default socket;
