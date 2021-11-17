import React from "react";
import "./Footer.css";
import { MdAlternateEmail } from "react-icons/md";
import { BsTwitter, BsInstagram } from "react-icons/bs";
import Footer_IMG_SRC from "../assets/images/logo3.svg";
import { useSelector } from "react-redux";
import * as Language from "../assets/constant/Language";
const Footer = () => {
  const language = useSelector((state) => state.lang.language);
  return (
    <div className="footer">
      <div className="footer-part-one items-center lg:grid-cols-2 sm:grid-cols-1 grid">
        <div className="grid md:grid-cols-3 items-center sm:gap-5">
          <div className="nav-logo text-white lg:col-span-1 sm:col-span-3 lg:justify-start xs:justify-center flex">
            LOUD<span className="logo-text-two">Now</span>
          </div>
          <div className="texts text-white lg:col-span-2 sm:col-span-3 lg:jutify-start sm:justify-center grid md:grid-cols-3 sm:grid-cols-1 gap-3">
            <div className="text text-center">
              {Language.TERMS_AND_CONDITIONS[language]}
            </div>
            <div className="text text-center">
              {" "}
              {Language.PRIVACY_POLICY[language]}{" "}
            </div>
            <div className="text text-center">
              {Language.AFFILIATES[language]}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="social-icons flex text-white lg:justify-end xs:justify-center">
            <span className="twitter-icon">
              <BsTwitter />
            </span>
            <span className="instagram-icon">
              <BsInstagram />
            </span>
            <span className="email-icon">
              <MdAlternateEmail />
            </span>
          </div>
          <div className="footer-image lg:justify-end xs:justify-center flex">
            <img src={Footer_IMG_SRC} alt="footer" />
          </div>
        </div>
      </div>
      <div className="footer-part-two">
        <div>Todos os direitos reservados por LoudNow</div>
        <div>© 2021 Loud Now</div>
      </div>
    </div>
  );
};
export default Footer;
