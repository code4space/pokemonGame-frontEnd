import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate, Outlet } from "react-router-dom";
import { baseUrl } from "../constant/url";
import LoadingScreen from "../components/loading";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { emptyingTheDeck } from "../store/actions/setGameSettings";

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
    const dispatch = useDispatch()

    useEffect(() => {
        const newSocket = io.connect(baseUrl);
        setSocket(newSocket);
        dispatch(emptyingTheDeck())

        function socketRoomInfo({ roomName, disconnect, name }) {
            if (name) {
                const opponentName = name.find(el => el !== username)
                setOpponent({ ...opponent, username: opponentName })
                if (!opponentName) {
                    newSocket.disconnect();
                    navigate('/')
                    Swal.fire({
                        position: "middle",
                        icon: "error",
                        title: "Unexpected Error",
                        text: 'User may be using the same account or refreshing the page while in-game',
                        showConfirmButton: true,
                        timer: 3000,
                    });
                }
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
        }

        newSocket.emit('joinRoom', { name: username });
        newSocket.on('roomInfo', socketRoomInfo);

        newSocket.on("disconnect", () => {
            navigate("/");
        });

        return () => {
            newSocket.disconnect();
            newSocket.off('roomInfo', roomInfo);
        };
    }, []);

    if (isFind) return <LoadingScreen find={isFind} />
    return <Outlet context={{ socket, opponent: [opponent, setOpponent], roomInfo, username }} />
};

export default PvPWrapper;
