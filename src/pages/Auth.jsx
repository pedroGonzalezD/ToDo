import { useState } from 'react';
import styles from '../styles/stylesComponents/Auth.module.scss'
import { useAuth } from '../contexts/authContext';
import {Navigate, useNavigate} from "react-router-dom"

const Auth = () => {
  const{authenticate, isAuthenticated} = useAuth()
  const [isSignIn, setIsSignIn] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMoving, setIsMoving] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate()
  
  if (isAuthenticated) {
    return <Navigate to="/" replace/>
  }
  
  const handleSwitch = () => {
    setIsTransitioning(true)
    setIsMoving(prevState => !prevState)
    setFormData({
      username: '',
      password: '',
      confirmPassword: ''
    });

    setTimeout(()=>{
      setIsSignIn(prevState => !prevState)
      setIsTransitioning(false)
    }, 500)
  }

  const handleInputChange = (e) =>{
    const {name, value} = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) =>{
    e.preventDefault()

    const url = isSignIn ? '/api/login' : '/api/register'
    const payload = isSignIn
  ? { username: formData.username, password: formData.password }
  : { username: formData.username, password: formData.password, confirmPassword: formData.confirmPassword };

    const result = await authenticate(url, payload, isSignIn)
    
    setFormData({
      username: '',
      password: '',
      confirmPassword: ''
    });

    if(result.success){
      if(isSignIn){
        navigate('/')
      }else{
        handleSwitch()
      }
    }
  }


  return(
    <div className={styles.body}>
      <div className={styles.container}>
      <div className={`${styles.cont} ${isTransitioning ? styles.opacity : ''} ${isMoving ? styles.start : styles.end}`}>
        <form onSubmit={handleSubmit} className={`${styles.form} ${isSignIn ? styles.formSignIn : styles.formSignUp}`}>
          {isSignIn ? (
            <>
            <h2>Sign In</h2>
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder='username' required autoComplete='off'/>
      <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder='password' required/>
            <button type='submit'>SIGN IN</button>
            </>
          ) : (
            <>
          <h2>Create Account</h2>
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder='username'required autoComplete='off'/>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder='password' required/>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder='confirm password' required/>
            <button type='submit'>SIGN UP</button>
            </>
          )}
        </form>
      </div>
      <div className={`${styles.contB} ${isMoving ? styles.start : styles.end}`}>
        <div className={`${styles.contC} ${isTransitioning ? styles.opacity : ''}`}>
        {isSignIn ? (
          <div className={styles.div}>
          <h3>Hello, Friend!</h3>
          <p>Register to use all of site features</p>
          <button onClick={handleSwitch}>SIGN UP</button>
          </div>
        ) : (
          <div className={styles.div}>
          <h3>Welcome Back!</h3>
          <p>Enter your personal details to use all of site features</p>
          <button onClick={handleSwitch}>SIGN IN</button>
          </div>
        )}
        </div>
      </div>
        </div>
    </div>
  )
};

export default Auth;
