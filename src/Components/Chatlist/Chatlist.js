import React, { useEffect, useState } from 'react';
import Chat from './Chat';
import './Chatlist.css';
import Searchchat from '../Searchchat/Searchchat';
import firebase from '../../Firebase';
import Loader from '../Loader/Loader';

const Chatlist = (props) => {

  const [searchText, setSearchText] = useState('');
  const [chats, setChats] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setShowLoader(true);
    const snapshot = firebase.firestore().collection('users').get();
    snapshot.then((data) => {
      console.log();
      let users = data.docs.map(doc => {
        let userData = doc.data();
        return { title: userData.name, date: null, lastMessage: null, image: null, id: doc.id };
      });
      setChats(users);
      setShowLoader(false);
    }).catch(err=>{
      console.log(err.message);
      setShowLoader(false);
    });
  }, []);

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
  }

  console.log('[Chatlist.js] rendered');

  return <React.Fragment>
    <Searchchat onSearchChange={onSearchChange} />
    <div className="Chatlist-Container">
      {showLoader ? <Loader label='loading...' /> :
        chats.map(chat => {
          if (chat.title.includes(searchText)) {
            return <Chat key={chat.id} setOpenedChat={props.setOpenedChat} {...chat} />
          }
        })
      }
    </div>
  </React.Fragment>
}
export default Chatlist;