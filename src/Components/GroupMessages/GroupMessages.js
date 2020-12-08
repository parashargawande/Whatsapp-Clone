import React, { useEffect, useState } from 'react';
import './GroupMessages.css';
import firebase from '../../Firebase';
import SendMessage from './SendMessage/SendMessage';

const GroupMessages = (props) => {

    const [senderChats, setsenderChats] = useState([]);
    const [receiversChats, setreceiversChats] = useState([]);
    const [newMessage,setNewMessage] = useState(false);

    const query = firebase.firestore().collection('users').doc(props.user.uid).collection('To');

    useEffect(() => {
        const observer = query.onSnapshot(querySnapshot => {
            console.log(querySnapshot);
            console.log(`Received query snapshot of size ${querySnapshot.size}`);
            let myDataArray = []
            querySnapshot.forEach(doc =>
                myDataArray.push({ ...doc.data() })
            );
            console.log(myDataArray);
            setNewMessage(!newMessage);
        }, err => {
            console.log(`Encountered error: ${err}`);
        });
        return ()=>observer();
    }, []);


    useEffect(() => {
        console.log('[GroupMessages.js] useEffect hook');

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

        const receiversSnapshot = firebase.firestore().collection('users').doc(props.openedChat.id).collection('To').doc(props.user.uid).get();
        receiversSnapshot.then((snap) => {
            let chats = snap.data();
            if (chats) {
                console.log(chats);
                setreceiversChats(chats.messages);
            } else {
                setreceiversChats([]);
            }
        }).catch((e) => {
            console.log(e.message);
            setreceiversChats([]);
        });
    }, [props.openedChat,newMessage]);

    const db = firebase.firestore();

    const updateReceiverChats = (updatedReceiversChats) => {

        const postMsg = db.collection('users').doc(props.openedChat.id).collection('To').doc(props.user.uid).set({ messages: updatedReceiversChats });
        return postMsg;
        postMsg.then(data => {
            setreceiversChats(updatedReceiversChats);
        }).catch(e => {
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

            let updatedReceiversChats = [...receiversChats, {
                message: message,
                dateTime: (new Date()).toISOString(),
                sent: false,
                received: true,
                isSender: false
            }];


            updateSendersChats(updatedSendersChats).then(data => {
                setsenderChats(updatedSendersChats);
                return true;
            }).then(senderSucess => {
                if (senderSucess) {
                    updateReceiverChats(updatedReceiversChats);
                    return true;
                } else {
                    return false;
                }
            }).then(receiverSucess => {
                if (receiverSucess) {
                    setreceiversChats(updatedReceiversChats);
                }
            }).catch(e => {
                console.log(e.message);
            });

            // let senderData = {
            //     message: message,
            //     dateTime: (new Date()).toISOString(),
            //     sent: true,
            //     received: false,
            //     isSender: true
            // }
            // let receiverData = {
            //     message: message,
            //     dateTime: (new Date()).toISOString(),
            //     sent: false,
            //     received: true,
            //     isSender: false
            // }
            // console.log(props.user);
            // console.log(props.openedChat);
            // console.log(senderData);
            return true;
        }
    }

    return <div className='GroupMessages-container'>
        {/* <>
            <div className='Group-message incoming'>
                created by 5454545asdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
            <div className='Group-message-time'>5.00PM</div>
            </div>
            <div className='Group-message outgoing'>
                c
            <div className='Group-message-time'>5.00PM</div>
            </div>
        </> */}
        {

            senderChats.map(chat => {
                if (chat.isSender === true) {
                    return <div key={chat.dateTime} className='Group-message outgoing'>
                        {chat.message}
                        <div className='Group-message-time'>{new Date(chat.dateTime).toLocaleString('en-US', { hour: 'numeric',minute: 'numeric', hour12: true })}</div>
                    </div>
                } else {
                    return <div key={chat.dateTime} className='Group-message incoming'>
                        {chat.message}
                        <div className='Group-message-time'>{new Date(chat.dateTime).toLocaleString('en-US', { hour: 'numeric',minute: 'numeric', hour12: true })}</div>
                    </div>
                }
            })
        }


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