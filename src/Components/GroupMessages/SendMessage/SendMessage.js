import React, { useState } from 'react';
import './SendMessage.css';
import firebase from '../../../Firebase';

const SendMessage = (props) => {

    const [message, setMessage] = useState('');

    const inputOnchangeHandler = (e) => {
        setMessage(e.target.value);
    }
    const sendMessage=()=>{
        if(props.sendMessage(message)){
            setMessage('');
        }else{
            console.log('unnable to send message');
        }
    }

    console.log("[SendMessage] rendered");
    return <div className='SendMessage-container'>
        <div className='Sendmessage-icon-container'>
            <i className="ms-Icon ms-Icon--Attach" aria-hidden="true"></i>
        </div>
        <div className="sendmessage-input-container">
            <input value={message} onChange={(e) => inputOnchangeHandler(e)} type="text" placeholder="Type a message" className="sendmessage-input"></input>
        </div>
        <div onClick={() =>sendMessage()} className='Sendmessage-icon-container sendIcon'>
            <i className="ms-Icon ms-Icon--Forward" aria-hidden="true"></i>
        </div>

        {/* <div>attac</div>
        <div>input</div>
        <div>audio</div> */}
    </div>
}

export default SendMessage;