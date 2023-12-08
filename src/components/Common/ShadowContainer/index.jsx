import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const ShadowContainer = ({
    children,
    classNames = '',
    border = 'small',
    square = false,
    shadowSize = 'normal',
    cardTitle,
    cardElementRight,
    cardTitleClassNames = '',
    ...props
}) => {
    const boxRef = useRef()
    const [width, setWidth] = useState(0)

    // TODO @rt Find a better method. To Many rerenders
    const equalHeight = useCallback(() => {
        const vw = boxRef?.current?.offsetWidth
        setWidth(vw)
    }, [])

    useEffect(() => {
        equalHeight()
        window.addEventListener('resize', equalHeight)
        return () => {
            window.removeEventListener('resize', equalHeight)
        }
    }, [])

    return (
        <>
            {(cardTitle || cardElementRight) && (
                <div className="d-flex justify-content-between">
                    {cardTitle && (
                        <p
                            className={`shadow-container-title ${cardTitleClassNames}`}
                        >
                            {cardTitle}
                        </p>
                    )}
                    {cardElementRight}
                </div>
            )}
            <div
                {...props}
                ref={boxRef}
                style={
                    square
                        ? {
                              height: width,
                              background: 'white',
                          }
                        : {}
                }
                className={`${classNames} shadow-div shadow-div-${shadowSize} border-${border} ${
                    square ? 'center-fit' : ''
                }`}
            >
                {children}
            </div>
        </>
    )
}

ShadowContainer.propTypes = {
    children: PropTypes.any,
    classNames: PropTypes.string,
    cardTitleClassNames: PropTypes.string,
    border: PropTypes.string,
    square: PropTypes.bool,
    cardTitle: PropTypes.string,
    shadowSize: PropTypes.string,
    cardElementRight: PropTypes.element,
}

export default ShadowContainer
