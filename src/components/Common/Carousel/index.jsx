import React from 'react'
import Slider from 'react-slick'
import PropTypes from 'prop-types'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.scss'

const LeftArrow =
    'https://storage.googleapis.com/evolv-assets/MVP/icons/leftarrow.svg'

const RightArrow =
    'https://storage.googleapis.com/evolv-assets/MVP/icons/rightarrow.svg'

const Carousel = ({
    children,
    slidesToShow = 3,
    breakpoints = [600, 480],
    ...props
}) => {
    let newbreakpoints = breakpoints?.map((breakpoint, idx) => {
        return {
            breakpoint: breakpoint,
            settings: {
                infinite: children.length > breakpoints.length - idx,
                slidesToShow: breakpoints.length - idx,
                slidesToScroll: breakpoints.length - idx,
                initialSlide: breakpoints.length - idx,
            },
        }
    })
    var settings = {
        dots: true,
        draggable: false,
        infinite: children.length > 3,
        centerMode: false,
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToShow,
        initialSlide: 0,
        responsive: [...newbreakpoints],
        ...props,
    }

    return (
        <div className="p-1">
            <Slider {...settings} className="my-slider">
                {children}
            </Slider>
        </div>
    )
}

Carousel.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    breakpoints: PropTypes.array,
}

export default Carousel
