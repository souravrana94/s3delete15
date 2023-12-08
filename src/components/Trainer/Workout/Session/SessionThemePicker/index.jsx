import React, { useState } from 'react'
import Carousel from '../../../../Common/Carousel'
import './index.scss'
import SessionThemeCard from './SessionThemeCard'

const SessionThemePicker = ({
    sessionThemes,
    slidesToShow = 3,
    breakpoints = [600, 480],
    selectedCard,
    setSelectedCard,
}) => {
    return (
        <div className="carousel-div">
            <Carousel slidesToShow={slidesToShow} breakpoints={breakpoints}>
                {sessionThemes?.map((sessionTheme, idx) => (
                    <div key={idx}>
                        <SessionThemeCard
                            sessionTheme={sessionTheme}
                            isSelected={selectedCard == sessionTheme?._id}
                            idx={sessionTheme?._id}
                            setSelectedCard={setSelectedCard}
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default SessionThemePicker
