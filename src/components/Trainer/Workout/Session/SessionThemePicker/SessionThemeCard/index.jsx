import React from 'react'
import './index.scss'
import SessionThemeColors from '../../../../../../constants/SessionThemeColors'

const SessionThemeCard = ({
    sessionTheme,
    isSelected = false,
    idx = 0,
    setSelectedCard = () => {},
}) => {
    return (
        <div
            className={`session-theme-div  ${sessionTheme?.layout}-div ${
                isSelected ? 'session-theme-selected' : ''
            }`}
            style={{
                backgroundColor: SessionThemeColors[`${sessionTheme?.color}`],
            }}
            onClick={() => {
                setSelectedCard(idx)
            }}
        >
            <div className={`left ${sessionTheme?.layout}`}>
                <div>
                    <div className="dummy-data-0"></div>
                    <div className="dummy-data-1"></div>
                </div>
                <div className="dummy-data-2"></div>
            </div>
            <div className={`right ${sessionTheme?.layout}`}>
                <img
                    className="right-image"
                    src={sessionTheme?.imageUrl}
                    alt=""
                />
            </div>
        </div>
    )
}

export default SessionThemeCard
