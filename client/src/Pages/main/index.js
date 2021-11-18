import React from "react";
import Content from "../../components/main/Content";
import Photo from "../../components/main/Photo";
import Categories from "../../components/main/Categories";
import "../../components/main/main.css";

const Main = () => {
  return (
    <>
      <Photo />
      <Content />
      <Categories />
    </>
  );
};
export default Main;
