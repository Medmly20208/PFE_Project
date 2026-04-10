import React from 'react'
//react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
const Carousel = (props) => {
  return (
    <Slider
      {...props.settings}
      style={{ width: "50vw", height: "80vh" }}
      className="hidden sm:block"
    >
        {props.children}
     
    </Slider>
  );
}

export default Carousel