import React, { useEffect, useState } from "react";
import "./NabBar.css";
import { Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { ImSearch } from "react-icons/im";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { useDispatch } from "react-redux";
import { SET_LANG } from "../actions/types";
import * as Language from "../assets/constant/Language";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginstatus, setLogin] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [laguageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [laguage, setLanguage] = useState("EN");
  const dispatch = useDispatch();
  const setLang = (lang) => ({ type: SET_LANG, payload: lang });

  const toggleVisible = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };
  const navLink = document.querySelectorAll(".nav-link");
  navLink.forEach((n) =>
    n.addEventListener("click", function () {
      setIsOpen(false);
    })
  );

  return (
    <nav className="navbar">
      <a href="#home" className="nav-logo">
        LOUD<span className="logo-text-two">Now</span>
      </a>
      <ul className={"nav-menu " + (isOpen ? "active" : "")}>
        <li className="nav-item category">
          <div
            className={"nav-link " + (categoryDropdownOpen ? "show" : "")}
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
          >
            {Language.CATEGORIES[laguage]}
            <span>
              {categoryDropdownOpen ? <GoChevronUp /> : <GoChevronDown />}
            </span>
          </div>
          <ul
            className={
              "category-dropdown " + (categoryDropdownOpen ? "show" : "")
            }
          >
            <li
              className="bg-white"
              onClick={() => {
                setCategoryDropdownOpen(false);
              }}
            >
              {Language.SPORT[laguage]}
            </li>
            <li
              className="bg-black"
              onClick={() => {
                setCategoryDropdownOpen(false);
              }}
            >
              {Language.MUSIC[laguage]}
            </li>
            <li
              className="bg-red"
              onClick={() => {
                setCategoryDropdownOpen(false);
              }}
            >
              {Language.COMEDY[laguage]}
            </li>
            <li
              className="bg-black"
              onClick={() => {
                setCategoryDropdownOpen(false);
              }}
            >
              {Language.POADCAST[laguage]}
            </li>
            <li
              className="bg-white"
              onClick={() => {
                setCategoryDropdownOpen(false);
              }}
            >
              {Language.FITNESS[laguage]}
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <div className="nav-link">
            <ImSearch />
          </div>
        </li>
        <li className="nav-item download">
          <div className="nav-link"> {Language.DOWNLOAD[laguage]} </div>
        </li>
        <li className="nav-item">
          <div className="nav-link">
            <FaUserAlt />
          </div>
        </li>
        <li className="nav-item subscribe">
          <div className="nav-link">{Language.SUBSCRIBE[laguage]}</div>
        </li>
        <li className="nav-item language-bar">
          <div
            className="nav-link"
            onClick={() => setLanguageDropdownOpen(!laguageDropdownOpen)}
          >
            {laguage}
            <span>
              {laguageDropdownOpen ? <GoChevronUp /> : <GoChevronDown />}
            </span>
          </div>
          <ul
            className={
              "language-dropdown " + (laguageDropdownOpen ? "show" : "")
            }
          >
            <li
              className="bg-white"
              onClick={() => {
                setLanguage("EN");
                setLanguageDropdownOpen(false);
                dispatch(setLang("EN"));
              }}
            >
              EN
            </li>
            <li
              className="bg-black"
              onClick={() => {
                setLanguage("PT");
                setLanguageDropdownOpen(false);
                dispatch(setLang("PT"));
              }}
            >
              PT
            </li>
          </ul>
        </li>
      </ul>
      <div
        className={"hamburger " + (isOpen ? "active" : "")}
        onClick={toggleVisible}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
