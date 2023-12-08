import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './index.scss'

// TODO Improve the entire file

const GenderSelection = ({
    register = () => {},
    initialValue = 'M',
    setValue = () => {},
    disabled = false,
}) => {
    const [selected, setSelected] = useState(initialValue) // M | F | T

    const handleSelectedChange = (value) => {
        if (disabled) return
        setSelected(value)
        setValue(value)
    }

    const maleClass = classNames({
        selected: selected === 'M',
        'not-selecte': selected !== 'M',
    })

    const femaleClass = classNames({
        selected: selected === 'F',
        'not-selecte': selected !== 'F',
    })

    const transClass = classNames({
        selected: selected === 'T',
        'not-selecte': selected !== 'T',
    })

    return (
        <div className="gender-container">
            <input
                name="gender"
                type="hidden"
                value={selected?.toUpperCase()}
                ref={register({ required: true })}
            />
            <div className="col-md-3 gender-text" ref={register}>
                Gender
            </div>
            <div className="option-container">
                <div className="male">
                    <div onClick={() => handleSelectedChange('M')}>
                        <div className="icon-container">
                            <div className={' circle'}>
                                <img
                                    className={maleClass}
                                    src="/images/circle.svg"
                                />
                            </div>
                            <img
                                className={maleClass + ' male-img icon'}
                                src="/images/male.svg"
                            />
                        </div>
                        <div className={maleClass + ' icon-text'}>Male</div>
                    </div>
                </div>
                <div className="female">
                    <div onClick={() => handleSelectedChange('F')}>
                        <div className="icon-container">
                            <div className="circle">
                                <img
                                    className={femaleClass}
                                    src="/images/circle.svg"
                                />
                            </div>
                            <img
                                className={femaleClass + ' female-img icon'}
                                src="/images/female.svg"
                            />
                        </div>
                        <div className={femaleClass + ' icon-text'}>Female</div>
                    </div>
                </div>
                <div className="Transgender">
                    <div onClick={() => handleSelectedChange('T')}>
                        <div className="icon-container">
                            <div className="circle">
                                <img
                                    className={transClass}
                                    src="/images/circle.svg"
                                />
                            </div>
                            <img
                                className={transClass + ' trans-img icon'}
                                src="/images/Trans.png"
                            />
                        </div>
                        <div className={transClass + ' icon-text'}>Trans</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

GenderSelection.propTypes = {
    register: PropTypes.func,
}

export default GenderSelection
