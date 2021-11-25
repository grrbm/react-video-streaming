import React, { useEffect, useRef, useState } from "react";
import { fetchVideos } from "../../actions/appActions";
import { connect } from "react-redux";
import NavBar from "./NavBar";
import Video from "./Video";
import { useSelector } from "react-redux";
import Carousel from "nuka-carousel";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core";

const Videos1 = (props) => {
  const { groupId } = props;
  const carouselRef = useRef();

  const videos = useSelector((state) =>
    state.app.videos1.filter((video) => {
      //return video.group === groupId;
      //*****DO NOT COMMIT THIS******/
      return true;
    })
  );
  const theme = useTheme();
  // const sm = useMediaQuery("(min-width:600px");
  const sm = useMediaQuery(theme.breakpoints.up("sm"));
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const xs = useMediaQuery(theme.breakpoints.up("xs"));

  let SlideToShowNumber;
  if (lg) {
    SlideToShowNumber = 4;
  } else {
    if (md) {
      SlideToShowNumber = 3;
    } else {
      if (sm) {
        SlideToShowNumber = 2;
      } else SlideToShowNumber = 1;
    }
  }
  return (
    <Carousel
      slidesToShow={SlideToShowNumber}
      slideToScroll={1}
      cellSpacing={40}
      disableEdgeSwiping={true}
      initialSlideHeight={338}
      frameOverflow={"hidden"}
      innerRef={carouselRef}
      renderCenterLeftControls={({ previousSlide, currentSlide }) =>
        currentSlide !== 0 ? (
          <button onClick={previousSlide} className="nuka-carousel-button">
            <FaChevronLeft />
          </button>
        ) : (
          <button className="disabled-button">
            <FaChevronLeft />
          </button>
        )
      }
      renderCenterRightControls={({
        nextSlide,
        slideCount,
        currentSlide,
        slidesToShow,
      }) =>
        currentSlide !== slideCount - slidesToShow ? (
          <button onClick={nextSlide} className="nuka-carousel-button">
            <FaChevronRight />
          </button>
        ) : (
          <button className="disabled-button">
            <FaChevronRight />
          </button>
        )
      }
    >
      {videos.map((video, key) => (
        <Video {...video} key={key} />
      ))}
    </Carousel>
  );
};

export default Videos1;
