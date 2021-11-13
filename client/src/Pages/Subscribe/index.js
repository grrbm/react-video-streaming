import React from 'react'
import './Subscribe.css'
import SUBSCRIBE_IMG_SCR from '../../assets/images/subscribe.png'
const Subscribe = ()=>{
    return(
        <div className="subscribe">
            <div className="explaination-image">
                <img src={SUBSCRIBE_IMG_SCR} alt="subscribe" className="image"/>
            </div>
        </div>
    )
}
export default Subscribe