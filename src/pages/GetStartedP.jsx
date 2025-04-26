import React from 'react'

import styles from '../scss/GetStarted.module.scss'
import { NavLink } from 'react-router-dom'

const GetStartedP = () => {
  return (
    <section id={styles['get-started']}>
      <div className="container">
        <div className={styles['get-started']}>
          <div className={styles['get-started-title']}>Got <span>something</span> to say? <span>GAP AI</span> is here for you</div>
          <div className={styles['get-started-button']}>
            <NavLink to={'/login'}><button className={styles['get-started-button-active']}>Log In</button></NavLink>
            <NavLink to={'/register'}><button>Register</button></NavLink>
          </div>
          <div className={styles['get-started-terms']}>
            <a href="">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GetStartedP