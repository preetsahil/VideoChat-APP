import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
function SocketProvider(props) {
  const socket = useMemo(() => io("https://minorproject-xz2l.onrender.com:8000"), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
