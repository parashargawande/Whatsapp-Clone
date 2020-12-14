import './App.css';
import TopLeftBar from './Components/TopLeftBar/TopLeftBar';
import { initializeIcons } from '@uifabric/icons';
import Chatlist from './Components/Chatlist/Chatlist';
import TopRightBar from './Components/TopRightBar/TopRightBar';
import GroupMessages from './Components/GroupMessages/GroupMessages';
import { useEffect, useState } from 'react';
import firebase from './Firebase';
import { Menu } from './Components/Menu/Menu';
import { Authentication } from './Components/Authentication/Authentication';
import Loader from './Components/Loader/Loader';
import LeftSlider from './Components/LeftSlider/LeftSlider';
import UserDetails from './Components/UserDetails/UserDetails';

function App() {

  initializeIcons();
  const [user, setUser] = useState(null);
  const [openedChat, setOpenedChat] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showLeftSlider, setShowLeftSlider] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [leftSliderContent, setLeftSliderContent] = useState(null);
  const [userDetails,setUserDetails] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log(user);
        setUser(user);
        const snapshot = firebase.firestore().collection('users').doc(user.uid).get();
        snapshot.then((raw) => {
          let userData= raw.data();
          setUserDetails({...user,name:userData.name});
          setShowLoader(false);
        }).catch(err => {
          console.log(err.message);
          setShowLoader(false);
        });

      } else {
        setUser(null);
        setShowLoader(false);
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
    if (showLeftSlider) {
      setShowLeftSlider(false);
    }
  }
  const setMenu = (menu) => {
    if (menu === "New-Group" && !showLeftSlider) {
      let newGroupContent = <div>new group add</div>
      setLeftSliderContent(newGroupContent);
      setShowLeftSlider(true);
    }
    else if (menu === "Logout" && !showLeftSlider) {
      logoutUser();
    }
  }
  const showUserProfile = () => {
    let userContent = <UserDetails user={userDetails} />
    setLeftSliderContent(userContent);
    setShowLeftSlider(true);
  }

  let body = <>
    <div className="Left-Container">
      <TopLeftBar showUserProfile={showUserProfile} user={userDetails} showMenu={showMenu} setShowMenu={setShowMenu} />

      <Chatlist user={userDetails} setOpenedChat={setOpenedChat} />

      <Menu setMenu={setMenu} show={showMenu} />
    </div>

    <LeftSlider show={showLeftSlider} innerComponent={leftSliderContent} />

    {openedChat ?
      <div className="Right-Container">

        <TopRightBar user={userDetails} openedChat={openedChat} />

        <GroupMessages user={userDetails} openedChat={openedChat} />

      </div> :
      <div className="Right-Container">
      </div>
    }
  </>

  console.log('[App.js] rendered');

  return <div className="App">
    <div onClick={() => closeAllMenu()} className="Container">
      {showLoader ? <Loader label='loading...' />
        : user === null ?
          <Authentication setUser={setUser} /> :
          body}
    </div>
  </div>
}

export default App;
