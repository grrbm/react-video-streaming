import React from "react";
import { FaShareAlt } from "react-icons/fa";
import ShareIcon from "../assets/icons/ShareIcon";
import "./Share.css";

const Share = ({ children, Prop, classes = "", color = "blue" }) => (
  <div className="bg-black">
    <span className="w-auto h-16 border-b-4 border-red-650 text-xl font-semibold">
      Alok | All Musics | Octuber Fast | #22
    </span>
    <br />
    <span className="text-xl font-thin">Watch the best bits of Alok!</span>
    <br />
    <span className="text-xl font-thin">ALOK</span>
    <br />
    <br />
    <button
      className={`flex h-10 bg-red-650 text-white font-sans hover:bg-white-600 rounded focus:shadow-outline`}
    >
      <ShareIcon classes="w-6 h-10 ml-2 mr-1" />
      <span className="items-center h-10 text-xl pt-1 mr-4 font-bold">
        SHARE
      </span>
    </button>
  </div>
);

export default Share;
