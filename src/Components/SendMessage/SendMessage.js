import React from 'react';
import './SendMessage.css';

const SendMessage = (props) => {
    return <div className='SendMessage-container'>
        <div className='Sendmessage-icon-container'>
            <i class="ms-Icon ms-Icon--Attach" aria-hidden="true"></i>
        </div>
        <div className="sendmessage-input-container">
            <input type="text" placeholder="Type a message" className="sendmessage-input"></input>
        </div>
        <div className='Sendmessage-icon-container sendIcon'>
            <i class="ms-Icon ms-Icon--Forward" aria-hidden="true"></i>
        </div>
        
        {/* <div>attac</div>
        <div>input</div>
        <div>audio</div> */}
    </div>
}

export default SendMessage;