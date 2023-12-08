import React, { useState } from 'react'
import './index.scss'
import { Icon } from '@iconify/react'
import ShadowContainer from '../ShadowContainer'

const AccordionComponent = ({
    data,
    active = false,
    headClick = true,
    disabled = false,
}) => {
    const [isActive, setIsActive] = useState(active)
    return (
        <div className="accordion-container">
            <div className="accordion" id="accordionExample">
                <ShadowContainer classNames="card-container">
                    <div
                        className={`accordion-header ${
                            isActive ? 'toggle' : ''
                        }`}
                    >
                        <p
                            className="accordion-title"
                            onClick={() => {
                                if (headClick) {
                                    setIsActive(!isActive)
                                }
                            }}
                        >
                            {data?.parent}
                        </p>
                        {!disabled ? (
                            isActive ? (
                                <Icon
                                    icon={'akar-icons:chevron-up'}
                                    className="down-carret"
                                    onClick={() => {
                                        setIsActive(!isActive)
                                    }}
                                />
                            ) : (
                                <Icon
                                    icon={'akar-icons:chevron-down'}
                                    className="down-carret"
                                    onClick={() => {
                                        setIsActive(!isActive)
                                    }}
                                />
                            )
                        ) : null}
                    </div>
                    {isActive ? (
                        <div className={isActive ? '' : 'collapse'}>
                            <ShadowContainer classNames="accordion-body ">
                                {data?.child}
                            </ShadowContainer>
                        </div>
                    ) : (
                        <></>
                    )}
                </ShadowContainer>
            </div>
        </div>
    )
}

export default AccordionComponent
