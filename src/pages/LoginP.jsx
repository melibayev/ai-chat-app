import React from 'react'

import styles from '../scss/Login.module.scss'

const LoginP = () => {
  return (
    <section id={styles['get-started']}>
      <div className="container">
        <div className={styles['get-started']}>
          <div className={styles['get-started-title']}>Got <span>something</span> to say? <span>GAP AI</span> is here for you</div>
          <div className={styles['get-started-button']}>
            <button>Get Started</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginP