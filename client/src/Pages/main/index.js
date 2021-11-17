import React from "react";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import Content from "../../components/main/Content";
import Photo from "../../components/main/Photo";
import Categories from "../../components/main/Categories";
import "../../components/main/main.css";
const Main = () => {
  return (
    <div>
      <NavigationBar />
      <Photo />
      <Content />
      <Categories />
      <Footer />
    </div>
  );
};
export default Main;
