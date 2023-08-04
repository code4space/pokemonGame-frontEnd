import React, { useEffect, useState } from 'react';
import { baseUrl } from '../constant/url';
import io from 'socket.io-client';
import User from '../components/user';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../store/actions/fetchUser';
import LoadingScreen from '../components/loading';

const socket = io(baseUrl);

function PagePvP() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFind, setIsFind] = useState(false)
  const [message, setMessage] = useState([])
  const [input, setInput] = useState('')

  const dispatch = useDispatch()
  const username = useSelector((state) => {
    return state.UserReducer.username
  })

  useEffect(() => {
    async function fetchData() {
      try {
        await dispatch(getUserInfo());
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [dispatch])

  const handleNewMessage = ({ username, message }) => {
    setMessage(prevMessages => [...prevMessages, `${username} ${message}`]);
  };

  const handleRoomFull = ({ room, number }) => {
    number += 1
    socket.emit('joinRoom', { room, number, username })
  }

  const handleRoomCreated = (newRoom) => {
    socket.emit('joinRoom', { room: newRoom, number: 1, username });
  };

  useEffect(() => {
    socket.on('message', handleNewMessage);
    socket.on('roomFull', handleRoomFull);
    socket.on('roomCreated', handleRoomCreated);

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('roomFull', handleRoomFull);
      socket.off('roomCreated', handleRoomCreated);
    };
  }, []);


  const sendMessage = () => {
    console.log(username)
    const data = { username, message: input, room: 'room1' }; // Replace 'room1' with the actual room ID
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
