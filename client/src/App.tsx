import { Outlet } from 'react-router-dom';
import './index.css';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
}

export default App;