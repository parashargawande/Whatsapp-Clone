import React from 'react';
import './LeftSlider.css';

const LeftSlider = (props) => {
    return <div onClick={(e) => e.stopPropagation()} className={props.show ? "LeftSlider-Container" : "LeftSlider-Container slideOut"}>
        {props.innerComponent}
    </div>
}
export default LeftSlider;