import React from 'react'
import ProgressBar from '@ramonak/react-progress-bar'
import './index.scss'

const NutritionProgressBar = ({ graphData }) => {
    return (
        <div>
            <div style={{ display: 'flex' }}>
                <span className="progressLabel">Calorie</span>
                <ProgressBar
                    completed={graphData?.takenCalories}
                    maxCompleted={graphData?.calories}
                    bgColor="#e70af2"
                    height="6px"
                    width="150px"
                    labelAlignment="outside"
                    customLabel={`${graphData?.takenCalories}/${graphData?.calories}`}
                    labelSize="10px"
                />
            </div>
            <div style={{ display: 'flex' }}>
                <span className="progressLabel">Protein</span>
                <ProgressBar
                    completed={graphData?.takenProtein}
                    maxCompleted={graphData?.protein}
                    bgColor="#4bcc4b"
                    height="6px"
                    width="150px"
                    labelAlignment="outside"
                    customLabel={`${graphData?.takenProtein}/${graphData?.protein}`}
                    labelSize="10px"
                />
            </div>
            <div style={{ display: 'flex' }}>
                <span className="progressLabel">Carbs</span>
                <ProgressBar
                    completed={graphData?.takenCarbs}
                    maxCompleted={graphData?.carbs}
                    bgColor="#146ACC"
                    height="6px"
                    width="150px"
                    labelAlignment="outside"
                    customLabel={`${graphData?.takenCarbs}/${graphData?.carbs}`}
                    labelSize="10px"
                />
            </div>
            <div style={{ display: 'flex' }}>
                <span className="progressLabel">Fat</span>
                <ProgressBar
                    completed={graphData?.takenFat}
                    maxCompleted={graphData?.fat}
                    bgColor="#f7a240"
                    height="6px"
                    width="150px"
                    labelAlignment="outside"
                    customLabel={`${graphData?.takenFat}/${graphData?.fat}`}
                    labelSize="10px"
                />
            </div>
        </div>
    )
}
export default NutritionProgressBar
