import React from 'react'
import { VictoryPie, VictoryLabel, VictoryTooltip } from 'victory'

const PieChart = ({ protein, fat, carbs, calories, renderScreen = 'card' }) => {
    const sampleData = [
        { x: 'Protein', y: protein },
        { x: 'Carbs', y: carbs },
        { x: 'Fat', y: fat },
    ]

    const calorie = (9 * fat + 4 * (carbs + protein)).toFixed(1)
    const dimension = renderScreen === 'card' ? 80 : 350
    const dimensionX = 80
    const dimensionY = 130
    // const dimensionCycle=400;
    return (
        <>
            {renderScreen === 'card' ? (
                <svg width={dimensionY} height={dimensionX}>
                    <text
                        x="31%"
                        y="53%"
                        textAnchor="middle"
                        stroke="white"
                        strokeWidth="1px"
                        dy=".1em"
                    >
                        {calories}
                    </text>
                    <VictoryPie
                        data={sampleData}
                        standalone={false}
                        colorScale={[
                            'tomato',
                            'gold',
                            'cyan',
                            'orange',
                            'gold',
                        ]}
                        innerRadius={24}
                        radius={30}
                        domainPadding={0}
                        padding={0}
                        width={dimensionX}
                        height={dimensionX}
                        // labelRadius={({ innerRadius }) => innerRadius + 15 }
                        // labelComponent={<VictoryLabel textAnchor="middle" style={[{fill: 'white', fontSize: '10px'}]}/>}
                        labels={({ datum }) => ''}
                    />
                    <circle
                        cx={dimensionY / 1.6}
                        cy={dimensionX / 3}
                        r="3"
                        fill="tomato"
                    />
                    <text
                        x="70%"
                        y={dimensionX / 2.8}
                        fill="white"
                        fontSize="10px"
                    >
                        P: {sampleData[0].y}
                    </text>
                    <circle
                        cx={dimensionY / 1.6}
                        cy={dimensionX / 2}
                        r="3"
                        fill="gold"
                    />
                    <text
                        x="70%"
                        y={dimensionX / 1.9}
                        fill="white"
                        fontSize="10px"
                    >
                        C: {sampleData[1].y}
                    </text>
                    <circle
                        cx={dimensionY / 1.6}
                        cy={dimensionX / 1.5}
                        r="3"
                        fill="cyan"
                    />
                    <text
                        x="70%"
                        y={dimensionX / 1.4}
                        fill="white"
                        fontSize="10px"
                    >
                        F: {sampleData[2].y}
                    </text>
                </svg>
            ) : (
                <svg width={dimension} height={dimension}>
                    <text
                        x="50%"
                        y="49%"
                        textAnchor="middle"
                        stroke="white"
                        strokeWidth="1px"
                        dy=".1em"
                    >
                        Calorie
                    </text>
                    <text
                        x="50%"
                        y="53%"
                        textAnchor="middle"
                        stroke="white"
                        strokeWidth="1px"
                        dy=".1em"
                    >
                        {calories}
                    </text>
                    <VictoryPie
                        data={sampleData}
                        standalone={false}
                        colorScale={[
                            'tomato',
                            'cyan',
                            'yellow',
                            'orange',
                            'navy',
                        ]}
                        innerRadius={35}
                        radius={50}
                        domainPadding={0}
                        // labelRadius={({ innerRadius }) => innerRadius + 20}
                        padding={0}
                        width={dimension}
                        height={dimension}
                        // labelComponent={
                        //     <VictoryLabel
                        //         style={[{ fill: 'white', padding: '5px' }]}
                        //     />
                        // }
                        labels={({ datum }) => ``}
                    />
                    <circle
                        cx={dimension / 2.5}
                        cy={dimension / 1.32}
                        r="5"
                        fill="tomato"
                    />
                    <text
                        x="45%"
                        y={dimension / 1.3}
                        fill="white"
                        fontSize="12px"
                    >
                        Protein: {sampleData[0]?.y}
                    </text>
                    <circle
                        cx={dimension / 2.5}
                        cy={dimension / 1.21}
                        r="5"
                        fill="cyan"
                    />
                    <text
                        x="45%"
                        y={dimension / 1.2}
                        fill="white"
                        fontSize="12px"
                    >
                        Carbs: {sampleData[1]?.y}
                    </text>
                    <circle
                        cx={dimension / 2.5}
                        cy={dimension / 1.115}
                        r="5"
                        fill="yellow"
                    />
                    <text
                        x="45%"
                        y={dimension / 1.1}
                        fill="white"
                        fontSize="12px"
                    >
                        Fat: {sampleData[2]?.y}
                    </text>
                </svg>
            )}
        </>
    )
}
export default PieChart
