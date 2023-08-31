import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate, Outlet } from "react-router-dom";
import { baseUrl } from "../constant/url";
import LoadingScreen from "../components/loading";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const PvPWrapper = () => {
    const [socket, setSocket] = useState(null);
    const [isFind, setIsFind] = useState(true);
    const [roomInfo, setRoomInfo] = useState(null)
    const [opponent, setOpponent] = useState({
        username: '',
        deck: [],
        ready: false
    })

    const navigate = useNavigate();
    const username = useSelector((state) => state.UserReducer.username)

    useEffect(() => {
        const newSocket = io.connect(baseUrl);
        setSocket(newSocket);

        newSocket.emit('joinRoom');

        newSocket.on('roomInfo', ({ roomName, users, disconnect, username: opponentName }) => {
            if (users === 2) {
                newSocket.emit('opponent-name', { room: roomName, username })
                setIsFind(false)
            }
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

        newSocket.on('opponent-name', ({ opponentName }) => {
            if (username !== opponentName) setOpponent(prevData => ({ ...prevData, username: opponentName }))
        })

        newSocket.on("disconnect", () => {
            navigate("/");
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    if (isFind) return <LoadingScreen find={isFind} />
    return <Outlet context={{ socket, opponent: [opponent, setOpponent], roomInfo}} />
};

export default PvPWrapper;
