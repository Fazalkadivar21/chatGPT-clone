import { useEffect } from 'react';
import Chatbox from './Chatbox';
import Sidebar from './Sidebar';
import { socket } from '../socket';

export default function Home() {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <Chatbox />
    </div>
  );
}
