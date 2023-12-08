import React from 'react'
import './index.scss'

const Buttons = ({ showWorkout, setShowWorkout }) => {
    return (
        <>
            <div
                onClick={() => setShowWorkout('Workout')}
                className={
                    showWorkout == 'Workout' ? 'selectedButton' : 'buttons'
                }
            >
                Workout
            </div>
            <div
                onClick={() => setShowWorkout('Stats')}
                className={
                    showWorkout == 'Stats' ? 'selectedButton' : 'buttons'
                }
            >
                Stats
            </div>
            <div
                onClick={() => setShowWorkout('Tasks')}
                className={
                    showWorkout == 'Tasks' ? 'selectedButton' : 'buttons'
                }
            >
                Tasks
            </div>
            <div
                onClick={() => setShowWorkout('Nutrition')}
                className={
                    showWorkout == 'Nutrition' ? 'selectedButton' : 'buttons'
                }
            >
                Nutrition
            </div>
            <div
                onClick={() => setShowWorkout('profile')}
                className={
                    showWorkout == 'profile' ? 'selectedButton' : 'buttons'
                }
            >
                Profile
            </div>
        </>
    )
}

export default Buttons
