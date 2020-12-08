import React from 'react';
import './NewGroupSlider.css';

export const NewGroupSlider = (props)=>{
    console.log('[NewGroupSlider.js] rendered');
    return <div onClick={(e)=>e.stopPropagation()} className={props.show ?"NewGroupSlider-Container": "NewGroupSlider-Container slideOut"}>
          sdfsdf
    </div>
}