import React, { useEffect, useRef, useState } from 'react';
import './GroupMessages.css';
import firebase from '../../Firebase';
import SendMessage from './SendMessage/SendMessage';

const GroupMessages = (props) => {

    const [senderChats, setsenderChats] = useState([]);
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }, [senderChats]);

    useEffect(() => {
        console.log('[GroupMessages.js] setting observer');
        getSendersChats();
        const query = firebase.firestore().collection('users').doc(props.user.uid).collection('To').doc(props.openedChat.id);
        const observer = query.onSnapshot(querySnapshot => {
            console.log(`Received query snapshot of size ${querySnapshot.size}`);
            let chats = querySnapshot.data();
            if (chats) {
                console.log(chats);
                setsenderChats(chats.messages);
            } else {
                setsenderChats([]);
            }
        }, err => {
            console.log(`Encountered error: ${err}`);
        });
        return () => {
            console.log('[GroupMessages.js] cleaning observer');
            observer();
        }
    }, [props.openedChat.id]);

    const getSendersChats = () => {
        const senderSnapshot = firebase.firestore().collection('users').doc(props.user.uid).collection('To').doc(props.openedChat.id).get();
        senderSnapshot.then((snap) => {
            let chats = snap.data();
            if (chats) {
                console.log(chats);
                setsenderChats(chats.messages);
            } else {
                setsenderChats([]);
            }
        }).catch((e) => {
            console.log(e.message);
            setsenderChats([]);
        });
    }

    const db = firebase.firestore();

    const updateReceiverChats = (message) => {

        const receiversSnapshot = firebase.firestore().collection('users').doc(props.openedChat.id).collection('To').doc(props.user.uid).get();
        return receiversSnapshot.then((snap) => {
            let chats = snap.data();

            let updatedReceiversChats = [...chats.messages, {
                message: message,
                dateTime: (new Date()).toISOString(),
                sent: false,
                received: true,
                isSender: false
            }];

            const postMsg = db.collection('users').doc(props.openedChat.id).collection('To').doc(props.user.uid).set({ messages: updatedReceiversChats });
            return postMsg;
        }).catch((e) => {
            console.log(e.message);
        });
    }
    const updateSendersChats = (updatedSendersChats) => {
        const sendMsg = db.collection('users').doc(props.user.uid).collection('To').doc(props.openedChat.id).set({ messages: updatedSendersChats });
        return sendMsg;

        sendMsg.then(data => {
            setsenderChats(updatedSendersChats);
        }).catch(e => {
            console.log(e.message);
        });
    }

    const sendMessage = (message) => {
        if (message) {

            let updatedSendersChats = [...senderChats, {
                message: message,
                dateTime: (new Date()).toISOString(),
                sent: true,
                received: false,
                isSender: true
            }];


            updateSendersChats(updatedSendersChats).then(data => {
                return setsenderChats(updatedSendersChats);
            }).then(senderSucess => {
                return updateReceiverChats(message);
            }).catch(e => {
                console.log(e.message);
            });

            return true;
        }
    }

    return <div className='GroupMessages-container'>
        {

            senderChats.map(chat => {
                if (chat.isSender === true) {
                    return <div key={chat.dateTime} className='Group-message outgoing'>
                        {chat.message}
                        <div className='Group-message-time'>{new Date(chat.dateTime).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                    </div>
                } else {
                    return <div key={chat.dateTime} className='Group-message incoming'>
                        {chat.message}
                        <div className='Group-message-time'>{new Date(chat.dateTime).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                    </div>
                }
            })
        }

        <div ref={messagesEndRef} />
        {/* <div className='Group-info-message'>created by 5454545</div>
        <div className='Group-info-message'>created by 5454545</div>
        <div className='Group-info-message'>created by 5454545</div>
        <div className='Group-message incoming'>
            created by 5454545asdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
            <div className='Group-message-time'>5.00PM</div>
        </div>
        <div className='Group-message incoming'>
            created by 5454545asdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
            <div className='Group-message-time'>5.00PM</div>
        </div><div className='Group-message incoming'>
            created by 5454545asdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
            <div className='Group-message-time'>5.00PM</div>
        </div><div className='Group-message incoming'>
            created by 5454545asdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
            <div className='Group-message-time'>5.00PM</div>
        </div>
        <div className='Group-message outgoing'>
            c
            <div className='Group-message-time'>5.00PM</div>
        </div> */}

        <SendMessage sendMessage={sendMessage} user={props.user} openedChat={props.openedChat} />
    </div >
}
export default GroupMessages;