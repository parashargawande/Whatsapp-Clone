import logo from './logo.svg';
import './App.css';
import TopLeftBar from './Components/TopLeftBar/TopLeftBar';
import { initializeIcons } from '@uifabric/icons';
import Searchchat from './Components/Searchchat/Searchchat';
import Chatlist from './Components/Chatlist/Chatlist';
import TopRightBar from './Components/TopRightBar/TopRightBar';
import GroupMessages from './Components/GroupMessages/GroupMessages';
import SendMessage from './Components/SendMessage/SendMessage';

function App() {
  initializeIcons();
  return (
    <div className="App">
      <div className="Container">
        <div className="Left-Container">
          <TopLeftBar />
          <Searchchat />
          <Chatlist />
        </div>
        <div className="Right-Container">
          <TopRightBar />
          <GroupMessages />
          <SendMessage />
        </div>
      </div>
    </div>
  );
}

export default App;
