import './App.css';
import TopLeftBar from './Components/TopLeftBar/TopLeftBar';
import { initializeIcons } from '@uifabric/icons';
import Chatlist from './Components/Chatlist/Chatlist';
import TopRightBar from './Components/TopRightBar/TopRightBar';
import GroupMessages from './Components/GroupMessages/GroupMessages';
import SendMessage from './Components/GroupMessages/SendMessage/SendMessage';
import { useEffect, useState } from 'react';
import firebase from './Firebase';
import { Menu } from './Components/Menu/Menu';
import { NewGroupSlider } from './Components/NewGroupSlider/NewGroupSlider';
import { Authentication } from './Components/Authentication/Authentication';

function App() {

  initializeIcons();

  const [user, setUser] = useState(null);
  const [openedChat, setOpenedChat] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [newGroupSlider, setNewGroupSlider] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, [user]);

  const logoutUser = () => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      console.log('user signout');
      setUser(null);
    }).catch(function (error) {
      // An error happened.
      setUser(null);
      console.log(error.message);
    });
  }

  const closeAllMenu = () => {
    if (showMenu) {
      setShowMenu(false);
    }
    if (newGroupSlider) {
      setNewGroupSlider(false);
    }
  }
  const setMenu = (menu) => {
    if (menu === "New-Group" && !newGroupSlider) {
      setNewGroupSlider(true);
    }
    else if (menu === "Logout" && !newGroupSlider) {
      logoutUser();
    }
  }

  let body = <>
    <div className="Left-Container">
      <TopLeftBar user={user} showMenu={showMenu} setShowMenu={setShowMenu} />
      
      <Chatlist setOpenedChat={setOpenedChat} />
   
      <Menu setMenu={setMenu} show={showMenu} /> 
    </div>

    <NewGroupSlider show={newGroupSlider} />
    {openedChat ?
      <div className="Right-Container">
        <TopRightBar user={user} openedChat={openedChat} />
        <GroupMessages user={user} openedChat={openedChat} />
        
      </div> :
      <div className="Right-Container">
      </div>
    }
  </>

  console.log('[App.js] rendered');

  return <div className="App">
    <div onClick={() => closeAllMenu()} className="Container">
      {user === null ?
        <Authentication setUser={setUser} /> :
        body
      }
    </div>
  </div>
}

export default App;
