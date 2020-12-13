import React from 'react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import './Loader.css';

const Loader = (props) => {
    return <Spinner className='Loader-large' size={SpinnerSize.large} label={props.label} />
}
export default Loader;