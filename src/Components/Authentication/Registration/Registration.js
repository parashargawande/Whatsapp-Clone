import React from 'react';
import './Registration.css';

export const Registration = (props) => {
    return <div className='Registration-container'>
        <div className='Registration-card'>
            <div className='input-field-placeholder'>
                <input onChange={(e) => props.fieldOnchaneHandler(e)} name='name' className='input-field' type='text' placeholder='Enter name'></input>
            </div>
            <div className='input-field-placeholder'>
                <input onChange={(e) => props.fieldOnchaneHandler(e)} name='email' className='input-field' type='email' placeholder='Enter email'></input>
            </div>
            <div className='input-field-placeholder'>
                <input onChange={(e) => props.fieldOnchaneHandler(e)} name='password' className='input-field' type='password' placeholder='Enter password'></input>
            </div>
            <div className='input-field-placeholder'>
                <input onChange={(e) => props.fieldOnchaneHandler(e)} name='cnfPassword' className='input-field' type='password' placeholder='ReEnter password'></input>
            </div>
            <div className='input-field-placeholder'>
                <button onClick={props.registerHandler}>Register</button>
            </div>
        </div>

    </div>
}