import { useEffect, useState } from "react";
import './NabBar.css'
import { Link } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa'
import { ImSearch } from 'react-icons/im'
import { GoChevronDown, GoChevronUp } from 'react-icons/go'
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [loginstatus, setLogin] = useState(false)
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)

    const navLink = document.querySelectorAll(".nav-link");
    const toggleVisible = () => {
        isOpen ? setIsOpen(false) : setIsOpen(true)
    }

    navLink.forEach(n => n.addEventListener("click", function () {
        setIsOpen(false)
    }));

    return (
            <nav className="navbar">
                <a href="#home" className="nav-logo">LOUD<span className="logo-text-two">Now</span></a>
                <ul className={"nav-menu " + (isOpen ? "active" : "")}>
                    <li className="nav-item category"><div className={"nav-link " + (categoryDropdownOpen ? "show" : "")}>CATEGORIES
                        <span onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}>{
                            categoryDropdownOpen ? (<GoChevronUp />) : (<GoChevronDown />)
                        }</span></div>
                        <ul className={"category-dropdown " + (categoryDropdownOpen ? "show" : "")}>
                            <li className="bg-white">Sport</li>
                            <li className="bg-black">Music</li>
                            <li className="bg-red">Comedy</li>
                            <li className="bg-black">Podcast</li>
                            <li className="bg-white">Fitness</li>
                        </ul>
                    </li>
                    <li className="nav-item"><div className="nav-link"> <ImSearch /> </div></li>
                    <li className="nav-item download"><div className="nav-link"> DOWNLOAD </div></li>
                    <li className="nav-item"><div className="nav-link"><FaUserAlt /></div></li>
                    <li className="nav-item"><div className="nav-link"> EN <span onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}>{
                            categoryDropdownOpen ? (<GoChevronUp />) : (<GoChevronDown />)
                        }</span> </div></li>
                </ul>
                <div className={"hamburger " + (isOpen ? "active" : "")} onClick={toggleVisible}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </nav>
    );
};

export default Navbar;
