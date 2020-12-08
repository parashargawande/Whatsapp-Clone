import React from 'react';
import './Menu.css';
export const Menu=(props)=>{

    console.log('[Menu.js] rendered');
    
    return <div hidden={!props.show} className='Menu-container'>
        <div onClick={()=>props.setMenu('New-Group')} className='Menu-items'>New group</div>
        <div onClick={()=>props.setMenu('Setting')} className='Menu-items'>Setting</div>
        <div onClick={()=>props.setMenu('Logout')} className='Menu-items'>Logout</div>
    </div>
} 