import { useEffect,useState } from 'react';
import Chatbox from './Chatbox';
import Sidebar from './Sidebar';
import { socket } from '../socket';
import Header from './Header';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`fixed top-0 left-0 z-20 h-full bg-white shadow-md transform transition-transform duration-300
          w-3/4 sm:relative sm:translate-x-0 sm:w-1/4
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar />
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-10 sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <div className="flex-1 sm:ml-0">
        <Chatbox />
      </div>
    </div>
  );
}
