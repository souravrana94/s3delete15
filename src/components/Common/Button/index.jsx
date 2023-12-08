import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { Icon } from '@iconify/react'

const Button = ({
    classNames = '',
    text,
    icon,
    size = 'md',
    color = 'black',
    iconColor,
    iconComponent,
    iconSize,
    removeIconOn = '',
    style,
    ...props
}) => {
    return (
        <button
            className={`btn-evolv btn-${size} btn-${color} ${classNames}`}
            style={style}
            {...props}
        >
            {icon && (
                <img
                    src={icon}
                    alt=""
                    className={`upload-button-icon upload-button-icon-${size} remove-${removeIconOn}`}
                />
            )}
            {iconComponent && (
                <span
                    className={`upload-button-icon upload-button-icon-${size} remove-${removeIconOn}`}
                >
                    <Icon
                        icon={iconComponent}
                        height={iconSize}
                        color={iconColor}
                    />
                </span>
            )}
            {text}
        </button>
    )
}

Button.propTypes = {
    children: PropTypes.element,
    classNames: PropTypes.string,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    icon: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
    removeIconOn: PropTypes.string,
}

export default Button
