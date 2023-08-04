import io from 'socket.io-client';
import { baseUrl } from './url';

const socket = io(baseUrl);

export function joinRoom(username) {
    const room = 'room';
    const number = 1
    socket.emit('joinRoom', { room, number, username });
}