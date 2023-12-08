export const getMonday = () => {
    const d = new Date()
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1)
    return new Date(d.setDate(diff)).toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
    })
}
export const getDayName = () => {
    var date = new Date()
    return date.toLocaleDateString('en-IN', { weekday: 'long' })
}

export const getRange = (attributeArrays) => {
    var min = -1
    var max = -1
    var concatenatedArray = []
    if (attributeArrays) {
        for (const element of attributeArrays) {
            if (element || element == 0) {
                if (element.length == undefined) {
                    concatenatedArray.push(element)
                } else {
                    concatenatedArray.push(
                        ...element.filter((val) => val != null),
                    )
                }
            }
        }
        if (concatenatedArray.length > 0) {
            min = Math.min.apply(null, concatenatedArray)
            max = Math.max.apply(null, concatenatedArray)
        }
    }
    const range =
        concatenatedArray.length === 0
            ? '-'
            : min === max
            ? min
            : min + '-' + max
    return range
}
export const getInputRange = (attributeArrays) => {
    var min = -1
    var max = -1
    var concatenatedArray = []
    if (attributeArrays) {
        for (const element of attributeArrays) {
            if (element || element == 0) {
                if (element.length == undefined) {
                    concatenatedArray.push(element)
                } else {
                    concatenatedArray.push(
                        ...element.filter((val) => val != null),
                    )
                }
            }
        }
        if (concatenatedArray.length > 0) {
            min = Math.min.apply(null, concatenatedArray)
            max = Math.max.apply(null, concatenatedArray)
        }
    }
    const range =
        concatenatedArray.length === 0 ? [] : min === max ? [min] : [min, max]
    return range
}

export const getWeightRange = (weights) => {
    const minWeight = Math.min(...weights)
    const maxWeight = Math.max(...weights)
    const weightRange =
        weights.length === 0
            ? '-'
            : minWeight === maxWeight
            ? minWeight + 'kg'
            : minWeight + '-' + maxWeight + 'kg'
    return weightRange
}

export const getRepsRange = (reps) => {
    const minReps = Math.min(...reps)
    const maxReps = Math.max(...reps)
    const repRange =
        reps.length === 0
            ? '-'
            : minReps === maxReps
            ? minReps
            : minReps + '-' + maxReps
    return repRange
}

export const getNumDaysPerWeek = (cycleRoutines) =>
    cycleRoutines?.reduce((sum, curr) => (!curr?.restDay ? sum + 1 : sum), 0)

export const estimatedWorkoutTime = (exercises) => {
    let time = 0
    exercises?.forEach((exercise, id) => {
        exercise?.exerciseSets?.forEach((exerciseSet, idx) => {
            if (exerciseSet?.suggestedRepRange?.length > 1) {
                time =
                    time +
                    ((exerciseSet?.suggestedRepRange[0] +
                        exerciseSet?.suggestedRepRange[1]) /
                        2) *
                        3
            } else {
                time = time + exerciseSet?.suggestedRepRange[0] * 3
            }
            if (idx != exercise?.length - 1) {
                time = time + 90
            } else {
                time = time + 120
            }
        })
    })
    return (time / 60).toFixed(1)
}
