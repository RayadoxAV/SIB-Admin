import { io } from 'socket.io-client';
import { SERVER_IP } from '../util/util';

export const socket = io(SERVER_IP);
