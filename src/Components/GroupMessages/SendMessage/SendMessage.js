import React, { useState } from 'react';
import './SendMessage.css';

const SendMessage = (props) => {

    const [message, setMessage] = useState('');

    const [reactionMessage, setreactionMessage] = useState(false);

    const inputOnchangeHandler = (e) => {
        setMessage(e.target.value);
    }

    const requestReactionHandler=(e)=>{
        setreactionMessage(!reactionMessage);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if (props.sendMessage(message,null,reactionMessage)) {
            setMessage('');
        } else {
            console.log('unnable to send message');
        }
    }

    console.log("[SendMessage] rendered");
    return <>
        <div className='SendMessage-container'>
            <form className='SendMessage-container' onSubmit={(e) => sendMessage(e)}>
                <div className='Sendmessage-icon-container'>
                    <i className="ms-Icon ms-Icon--Attach" aria-hidden="true"></i>
                </div>
                <div onClick={requestReactionHandler} className={reactionMessage?'Sendmessage-icon-container active':'Sendmessage-icon-container'}>
                    <i title='Request face reaction' className="ms-Icon ms-Icon--AddReaction" aria-hidden="true"></i>
                </div>
                <div className="sendmessage-input-container">
                    <input value={message} onChange={(e) => inputOnchangeHandler(e)} type="text" placeholder="Type a message" className="sendmessage-input"></input>
                </div>
                <div className='Sendmessage-icon-container sendIcon'>
                    <button type='submit' className='Sendmessage-btn'>
                        <i className="ms-Icon ms-Icon--Forward" aria-hidden="true"></i>
                    </button>
                </div>
            </form>
        </div>
    </>
}

export default SendMessage;