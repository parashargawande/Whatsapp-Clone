import React, { useState } from 'react';
import './Authentication.css';
import { Login } from './Login/Login';
import { Registration } from './Registration/Registration';
import firebase from '../../Firebase';

export const Authentication = (props) => {

    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({});
    const db = firebase.firestore();
    
    const fieldOnchaneHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const validateRegisterForm = () => {
        console.log(form.password !== form.cnfPassword);
        console.log(form.password, form.cnfPassword);
        if (form.password !== form.cnfPassword) {
            return "password does not match";
        }
        if (!form.email || !form.name || !form.password) {
            return 'one or more field empty';
        }
        return null;
    }
    const registerHandler = () => {
        let errorMsg = validateRegisterForm();
        if (errorMsg === null) {
            firebase.auth().createUserWithEmailAndPassword(form.email, form.password)
                .then((user) => {
                    console.log(user.user.uid);
                    const res = db.collection('users').doc(user.user.uid).set({email:user.user.email,name:form.name});
                    res.then(()=>{
                        console.log('user Registered');
                        props.setUser(user);
                    }).catch((e)=>{
                        alert(e.message);
                    });
                })
                .catch((error) => {
                    // var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(errorMessage);
                });
        } else {
            alert(errorMsg);
        }
    }

    const validateLoginForm = () => {
        if (!form.email || !form.password) {
            return 'one or more field empty';
        }
        return null;
    }
    const loginHandler = () => {
        let errorMsg = validateLoginForm();
        if (errorMsg === null) {
            firebase.auth().signInWithEmailAndPassword(form.email, form.password)
                .then((user) => {
                    console.log(user.user.uid);
                    props.setUser(user);
                })
                .catch((error) => {
                    // var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(errorMessage);
                });
        } else {
            alert(errorMsg);
        }
    }

    console.log("[Authentication.js rendered]");
    return <div className={'Authentication-container'}>
        <div className='Authentication-card'>
            <div className='Authentication-Bar'>
                <div onClick={() => setIsLogin(true)} className={isLogin ? 'Authentication-tab act' : 'Authentication-tab'}>Login</div>
                <div onClick={() => setIsLogin(false)} className={isLogin ? 'Authentication-tab' : 'Authentication-tab act'}>Register</div>
            </div>
            {isLogin ?
                <Login fieldOnchaneHandler={fieldOnchaneHandler} loginHandler={loginHandler}  /> :
                <Registration fieldOnchaneHandler={fieldOnchaneHandler} registerHandler={registerHandler} />
            }
        </div>
    </div>
}