import React from 'react'
import './Footer.css'
import {MdAlternateEmail} from 'react-icons/md'
import {BsTwitter ,BsInstagram} from 'react-icons/bs'
import Footer_IMG_SRC from '../assets/images/logo3.svg'
const Footer = () => {
    return (
        <div className="footer">
        
            <div className="footer-part-one row align-items-center">
                 <div className="nav-logo col-lg-2 col-md-3 col-sm-12">LOUD<span className="logo-text-two">Now</span></div>
                 <div className="texts d-flex col-lg-6 col-md-8 col-sm-12">
                     <div className="text">Terms & Conditions</div>
                     <div className="text">Privacy Policy</div>
                     <div className="text">Affiliates</div>
                 </div>
                 <div className="social-icons col-lg-2 col-sm-12">
                     <span className="twitter-icon"><BsTwitter /></span>
                     <span className="instagram-icon"><BsInstagram /></span>
                     <span className="email-icon"><MdAlternateEmail /></span>
                     
                 </div>
                 <div className="footer-image col-lg-1">
                     <img src={Footer_IMG_SRC} alt="footer"/>
                 </div>
            </div>
            <div className="footer-part-two">
                <div>Todos os direitos reservados por LoudNow</div>
                <div>© 2021 Loud Now</div>
            </div>
        </div>
    )
}
export default Footer