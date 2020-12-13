import React, {  useEffect, useState } from 'react';
import Chat from './Chat';
import './Chatlist.css';
import Searchchat from '../Searchchat/Searchchat';
import firebase from '../../Firebase';

const Chatlist = (props) => {
  
  const [searchText, setSearchText] = useState('');
  const [chats, setChats] = useState([]);

  // { id: 1, title: '1', date: 'mon1/3', lastMessage: 'message', image: null },
  // { id: 2, title: '2', date: 'mon1/3', lastMessage: 'message', image: null },
  // { id: 3, title: '3', date: 'mon1/3', lastMessage: 'message', image: null }

  useEffect(()=>{
    const query = firebase.firestore().collection('users').doc(props.user.uid);
    const observer = query.onSnapshot(querySnapshot => {
        console.log(`Received query snapshot of size ${querySnapshot.size}`);
        let chats = querySnapshot.data();
        if (chats) {
            console.log(chats);
            // setsenderChats(chats.messages);
        } else {
            // setsenderChats([]);
        }
    }, err => {
        console.log(`Encountered error: ${err}`);
    });


    const snapshot = firebase.firestore().collection('users').get();
    snapshot.then((data)=>{
      console.log();
      let users = data.docs.map(doc => {
        let userData= doc.data();
        return {title:userData.name, date: null,lastMessage: null , image: null  , id:doc.id };
      });
      setChats(users);
    });
  },[]);

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
  }

  console.log('[Chatlist.js] rendered');

  return <React.Fragment>
    <Searchchat onSearchChange={onSearchChange} />
    <div className="Chatlist-Container">
      {chats.map(chat => {
        if(chat.title.includes(searchText)){
          return <Chat key={chat.id} setOpenedChat={props.setOpenedChat} {...chat} />
        }
      })}
      {/* <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat /> */}
    </div>
  </React.Fragment>
}
export default Chatlist;