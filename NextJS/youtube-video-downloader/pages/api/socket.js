// pages/api/socket.js
import SocketHandler from '../../socket';

export default function handler(req, res) {
  SocketHandler(req, res);
}
