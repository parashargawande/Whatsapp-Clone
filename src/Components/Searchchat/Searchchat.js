import React from 'react';
import './Searchchat.css';

const Searchchat=(props)=>{
    return <div className="Searchchat-container">
        <div className="search-box">
            <div className="search-icon">
                <i class="ms-Icon ms-Icon--Search" aria-hidden="true"></i>
            </div>
            <div className="search-input-container">
                <input placeholder="Search or start new chat" className="search-input"></input>
            </div>
        </div>
    </div>
}
export default Searchchat;