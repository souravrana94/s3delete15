import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { useEffect } from 'react'
import { useState } from 'react'
import {
    VISIBILITY_TRAINER,
    VISIBILITY_WORLD,
} from '../../../../../constants/constants'
import Button from '../../../../Common/Button'

const CycleHeader = ({
    cycleDropdown,
    setSelectedCycle,
    selectedCycleId,
    addCycle = () => {},
    cloneCycle = () => {},
    showReorder = () => {},
    numDays,
}) => {
    const [cycleOptions, setCycleOptions] = useState({
        client: [],
        trainer: [],
        world: [],
    })
    useEffect(() => {
        const cycleOptions = {
            client: [],
            trainer: [],
            world: [],
        }

        cycleOptions.world.push(cycleDropdown.globalCycles)
        cycleOptions.trainer.push(cycleDropdown.allClientsCycle)
        cycleOptions.client.push(cycleDropdown.clientSpecificCycle)
        setCycleOptions(cycleOptions)
    }, [cycleDropdown])

    const getOptions = (options) =>
        options[0]?.map((cd, idx) => (
            <option key={idx} className={`cycle-option`} value={cd?._id}>
                {cd?.name}
            </option>
        ))

    return (
        <div className="cycle-header">
            <h4>Cycle</h4>
            <select
                required
                name="cycle"
                className="cycle-dropdown"
                value={selectedCycleId}
                onChange={(e) => {
                    setSelectedCycle(e?.target?.value)
                }}
                disabled={selectedCycleId == 1}
            >
                <option className="disabled-option" disabled>
                    GLOBAL
                </option>
                {getOptions(cycleOptions.world)}
                <option className="disabled-option" disabled>
                    ALL CLIENTS
                </option>
                {getOptions(cycleOptions.trainer)}
                <option className="disabled-option" disabled>
                    THIS CLIENT
                </option>
                {getOptions(cycleOptions.client)}
            </select>
            <div className="add-cycle-button-div">
                <div>
                    {selectedCycleId == 1 ? (
                        <></>
                    ) : (
                        <Button
                            classNames="no-word-wrap-nutrition"
                            text={'Add'}
                            onClick={() => {
                                addCycle()
                            }}
                            iconComponent="eos-icons:content-new"
                        />
                    )}
                </div>
                <div>
                    {selectedCycleId == 1 ? (
                        <></>
                    ) : (
                        <Button
                            classNames="no-word-wrap-nutrition"
                            text={'Clone'}
                            onClick={() => {
                                cloneCycle()
                            }}
                            iconComponent="fa6-regular:clone"
                        />
                    )}
                </div>
                <div>
                    <Button
                        classNames="no-word-wrap-nutrition"
                        text={'Reorder'}
                        onClick={() => {
                            showReorder()
                        }}
                        iconComponent="mdi:restart"
                    />
                </div>
            </div>
        </div>
    )
}

CycleHeader.propTypes = {
    cycleDropdown: PropTypes.object,
    setSelectedCycle: PropTypes.func,
    numDays: PropTypes.number,
    selectedCycleId: PropTypes.number,
}

export default CycleHeader
