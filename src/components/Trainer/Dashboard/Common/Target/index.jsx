import React from 'react'
import { Icon } from '@iconify/react'
import Button from '../../../../Common/Button/index'
import Loader from '../../../../Common/Loader/index'
import './index.scss'

const Target = ({ target, changeTarget, changeValue, isLoading }) => {
    const incrementHandler = () => {
        changeTarget((prevTarget) => prevTarget + changeValue)
    }

    const decrementHandler = () => {
        changeTarget((prevTarget) => Math.max(0, prevTarget - changeValue))
    }

    return isLoading ? (
        <div className="loader-container">
            <Loader />{' '}
        </div>
    ) : (
        <div className="target">
            <Button
                style={{ marginBottom: '5px' }}
                onClick={incrementHandler}
                iconComponent={'carbon:add'}
                size="s"
            />

            <span>
                <h5>{(target / 1000).toFixed(1)}k</h5>
                <p className="subtitle space" style={{ letterSpacing: '1px' }}>
                    target
                </p>
            </span>
            <Button
                style={{ marginTop: '5px' }}
                onClick={decrementHandler}
                iconComponent={'akar-icons:minus'}
                size="s"
            />
        </div>
    )
}

export default Target
