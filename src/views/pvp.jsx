import React, { useEffect, useState } from 'react';
import { baseUrl } from '../constant/url';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../store/actions/fetchUser';
import LoadingScreen from '../components/loading';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function PagePvP() {
  const [isFind, setIsFind] = useState(true)
  const [message, setMessage] = useState([])
  const [input, setInput] = useState('')
  const [roomInfo, setRoomInfo] = useState(null)
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const username = useSelector((state) => {
    return state.UserReducer.username
  })

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch])

  const handleNewMessage = ({ username, message }) => {
    setMessage(prevMessages => [...prevMessages, `${username} ${message}`]);
  };

  useEffect(() => {
    const newSocket = io.connect(baseUrl);
    setSocket(newSocket)

    newSocket.emit('joinRoom', { username }); // Emit the 'joinRoom' event when connecting

    newSocket.on('roomInfo', ({ roomName, users, disconnect }) => {
      if (users === 2) setIsFind(false)
      if (disconnect) {
        newSocket.disconnect();
        navigate('/')
        Swal.fire({
          position: "middle",
          icon: "error",
          title: "Your oppenent disconnected",
          showConfirmButton: true,
          timer: 3000,
        });
      }
      setRoomInfo(roomName);
    });

    newSocket.on('message', handleNewMessage);

    return () => {
      newSocket.off('message', handleNewMessage);
      newSocket.disconnect();
    };
  }, []);


  const sendMessage = () => {
    const data = { username, message: input, room: roomInfo }; // Replace 'room1' with the actual room ID
    socket.emit('message', data);
    setInput('');
  };

  if (isFind) return <LoadingScreen find={true} />
  else return (
    <div className='lobby'>
      {message.map((el, i) => {
        return <div key={i}>{el}</div>
      })}
      <input type="text" onChange={e => setInput(e.target.value)} value={input} />
      <button onClick={sendMessage}>send</button>
    </div>
  );
}

export default PagePvP;
