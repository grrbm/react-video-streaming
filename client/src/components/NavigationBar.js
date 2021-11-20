import React, { useEffect, useState } from "react";
import "./NabBar.css";
import { Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { ImSearch } from "react-icons/im";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { useDispatch } from "react-redux";
import { SET_LANG } from "../actions/types";
import * as Language from "../assets/constant/Language";
import clsx from "clsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginstatus, setLogin] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [selectedCategory, setSelectedCategory] = useState();
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
  useEffect(() => {
    const handleEscape = (e) => {
      console.log("handling escape");
      if (e.key === "Esc" || e.key === "Escape") {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <nav className="navbar">
      <a href="#home" className="nav-logo">
        LOUD<span className="logo-text-two">Now</span>
      </a>
      <ul className={"nav-menu " + (isOpen ? "active" : "")}>
        <li className="nav-item category">
          {categoryDropdownOpen ? (
            <button
              tabindex="-1"
              className="fixed top-0 right-0 bottom-0 left-0 z-10 w-full h-full bg-black opacity-50 cursor-default"
              onClick={() => setCategoryDropdownOpen(false)}
            ></button>
          ) : (
            ""
          )}

          <div
            className={clsx(
              "nav-link " + (categoryDropdownOpen ? "show" : ""),
              "relative z-10"
            )}
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
          >
            {Language.CATEGORIES[language]}
            <span>
              {categoryDropdownOpen ? <GoChevronUp /> : <GoChevronDown />}
            </span>
          </div>
          <ul
            className={clsx(
              "category-dropdown " + (categoryDropdownOpen ? "show" : ""),
              "shadow-xl"
            )}
          >
            <li
              className={
                selectedCategory === "Sport"
                  ? "bg-red cursor-pointer"
                  : "bg-black hover:bg-white hover:text-black cursor-pointer"
              }
              onClick={() => {
                setSelectedCategory("Sport");
              }}
            >
              {Language.SPORT[language]}
            </li>
            <li
              className={
                selectedCategory === "Music"
                  ? "bg-red cursor-pointer"
                  : "bg-black hover:bg-white hover:text-black cursor-pointer"
              }
              onClick={() => {
                setSelectedCategory("Music");
              }}
            >
              {Language.MUSIC[language]}
            </li>
            <li
              className={
                selectedCategory === "Comedy"
                  ? "bg-red cursor-pointer"
                  : "bg-black hover:bg-white hover:text-black cursor-pointer"
              }
              onClick={() => {
                setSelectedCategory("Comedy");
              }}
            >
              {Language.COMEDY[language]}
            </li>
            <li
              className={
                selectedCategory === "Podcast"
                  ? "bg-red cursor-pointer"
                  : "bg-black hover:bg-white hover:text-black cursor-pointer"
              }
              onClick={() => {
                setSelectedCategory("Podcast");
              }}
            >
              {Language.PODCAST[language]}
            </li>
            <li
              className={
                selectedCategory === "Fitness"
                  ? "bg-red cursor-pointer"
                  : "bg-black hover:bg-white hover:text-black cursor-pointer"
              }
              onClick={() => {
                setSelectedCategory("Fitness");
              }}
            >
              {Language.FITNESS[language]}
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <div className="nav-link">
            <ImSearch />
          </div>
        </li>
        <li className="nav-item download">
          <div className="nav-link"> {Language.DOWNLOAD[language]} </div>
        </li>
        <li className="nav-item">
          <div className="nav-link">
            <FaUserAlt />
          </div>
        </li>
        <li className="nav-item subscribe">
          <div className="nav-link">{Language.SUBSCRIBE[language]}</div>
        </li>
        <li className="nav-item language-bar">
          <div
            className="nav-link"
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
          >
            {language}
            <span>
              {languageDropdownOpen ? <GoChevronUp /> : <GoChevronDown />}
            </span>
          </div>
          <ul
            className={
              "language-dropdown " + (languageDropdownOpen ? "show" : "")
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
