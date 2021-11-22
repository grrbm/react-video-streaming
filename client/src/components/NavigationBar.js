import React, { useEffect, useState } from "react";
import "./NabBar.css";
import { Link, useHistory } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { ImSearch } from "react-icons/im";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { useDispatch } from "react-redux";
import { SET_LANG } from "../actions/types";
import * as Language from "../assets/constant/Language";
import clsx from "clsx";

const Navbar = () => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [loginstatus, setLogin] = useState(false);
  const [hamburgerDropdownOpen, setHamburgerDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [selectedCategory, setSelectedCategory] = useState();
  const dispatch = useDispatch();
  const setLang = (lang) => ({ type: SET_LANG, payload: lang });

  const toggleVisible = () => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };
  const toggleHamburger = (event) => {
    console.log("click happened in " + event.target);
    console.log("click happened ID: " + event.target.id);
    console.log("click happened VALUE: " + event.target.value);
    console.log("click happened className: " + event.target.className);
    console.log("click happened innerText: " + event.target.innerText);
    console.log("click happened tagName: " + event.target.tagName);
    if (hamburgerDropdownOpen) {
      setIsOpen(false);
      setHamburgerDropdownOpen(false);
    } else {
      setIsOpen(true);
      setHamburgerDropdownOpen(true);
    }
  };
  const navLink = document.querySelectorAll(".nav-link");
  navLink.forEach((n) =>
    n.addEventListener("click", function () {
      setIsOpen(false);
    })
  );
  const navigateToHome = () => {
    history.push("/");
  };
  const navigateToUpload = () => {
    history.push("/upload");
  };
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
      <a className="nav-logo cursor-pointer" onClick={navigateToHome}>
        LOUD<span className="logo-text-two">Now</span>
      </a>
      <ul className={"nav-menu " + (isOpen ? "active" : "")}>
        <li className="nav-item category">
          {categoryDropdownOpen ? (
            <button
              tabIndex="-1"
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
        <li className="nav-item download" onClick={navigateToUpload}>
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
          {languageDropdownOpen ? (
            <button
              tabIndex="-1"
              className="fixed top-0 right-0 bottom-0 left-0 z-10 w-full h-full bg-black opacity-50 cursor-default"
              onClick={() => setLanguageDropdownOpen(false)}
            ></button>
          ) : (
            ""
          )}
          <div
            className={clsx("nav-link", "relative z-10")}
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
          >
            {language}
            <span>
              {languageDropdownOpen ? <GoChevronUp /> : <GoChevronDown />}
            </span>
          </div>
          <ul
            className={clsx(
              "language-dropdown " + (languageDropdownOpen ? "show" : ""),
              "shadow-xl relative"
            )}
          >
            <li
              className={
                language === "EN"
                  ? "bg-red cursor-pointer"
                  : "bg-black hover:bg-white hover:text-black cursor-pointer"
              }
              onClick={() => {
                setLanguage("EN");
                setLanguageDropdownOpen(false);
                dispatch(setLang("EN"));
              }}
            >
              EN
            </li>
            <li
              className={
                language === "PT"
                  ? "bg-red cursor-pointer"
                  : "bg-black hover:bg-white hover:text-black cursor-pointer"
              }
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
        id="hamburger-icon"
        className={clsx("hamburger " + (isOpen ? "active" : ""), "")}
        onClick={toggleHamburger}
      >
        {hamburgerDropdownOpen ? (
          <button
            tabIndex="-1"
            className="fixed top-0 right-0 bottom-0 left-0 z-10 w-full h-full bg-black opacity-50 cursor-default"
            onClick={() => setHamburgerDropdownOpen(false)}
          ></button>
        ) : (
          ""
        )}
        <div className="relative">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <ul
          className={clsx(
            "hamburger-dropdown " + (hamburgerDropdownOpen ? "show" : ""),
            "shadow-xl w-full absolute"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={
              selectedCategory === "Categories"
                ? "w-full bg-red cursor-pointer"
                : "w-full bg-black hover:bg-white hover:text-black cursor-pointer"
            }
            onClick={() => {
              setSelectedCategory("Categories");
            }}
          >
            {Language.CATEGORIES[language]}
          </div>
          {selectedCategory === "Categories" ||
          [
            Language.SPORT["EN"],
            Language.MUSIC["EN"],
            Language.COMEDY["EN"],
            Language.PODCAST["EN"],
            Language.FITNESS["EN"],
          ].includes(selectedCategory) ? (
            <div
              className={
                selectedCategory === "Sport"
                  ? "w-full bg-red cursor-pointer pl-4"
                  : "w-full bg-black hover:bg-white hover:text-black cursor-pointer pl-4"
              }
              onClick={() => {
                setSelectedCategory("Sport");
              }}
            >
              {Language.SPORT[language]}
            </div>
          ) : (
            ""
          )}

          <li
            className={
              selectedCategory === "Subscribe"
                ? "w-full bg-red cursor-pointer"
                : "w-full bg-black hover:bg-white hover:text-black cursor-pointer"
            }
            onClick={() => {
              setSelectedCategory("Subscribe");
            }}
          >
            {Language.SUBSCRIBE[language]}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
