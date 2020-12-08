import React, { useState } from 'react';
import './Login.css';

export const Login = (props) => {
    return <div className="Login-container">
        <div className='Login-card'>
            <div className='input-field-placeholder'>
                <input onChange={(e) => props.fieldOnchaneHandler(e)} name='email' className='input-field' type='email' placeholder='Enter email'></input>
            </div>
            <div className='input-field-placeholder'>
                <input onChange={(e) => props.fieldOnchaneHandler(e)} name='password' className='input-field' type='password' placeholder='Enter password'></input>
            </div>
            <div className='input-field-placeholder'>
                <button onClick={props.loginHandler}>Login</button>
            </div>
        </div>
    </div>
}