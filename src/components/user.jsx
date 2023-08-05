// User.js (shared component)
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { baseUrl } from '../constant/url';

const socket = io(baseUrl);

function User({ name }) {
  const [user, setUser] = useState({
    name: name,
    hp: 100,
    ap: 10,
  });

  const handleAttack = () => {
    socket.emit('attack', user.ap);
  };

  useEffect(() => {
    socket.on('attackResult', (ap) => {
      console.log(ap);
      setUser((prevUser) => ({ ...prevUser, hp: prevUser.hp - ap }));
    });
  }, []);

  return (
    <div>
      <h2>{user.name}</h2>
      <p>HP: {user.hp}</p>
      <button onClick={handleAttack}>Attack</button>
    </div>
  );
}

export default User;
