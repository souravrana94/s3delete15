import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import { useEffect } from 'react'
import { useState } from 'react'
import {
    VISIBILITY_TRAINER,
    VISIBILITY_WORLD,
} from '../../../../constants/constants'
import Button from '../../../Common/Button'

const CycleHeader = ({
    cycleDropdown,
    setSelectedCycle,
    selectedCycleId,
    selectedCycle,
    addCycle = () => {},
    cloneCycle = () => {},
    showReorder = () => {},
    setForAutoAssign = () => {},
    numDays,
    global,
    isAdmin,
}) => {
    console.log(selectedCycle, 'yghjk')
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

        // cycleDropdown.forEach((cd) => {
        //     if (cd?.visibility === VISIBILITY_WORLD) cycleOptions.world.push(cd)
        //     else if (cd?.visibility === VISIBILITY_TRAINER)
        //         cycleOptions.trainer.push(cd)
        //     else cycleOptions.client.push(cd)
        // })
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
            {selectedCycleId == -1 ? (
                <select
                    required
                    name="cycle"
                    className="cycle-dropdown"
                    // value={selectedCycleId}
                    onChange={(e) => {
                        setSelectedCycle(e?.target?.value)
                    }}
                    disabled={selectedCycleId == 1}
                >
                    <option value="none" selected disabled hidden>
                        Select a Cycle
                    </option>
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
            ) : (
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
            )}
            <div className="add-cycle-button-div">
                <div>
                    {selectedCycleId == 1 || global ? (
                        <></>
                    ) : (
                        <Button
                            classNames="no-word-wrap"
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
                            classNames="no-word-wrap"
                            text={'Clone'}
                            onClick={() => {
                                cloneCycle()
                            }}
                            iconComponent="fa6-regular:clone"
                        />
                    )}
                </div>
                <div>
                    {!global && (
                        <Button
                            classNames="no-word-wrap"
                            text={'Reorder'}
                            onClick={() => {
                                showReorder()
                            }}
                            iconComponent="mdi:restart"
                        />
                    )}
                </div>
                {isAdmin == true && (
                    <div>
                        {selectedCycle?.forAutoAssign == true ? (
                            <div>
                                <Button
                                    classNames="no-word-wrap"
                                    text={'Remove For 7 Day'}
                                    onClick={() => {
                                        setForAutoAssign(false)
                                    }}
                                />
                            </div>
                        ) : (
                            <div>
                                <Button
                                    classNames="no-word-wrap"
                                    text={'Assign For 7 Day'}
                                    onClick={() => {
                                        setForAutoAssign(true)
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* <div className="days-per-week">
                <img src="/images/Group.svg" alt="" height={25} />
                <span>{numDays} day per week</span>
            </div>
            <div className="approx-time">
                <img src="/images/clock.svg" alt="" height={25} />
                <span>30-45 mins</span>
            </div> */}
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
