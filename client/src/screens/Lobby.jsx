import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import "./Lobby.scss";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
function Lobby() {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);

    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="Lobby">
      <h1>Lobby</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={handleSubmit}>Join</button>
      </form>
    </div>
  );
}

export default Lobby;
