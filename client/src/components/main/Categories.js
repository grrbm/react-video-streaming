import React from "react";
import * as Language from "../../assets/constant/Language";
import { useSelector } from "react-redux";
import SPORT_IMG_SRC from "../../assets/images/Sport.png";
import PODCAST_IMG_SRC from "../../assets/images/Podcast.png";
import MUSIC_IMG_SRC from "../../assets/images/Music.png";
import COMEDY_IMG_SRC from "../../assets/images/Comedy.png";
import FITNESS_IMG_SRC from "../../assets/images/Fitness.png";
const Categories = () => {
  const language = useSelector((state) => state.lang.language);
  return (
    <div className="categories">
      <div className="video-group-title">{Language.CATEGORIES[language]}</div>
      <div className="category-images grid lg:grid-cols-5 gap-5 md:grid-cols-3">
        <div className="category-image-box">
          <img src={SPORT_IMG_SRC} alt="sport" />
          <div className="category-image-title">{Language.SPORT[language]}</div>
        </div>
        <div className="category-image-box">
          <img src={PODCAST_IMG_SRC} alt="podcast" />
          <div className="category-image-title">
            {Language.PODCAST[language]}
          </div>
        </div>
        <div className="category-image-box">
          <img src={MUSIC_IMG_SRC} alt="music" />
          <div className="category-image-title">{Language.MUSIC[language]}</div>
        </div>
        <div className="category-image-box">
          <img src={COMEDY_IMG_SRC} alt="comedy" />
          <div className="category-image-title">
            {Language.COMEDY[language]}
          </div>
        </div>
        <div className="category-image-box">
          <img src={FITNESS_IMG_SRC} alt="fitness" />
          <div className="category-image-title">
            {Language.FITNESS[language]}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Categories;
