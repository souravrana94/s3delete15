import React from 'react'
import moment from 'moment'
import axios from '../../../store/axios-secure'
import { useEffect } from 'react'
import { useState } from 'react'
import './index.scss'

const UserProfileComp = ({ clientId }) => {
    const [data, setData] = useState(null)
    const [userAge, setUserAge] = useState(null)
    const [error, setError] = useState(false)
    const fetchData = async () => {
        try {
            const response = await axios.get(
                `/trainers/userProfile?clientId=${clientId}`,
            )
            // console.log("----user details response ", response?.status, response?.data)
            setData(response?.data)
            if (response?.data?.DOB) {
                let age = _calculateAge(response?.data?.DOB)
                setUserAge(age)
            }
            setError(false)
        } catch (e) {
            console.log('Error while fetching data ', e)
            setError(true)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    function _calculateAge(birthday) {
        // birthday is a date
        var ageDifMs = Date.now() - new Date(birthday).getTime()
        var ageDate = new Date(ageDifMs) // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970)
    }
    return (
        <>
            {error ? (
                <div style={{ paddingLeft: '10px', color: 'red' }}>
                    Error While Fetching Data
                </div>
            ) : null}
            <div style={{ flexWrap: 'wrap', display: 'flex' }}>
                <div className="leftCard">
                    <div
                        style={{
                            backgroundColor: 'black',
                            padding: '5px',
                            borderRadius: '5px',
                        }}
                    >
                        <div className="card1">
                            <div>Date of Birth</div>
                            <div>
                                {data?.DOB
                                    ? moment(data?.DOB).format('DD-MM-yyyy') +
                                      ' (' +
                                      userAge +
                                      ' years)'
                                    : ''}
                            </div>
                        </div>
                        <div className="card1">
                            <div>Height</div>
                            <div>
                                {data?.height ? data?.height + ' cm' : ''}
                            </div>
                        </div>
                        <div className="card1">
                            <div>Weight</div>
                            <div>
                                {data?.weight ? data?.weight + ' kg' : ''}{' '}
                            </div>
                        </div>
                        <div className="card1">
                            <div>Gender</div>
                            <div>{data?.gender}</div>
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundColor: 'black',
                            padding: '5px',
                            borderRadius: '5px',
                            marginTop: '10px',
                        }}
                    >
                        <div className="card1">
                            <div>Cardio</div>
                            <div>
                                {data?.settingsRef?.preferredCardioRef?.name}
                            </div>
                        </div>
                        <div className="card1">
                            <div>Budget</div>
                            <div>{data?.budget?.amount}</div>
                        </div>
                        <div className="card1">
                            <div>Occupation</div>
                            <div>{data?.occupation}</div>
                        </div>
                        <div className="card1">
                            <div>Lead to Evolv Fit</div>
                            <div>{data?.leadToEvolvFit}</div>
                        </div>
                        <div className="card1">
                            <div>Ever Tracked Calories?</div>
                            <div>{data?.isCaloriesTracked ? 'Yes' : 'No'}</div>
                        </div>
                        <div className="card1">
                            <div>How Imortant is Fitness?</div>
                            <div>{data?.fitnessImportance}</div>
                        </div>
                        <div className="card1">
                            <div>Workout Duration</div>
                            <div>{data?.settingsRef?.workoutDuration}</div>
                        </div>
                        <div className="card1">
                            <div>Workout Frequency</div>
                            <div>{data?.settingsRef.workoutFrequency}</div>
                        </div>
                        <div className="card1">
                            <div>Ever Done Strength Training?</div>
                            <div>
                                {data?.settingsRef?.isStrengthTrainingDone
                                    ? 'Yes'
                                    : 'No'}
                            </div>
                        </div>
                        <div className="card1">
                            <div>Selected Workout Variant</div>
                            <div>{data?.settingsRef?.workoutVariant}</div>
                        </div>
                    </div>
                </div>
                <div className="rightCard">
                    <div
                        style={{
                            backgroundColor: 'black',
                            padding: '5px',
                            borderRadius: '5px',
                        }}
                    >
                        <div className="card2Heading">Goal</div>
                        <div className="card2">
                            <div>
                                {data?.goals?.goal?.map((item, index) => (
                                    <span key={index}>{item}, </span>
                                ))}
                            </div>
                            <div>
                                <span className="card2Subheading">
                                    Remark-{' '}
                                </span>
                                {data?.goals?.remark}
                            </div>
                        </div>

                        <div className="card2Heading">Medical Conditions</div>
                        <div className="card2">
                            <div>
                                {data?.medicalCondition?.conditions?.map(
                                    (item, index) => (
                                        <span key={index}>{item}, </span>
                                    ),
                                )}
                            </div>
                            <div>
                                <span className="card2Subheading">
                                    Remark-{' '}
                                </span>
                                {data?.medicalCondition?.remark}
                            </div>
                        </div>

                        <div className="card2Heading">Injury History</div>
                        <div className="card2">
                            <div>
                                {data?.injuryHistory?.injuries?.map(
                                    (item, index) => (
                                        <span key={index}>{item}, </span>
                                    ),
                                )}
                            </div>
                            {data?.injuryHistory?.fractureArea ? (
                                <>
                                    <div>
                                        <span className="card2Subheading">
                                            Fracture Area-{' '}
                                        </span>
                                        {data?.injuryHistory?.fractureArea}
                                    </div>
                                </>
                            ) : null}
                            {data?.injuryHistory?.tendonitisArea ? (
                                <>
                                    <div>
                                        <span className="card2Subheading">
                                            Tendonitis Area-{' '}
                                        </span>
                                        {data?.injuryHistory?.tendonitisArea}
                                    </div>
                                </>
                            ) : null}
                            {data?.injuryHistory?.ligemantTear ? (
                                <>
                                    <div>
                                        <span className="card2Subheading">
                                            Ligament Area-{' '}
                                        </span>
                                        {data?.injuryHistory?.ligemantTear}
                                    </div>
                                </>
                            ) : null}
                            <div>
                                <span className="card2Subheading">
                                    Remark-{' '}
                                </span>
                                {data?.injuryHistory?.remarks}
                            </div>
                        </div>
                        <div className="card2Heading">Workout</div>
                        <div className="card2">
                            <div>
                                <span className="card2Subheading">
                                    Experience-{' '}
                                </span>
                                {data?.workoutExperiance?.experiance}
                            </div>
                            <div>
                                <span className="card2Subheading">
                                    Equipment-{' '}
                                </span>
                                {data?.workoutExperiance?.equipmentAccess}
                            </div>
                            <div>
                                <span className="card2Subheading">
                                    Remark-{' '}
                                </span>
                                {data?.workoutExperiance?.remark}
                            </div>
                        </div>
                        <div className="card2Heading">Meal</div>
                        <div className="card2">
                            <div>
                                <span className="card2Subheading">
                                    Meal Preference-{' '}
                                </span>
                                {data?.mealPreferance}
                            </div>
                            <div>
                                <span className="card2Subheading">
                                    Allergic Meal-{' '}
                                </span>
                                {data?.allergicMeal}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfileComp
