import React, { useEffect, useRef, useState } from 'react';
import './GroupMessages.css';
import firebase from '../../Firebase';
import SendMessage from './SendMessage/SendMessage';
import VideoMessage from './VideoMessage/VideoMessage';
import Loader from '../Loader/Loader';


const GroupMessages = (props) => {
    const [senderChats, setsenderChats] = useState([]);
    const messagesEndRef = useRef(null);
    const [showLoader,setShowLoader] = useState(false);
    const [recordWebcam, setrecordWebcam] = useState(false);

    const [requestedChat, setRequestedChat] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" })
    }

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
                scrollToBottom();
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
        setShowLoader(true);
        const senderSnapshot = firebase.firestore().collection('users').doc(props.user.uid).collection('To').doc(props.openedChat.id).get();
        senderSnapshot.then((snap) => {
            let chats = snap.data();
            if (chats) {
                console.log(chats);
                setsenderChats(chats.messages);
                scrollToBottom();
            } else {
                setsenderChats([]);
            }
            setShowLoader(false);
        }).catch((e) => {
            console.log(e.message);
            setsenderChats([]);
            setShowLoader(false);
        });
    }

    const showHiddenMessage = () => {
        let updatedChats = [...senderChats];
        updatedChats.forEach((chat, index) => {
            if (chat.isSender !== true) {
                if (requestedChat.dateTime === chat.dateTime) {
                    let newChat = { ...chat };
                    newChat.reactionRequest = true;
                    newChat.reactionReceived = true;
                    updatedChats[index] = newChat;
                    setsenderChats(updatedChats);
                    return;
                }
            }
        });
    }


    const recordReaction = (requestedChat) => {

        setrecordWebcam(!recordWebcam);

        setRequestedChat(requestedChat);
    }

    const db = firebase.firestore();

    const updateReceiverChats = (message, media, reactionMessage) => {

        const receiversSnapshot = firebase.firestore().collection('users').doc(props.openedChat.id).collection('To').doc(props.user.uid).get();
        return receiversSnapshot.then((snap) => {
            let chats = snap.data();

            let updatedReceiversChats = [...chats.messages, {
                message: message,
                dateTime: (new Date()).toISOString(),
                sent: false,
                received: true,
                isSender: false,
                reactionRequest: reactionMessage,
                replyTo: requestedChat,
                reactionReceived: false,
                media: media
            }];

            const postMsg = db.collection('users').doc(props.openedChat.id).collection('To').doc(props.user.uid).set({ messages: updatedReceiversChats });
            setRequestedChat(null);
            return postMsg;
        }).catch((e) => {
            console.log(e.message);
        });
    }
    const updateSendersChats = (updatedSendersChats) => {
        const sendMsg = db.collection('users').doc(props.user.uid).collection('To').doc(props.openedChat.id).set({ messages: updatedSendersChats });
        return sendMsg;
    }



    const sendMessage = (message, media = null, reactionMessage) => {
        if (message || media) {
            let messageTime = (new Date()).toISOString();

            let updatedSendersChats = [...senderChats, {
                message: message,
                dateTime: messageTime,
                sent: true,
                received: false,
                isSender: true,
                replyTo: requestedChat,
                reactionRequest: reactionMessage,
                reactionReceived: false,
                media: media
            }];

            console.log(updatedSendersChats);

            updateSendersChats(updatedSendersChats).then(data => {
                return setsenderChats(updatedSendersChats);
            }).then(senderSucess => {
                return updateReceiverChats(message, media, reactionMessage);
            }).catch(e => {
                console.log(e.message);
            });
            return true;
        }
    }

    let messages = showLoader ? <Loader label='loading...' />:
     senderChats.map(chat => {
        if (chat.isSender === true) {
            return <div key={chat.dateTime} className='Group-message outgoing'>
                {chat.replyTo ?
                    <div className='Group-message-replyTo-sender'>
                        {chat.replyTo.message}
                        <div className='Group-message-time'>{new Date(chat.replyTo.dateTime).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                    </div>
                    : ''}
                {chat.message}
                {chat.media ? <video className='Group-message-video' controls src={chat.media}></video> : ''}
                <div className='Group-message-time'>{new Date(chat.dateTime).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
            </div>
        } else {
            return <div key={chat.dateTime} className='Group-message incoming'>
                {
                    chat.reactionRequest ?
                        !chat.reactionReceived ?
                            <div>
                                Reaction Requested <br />
                                <i className='Reaction-message-wrapper' onClick={() => recordReaction(chat)}>
                                    Record
                            </i>
                                <i className='Reaction-message-wrapper' onClick={() => recordReaction(chat)}>
                                    Stop
                            </i>
                            </div>
                            : <>
                                <div>
                                    Reaction Requested <br />
                                    <i className='Reaction-message-wrapper' onClick={() => recordReaction(chat)}>Record</i>
                                    <i className='Reaction-message-wrapper' onClick={() => recordReaction(chat)}>Stop</i>
                                    <br /><hr />
                                </div>
                                {chat.replyTo ? <div className='Group-message-replyTo-receiver'>
                                    {chat.replyTo.message}
                                    <div className='Group-message-time'>{new Date(chat.replyTo.dateTime).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                                </div> : ''}

                                {chat.message}
                                {chat.media ? <video className='Group-message-video' controls src={chat.media}></video> : ''}
                            </>
                        : <>
                            {chat.replyTo ? <div className='Group-message-replyTo-receiver'>
                                {chat.replyTo.message}
                                <div className='Group-message-time'>{new Date(chat.replyTo.dateTime).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                            </div> : ''}
                            {chat.message}
                            {chat.media ? <video className='Group-message-video' controls src={chat.media}></video> : ''}
                        </>
                }
                <div className='Group-message-time'>{new Date(chat.dateTime).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
            </div>
        }
    })

    return <div className='GroupMessages-container'>
        {
            messages
        }
        <VideoMessage showHiddenMessage={showHiddenMessage} sendMessage={sendMessage} user={props.user} className='Group-message-video' recording={recordWebcam} />
        <div ref={messagesEndRef} />
        <SendMessage sendMessage={sendMessage} user={props.user} openedChat={props.openedChat} />



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
    </div >
}
export default GroupMessages;