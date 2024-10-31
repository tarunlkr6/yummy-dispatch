import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'


const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
      <p>For Better Experience Download <br /> Scan&Dine App</p>
      <div className="app-download-platforms">
        <img src={assets.app_store} alt="appstore" />
        <img src={assets.play_store} alt="playstore" />
      </div>
    </div>
  )
}

export default AppDownload
