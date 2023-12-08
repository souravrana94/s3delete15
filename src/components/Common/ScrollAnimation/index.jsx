import React from 'react'
import PropTypes from 'prop-types'
import ScrollAnimation from 'react-animate-on-scroll'

export default function DefaultScrollAnimation(props) {
    const {
        afterAnimatedIn = () => {},
        afterAnimatedOut = () => {},
        animateOnce = true,
        duration = 0,
        delay = 0,
        offset = 0,
    } = props

    return (
        <ScrollAnimation
            animateOnce={animateOnce}
            animateIn="fadeIn"
            afterAnimatedIn={afterAnimatedIn}
            afterAnimatedOut={afterAnimatedOut}
            duration={duration}
            delay={delay}
            offset={offset}
        >
            {props.children}
        </ScrollAnimation>
    )
}

DefaultScrollAnimation.propTypes = {
    children: PropTypes.any,
    afterAnimatedIn: PropTypes.func,
    afterAnimatedOut: PropTypes.func,
    animateOnce: PropTypes.bool,
    duration: PropTypes.number,
    delay: PropTypes.number,
    offset: PropTypes.number,
}
