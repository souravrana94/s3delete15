import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from '../../../store/axios-secure'
import './index.scss'
import Loader from '../../Common/Loader'
import CycleHeader from './CycleHeader'
import DaysHeader from './DaysHeader'
import ReorderDaysHeader from './DaysHeader/reorderDaysHeader'
import DayDetails from './DayDetails'
import Button from '../../Common/Button'
import CustomModal from '../../Common/Modal'
import { getNumDaysPerWeek } from '../../../utilities/utilities'
import auth from '../../../firebase-config'
import ErrorPage from '../../Common/ErrorPage'

const Cycle = ({ clientId, setCycle }) => {
    const [askForNameModal, setAskForNameModal] = useState(false)
    const [askForNameModalMakeActive, setAskForNameModalMakeActive] =
        useState(false)
    const [modalInputDetails, setmodalInputDetails] = useState({
        name: '',
        isThisClient: false,
        makeActive: false,
        cycle: null,
    })
    const [cycleDropdown, setCycleDropdown] = useState([])
    const [selectedCycleId, setSelectedCycleId] = useState(-1)
    const [showSelectCycle, setShowSelectCycle] = useState(false)
    const [selectedCycle, setSelectedCycle] = useState({})
    const [selectedDay, setSelectedDay] = useState(0)
    const [isExerciseError, setIsExerciseError] = useState(false)
    const [exerciseErrorMessage, setExerciseErrorMessage] = useState({
        message: 'Error',
        index: 1,
    })
    const [loadingCycle, setLoadingCycle] = useState(true)
    const [errorOption, setErrorOptions] = useState(false)
    const [errorCycle, setErrorCycle] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('Could not be saved')
    const [isMakeActive, setIsMakeActive] = useState(false)
    const [isThisClient, setIsThisClient] = useState(true)
    const [clientCycle, setClientCycle] = useState(null)
    const [isModalError, setIsModalError] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [sessionThemes, setSessionThemes] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showReorderModal, setShowReorderModal] = useState(false)
    const [isGlobal, setGlobal] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const fetchCycleOptions = async (id) => {
        setSelectedCycleId(-1)
        setLoadingCycle(true)
        try {
            if (auth.currentUser.email === process.env.REACT_APP_ADMIN_MAIL) {
                setIsAdmin(true)
            }
            const response = await axios.get(
                `workoutpnp/cycles?clientId=${clientId}`,
            )
            const sessionThemesResponse = await axios.get(
                `trainers/sessions/remaining?userRef=${clientId}`,
            )
            setSessionThemes(sessionThemesResponse?.data?.sessionThemes)
            setCycleDropdown(response?.data)
            var globalCycle = response.data.globalCycles
            var allClientsCycle = response.data.allClientsCycle
            var clientSpecificCycle = response.data.clientSpecificCycle
            const allCycles = [
                ...response.data.globalCycles,
                ...response.data.allClientsCycle,
                ...response.data.clientSpecificCycle,
            ]
            setClientCycle(response?.data?.cycleRef)
            if (id == null) {
                for (const cycle of allCycles) {
                    cycle['makeActive'] = false
                    if (cycle._id == response?.data?.cycleRef) {
                        cycle.makeActive = true
                        setIsMakeActive(true)
                        setSelectedCycleId(cycle._id)
                    }
                }
                if (allCycles?.length == 1) {
                    setSelectedCycleId(allCycles[0]?._id)
                }
            } else {
                for (const cycle of allCycles) {
                    cycle['makeActive'] = false
                    if (cycle._id == response?.data?.cycleRef) {
                        cycle.makeActive = true
                    }
                }
                setSelectedCycleId(id)
            }
            setLoadingCycle(false)
            setErrorOptions(false)
        } catch (error) {
            setLoadingCycle(false)
            setErrorOptions(true)
        }
    }

    useEffect(() => {
        if (isError) {
            setTimeout(() => {
                setIsError(false)
            }, 15000)
        }
        if (isExerciseError) {
            setTimeout(() => {
                setIsExerciseError(false)
            }, 5000)
        }
        if (isSuccess) {
            setTimeout(() => {
                setIsSuccess(false)
            }, 15000)
        }
    }, [isError, isExerciseError, isSuccess])
    const isValid = () => {
        let found = false
        let names = []
        selectedCycle?.routineRefs?.forEach((routine, idx) => {
            if (
                !found &&
                !routine?.restDay &&
                routine?.sessionThemeRef == undefined
            ) {
                setSelectedDay(idx)
                setErrorMessage('Please pick session theme')
                found = true
                setIsError(true)
                return
            }
            if (!found && routine?.name == '') {
                setSelectedDay(idx)
                setErrorMessage('Please enter valid routine name')
                found = true
                setIsError(true)
                return
            }
            if (!found && !routine?.restDay) {
                names.push(routine?.name)
            }
            if (
                !found &&
                !routine?.restDay &&
                routine?.exercises?.length == 0
            ) {
                setSelectedDay(idx)
                setErrorMessage('Please add atleast one exercise')
                found = true
                setIsError(true)
                return
            }
            if (!found) {
                routine?.exercises?.forEach((exercise, index) => {
                    if (exercise?.exerciseInfoRef === '-') {
                        setExerciseErrorMessage({
                            message: 'Please enter valid exercise name',
                            index: index,
                        })
                        setSelectedDay(idx)
                        setIsError(false)
                        setIsExerciseError(true)
                        found = true
                        return
                    }
                })
            }
            if (!found) {
                routine.exercises?.forEach((exercise, index) => {
                    exercise?.exerciseSets?.map((e) => {
                        if (
                            e.suggestedWeightRange.length > 1 &&
                            e.suggestedWeightRange[0] != null &&
                            e.suggestedWeightRange[1] != null &&
                            parseInt(e.suggestedWeightRange[0]) >
                                parseInt(e.suggestedWeightRange[1])
                        ) {
                            found = true
                            setExerciseErrorMessage({
                                message:
                                    'Second value of weight cannot be less than first one',
                                index: index,
                            })
                            setIsExerciseError(true)
                            return
                        }
                        if (
                            e.suggestedRepRange.length > 1 &&
                            e.suggestedRepRange[0] != null &&
                            e.suggestedRepRange[1] != null &&
                            parseInt(e.suggestedRepRange[0]) >
                                parseInt(e.suggestedRepRange[1])
                        ) {
                            found = true
                            setExerciseErrorMessage({
                                message:
                                    'Second value of reps cannot be less than first one',
                                index: index,
                            })
                            setIsExerciseError(true)
                            return
                        }
                        if (
                            e.suggestedRIRRange.length > 1 &&
                            e.suggestedRIRRange[0] != null &&
                            e.suggestedRIRRange[1] != null &&
                            parseInt(e.suggestedRIRRange[0]) >
                                parseInt(e.suggestedRIRRange[1])
                        ) {
                            found = true
                            setExerciseErrorMessage({
                                message:
                                    'Second value of RIR cannot be less than first one',
                                index: index,
                            })
                            setIsExerciseError(true)
                            return
                        }
                    })
                })
            }
        })
        if (new Set(names).size !== names.length) {
            setErrorMessage('Routine names must be unique')
            found = true
            setIsError(true)
        }
        return found
    }
    const getSortedData = (cycleDetails) => {
        const sortedCycle = { ...cycleDetails }
        sortedCycle.routineRefs = sortedCycle?.routineRefs
            ?.sort((cr1, cr2) => cr1?.dayNumber - cr2?.dayNumber)
            .map((cr, dayNum) => {
                return {
                    ...cr,
                    exercises: cr?.exercises?.map((ce) => {
                        return {
                            ...ce,
                            exerciseSets: ce?.exerciseSets
                                ?.sort((s1, s2) => s1?.number - s2?.number)
                                .map((s, id) => {
                                    return { ...s, number: id + 1 }
                                }),
                        }
                    }),
                }
            })
        let newRoutineRefs = []
        for (let i = 0; i < sortedCycle?.routineRefs?.length; i++) {
            if (i == 0 && sortedCycle?.routineRefs[i].dayNumber != 1) {
                newRoutineRefs.push({
                    name: 'Rest Day',
                    restDay: true,
                    dayNumber: i + 1,
                    exercises: [],
                })
            } else if (
                i > 0 &&
                sortedCycle?.routineRefs[i].dayNumber -
                    sortedCycle?.routineRefs[i - 1].dayNumber !=
                    1
            ) {
                for (
                    let daysDifferenceCount = 0;
                    daysDifferenceCount <
                    sortedCycle?.routineRefs[i].dayNumber -
                        sortedCycle?.routineRefs[i - 1].dayNumber -
                        1;
                    daysDifferenceCount++
                ) {
                    newRoutineRefs.push({
                        name: 'Rest Day',
                        restDay: true,
                        dayNumber: i + 1 + daysDifferenceCount,
                        exercises: [],
                    })
                }
            }
            newRoutineRefs.push(sortedCycle?.routineRefs[i])
        }
        while (
            newRoutineRefs.length != sortedCycle?.totalRoutines &&
            newRoutineRefs.length < sortedCycle?.totalRoutines
        ) {
            newRoutineRefs.push({
                name: 'Rest Day',
                restDay: true,
                dayNumber: newRoutineRefs.length + 1,
                exercises: [],
            })
        }
        sortedCycle.routineRefs = [...newRoutineRefs]
        return sortedCycle
    }

    const fetchCycleDetails = async () => {
        if (!selectedCycleId) return
        setLoadingCycle(true)
        try {
            const sortedCycle = getSortedData(
                [
                    ...cycleDropdown.allClientsCycle,
                    ...cycleDropdown.globalCycles,
                    ...cycleDropdown.clientSpecificCycle,
                ].find((element) => element._id == selectedCycleId),
            )
            setSelectedCycle(sortedCycle)
            //if(sortedCycle)
            // if (isInUse(sortedCycle)) {
            //     setCycle(sortedCycle)
            // }
            setErrorCycle(false)
            setLoadingCycle(false)
            setShowSelectCycle(false)
        } catch (err) {
            setErrorOptions(true)

            // if (err?.response?.status !== '404') setErrorCycle(true)
            setLoadingCycle(false)
        }
    }

    useEffect(() => {
        setIsError(false)
        setIsExerciseError(false)
        if (selectedCycleId !== -1) {
            fetchCycleDetails()
        } else {
            setShowSelectCycle(true)
        }
    }, [selectedCycleId])

    useEffect(() => {
        if (selectedCycle?.userRef == null) {
            setIsThisClient(false)
        } else {
            setIsThisClient(true)
        }
        if (selectedCycle?.global) {
            setGlobal(true)
        } else {
            setGlobal(false)
        }
        setIsMakeActive(selectedCycle?.makeActive)
    }, [selectedCycle])

    useEffect(() => {
        let updatedCycle = selectedCycle
        updatedCycle.makeActive = isMakeActive
        setSelectedCycle(selectedCycle)
    }, [isMakeActive])
    useEffect(() => {
        let updatedCycle = selectedCycle
        updatedCycle.userRef = isThisClient ? clientId : null
        setSelectedCycle(selectedCycle)
    }, [isThisClient])
    useEffect(() => {
        fetchCycleOptions(null)
    }, [])

    const updateRoutine = (updatedRoutine, selectedDay) => {
        const updatedCycle = { ...selectedCycle }
        updatedCycle.routineRefs[selectedDay] = updatedRoutine
        setSelectedCycle(updatedCycle)
    }

    const addWorkout = () => {
        addDay(false)
    }

    const addRestDay = () => {
        addDay(true)
    }

    const addDay = (isRestDay) => {
        const updatedCycle = { ...selectedCycle }
        updatedCycle.routineRefs.push({
            name: isRestDay ? 'Rest Day' : 'New Routine',
            restDay: isRestDay,
            dayNumber: updatedCycle.routineRefs.length + 1,
            exercises: [],
            variants: [],
            variantType: 'Home',
            sessionThemeRef: sessionThemes[0]._id,
        })
        setSelectedCycle(updatedCycle)
    }
    const cloneDay = (idx) => {
        const updatedCycle = { ...selectedCycle }
        if (updatedCycle.routineRefs.length < 7) {
            const clonedDay = structuredClone(updatedCycle.routineRefs[idx])
            if (clonedDay.restDay) {
                addDay(true)
            } else {
                updatedCycle.routineRefs.push({
                    name: clonedDay.name + ' copy',
                    restDay: clonedDay.isRestDay,
                    dayNumber: updatedCycle.routineRefs.length + 1,
                    exercises: clonedDay.exercises,
                    sessionThemeRef: clonedDay.sessionThemeRef,
                    variants: clonedDay?.variants ?? [],
                    variantType: clonedDay?.variantType,
                })
                setSelectedCycle(updatedCycle)
            }
        }
    }

    const deleteDay = (idx) => {
        const updatedCycle = { ...selectedCycle }
        updatedCycle.routineRefs?.splice(idx, 1)
        updatedCycle.routineRefs = updatedCycle.routineRefs
            .sort((cr1, cr2) => cr1?.dayNumber - cr2?.dayNumber)
            .map((cr, dayNum) => {
                cr.dayNumber = dayNum + 1
                return cr
            })
        setSelectedDay(selectedDay - 1)
        setSelectedCycle(updatedCycle)
    }

    const isCycleNameUnique = () => {
        let found = false
        const allCycles = [
            ...cycleDropdown.globalCycles,
            ...cycleDropdown.allClientsCycle,
            ...cycleDropdown.clientSpecificCycle,
        ]
        allCycles.forEach((value) => {
            if (value?.name == modalInputDetails?.name) {
                found = true
                return
            }
        })
        return found
    }

    const setReorderedCycle = (cycleRoutines) => {
        const updatedCycle = { ...selectedCycle }
        updatedCycle.routineRefs = cycleRoutines
        setSelectedCycle(updatedCycle)
    }

    const closeReordered = () => {
        const updatedCycle = { ...selectedCycle }
        updatedCycle?.routineRefs?.forEach(function (day, ind) {
            day.dayNumber = ind + 1
        })
        setSelectedCycle(updatedCycle)
    }

    const setForAutoAssign = (p) => {
        const updatedCycle = { ...selectedCycle }
        updatedCycle.forAutoAssign = p
        console.log(updatedCycle)
        setSelectedCycle(updatedCycle)
    }
    const setGLobalCycle = async (cycle) => {
        const globalCycle = structuredClone({
            ...modalInputDetails,
            cycle: cycle,
        })
        const newCycle = {
            _id: 1,
            name: cycle.name,
            isActive: true,
            global: true,
            clientId: null,
            trainerRef: null,
            routineRefs: [...cycle.routineRefs],
            totalRoutines: cycle.totalRoutines,
        }
        newCycle.routineRefs.forEach((routine) => {
            delete routine._id
            routine?.exercises?.forEach((exercise) => {
                exercise._id = Math.random()
                exercise.exerciseComment = null
            })
        })
        let updatedCyclesOptions = cycleDropdown
        updatedCyclesOptions.globalCycles.push(newCycle)
        setCycleDropdown(updatedCyclesOptions)
        setSelectedCycleId(1)
        setIsMakeActive(modalInputDetails.makeActive)
        setIsThisClient(modalInputDetails.isThisClient)
        setGlobal(true)
        setAskForNameModal(false)
        setSelectedCycle(newCycle)
    }

    const addNewCycle = async () => {
        if (modalInputDetails?.name == '') {
            setErrorMessage('Please enter valid cycle name')
            setIsModalError(true)
            return
        }
        if (isCycleNameUnique()) {
            setErrorMessage('Please enter unique cycle name')
            setIsModalError(true)
            return
        }
        if (modalInputDetails?.cycle != null) {
            modalInputDetails?.cycle?.routineRefs?.forEach((routine) => {
                delete routine._id
                routine?.exercises?.forEach((exercise) => {
                    exercise._id = Math.random()
                })
            })
        }
        const newCycle =
            modalInputDetails.cycle === null
                ? {
                      _id: 1,
                      name: modalInputDetails?.name,
                      isActive: true,
                      global: false,
                      isThisClient: modalInputDetails?.isThisClient,
                      clientId: clientId,
                      routineRefs: [
                          {
                              sessionThemeRef: sessionThemes[0]._id,
                              variantType: 'Home',
                              dayNumber: 1,
                              exercises: [],
                              name: 'New Routine',
                              variants: [],
                          },
                      ],
                      totalRoutines: 1,
                      makeActive: modalInputDetails?.makeActive,
                      userRef: modalInputDetails.isThisClient ? clientId : null,
                  }
                : {
                      ...modalInputDetails.cycle,
                      _id: 1,
                      isActive: true,
                      global: false,
                      name: modalInputDetails?.name,
                      isThisClient: modalInputDetails?.isThisClient,
                      makeActive: modalInputDetails?.makeActive,
                      userRef: modalInputDetails.isThisClient ? clientId : null,
                      clientId: clientId,
                  }
        let updatedCyclesOptions = cycleDropdown
        if (modalInputDetails?.isThisClient) {
            updatedCyclesOptions?.clientSpecificCycle?.push(newCycle)
        } else {
            updatedCyclesOptions?.allClientsCycle?.push(newCycle)
        }
        setCycleDropdown(updatedCyclesOptions)
        setSelectedCycleId(1)
        setIsMakeActive(modalInputDetails.makeActive)
        setIsThisClient(modalInputDetails.isThisClient)
        setAskForNameModal(false)
        setSelectedCycle(newCycle)
        setAskForNameModalMakeActive(false)
    }
    // const saveCycle = async (
    //     updatedCycle,
    //     bypassIdCheck,
    //     cycleName = selectedCycle?.cycleName,
    //     setSelectedCycleValues = true,
    // ) => {
    //     if (!bypassIdCheck && !updatedCycle?.id) {
    //         setAskForNameModal(true)
    //         setmodalInputDetails(selectedCycle?.cycleName)
    //         setModalUpdatedCycleDetails(updatedCycle)
    //         return
    //     }
    //     updatedCycle.cycleName = cycleName
    //     try {
    //         setLoadingCycle(true)
    //         const response = await axios.post('workout/trainer/suggest/cycle', {
    //             clientId: clientId,
    //             workoutCycle: updatedCycle,
    //         })
    //         if (setSelectedCycleValues) {
    //             setSelectedCycle(response?.data)
    //             setSelectedCycleId(response?.data?.id)
    //         }
    //         if (isInUse(response?.data)) {
    //             setCycle(response?.data)
    //         }
    //         setLoadingCycle(false)
    //         addToCycleOptions(response?.data)
    //         return response?.data
    //     } catch (err) {
    //         setErrorCycle(true)
    //     }
    // }

    // const saveWithVisibility = async (
    //     visibility,
    //     visibilityCheckRequired = true,
    // ) => {
    //     const updatedCycle = { ...selectedCycle }
    //     if (visibilityCheckRequired && updatedCycle.visibility !== visibility) {
    //         updatedCycle.id = null
    //         updatedCycle.visibility = visibility
    //     }
    //     setSelectedCycle(updatedCycle)
    //     const response = await saveCycle(
    //         updatedCycle,
    //         false,
    //         selectedCycle?.cycleName,
    //         false,
    //     )

    //     return response
    // }

    // const saveCurrentCycle = () => {
    //     if (
    //         currentUser?.roles?.includes(ROLE_TRAINER) &&
    //         selectedCycle.visibility === VISIBILITY_WORLD
    //     ) {
    //         makeActive()
    //     } else {
    //         saveWithVisibility(null, false)
    //     }
    // }

    // const callMakeActive = async (updatedCycle) => {
    //     try {
    //         await axios.post('workout/trainer/suggest/cycle/activate', {
    //             workoutCycleId: updatedCycle?.id,
    //             workoutCycleName: updatedCycle?.cycleName,
    //             clientId: clientId,
    //         })
    //         fetchCycleOptions()
    //     } catch (err) {
    //         setErrorCycle(true)
    //     }
    // }

    // const saveThenMakeActive = async (cycleName = selectedCycle?.cycleName) => {
    //     const updatedCycle = { ...selectedCycle }
    //     updatedCycle.id = null
    //     updatedCycle.visibility = VISIBILITY_CLIENT
    //     if (
    //         currentUser?.roles?.includes(ROLE_ADMIN) ||
    //         selectedCycle.visibility != VISIBILITY_WORLD
    //     ) {
    //         saveCycle(selectedCycle)
    //     }
    //     const newCycle = await saveCycle(updatedCycle, true, cycleName, false)
    //     callMakeActive(newCycle)
    // }

    // const makeActive = () => {
    //     const updatedCycle = { ...selectedCycle }
    //     if (updatedCycle.visibility !== VISIBILITY_CLIENT) {
    //         setAskForNameModalMakeActive(true)
    //         setmodalInputDetails(selectedCycle?.cycleName)
    //     } else {
    //         // callMakeActive(updatedCycle)
    //     }
    // }
    // const setGlobal = async ()=>{
    //     selectedCycle?.global = true
    // }
    const saveCurrentCycle = async () => {
        let id = null
        selectedCycle?.routineRefs.map((routine) => {
            routine?.exercises.map((exercise) => {
                exercise.exerciseSets.map((e) => {
                    if (e?.suggestedWeightRange.length) {
                        if (
                            !e.suggestedWeightRange[1] &&
                            e.suggestedWeightRange[0]
                        ) {
                            e.suggestedWeightRange[1] =
                                e.suggestedWeightRange[0]
                        }
                    }
                    if (e?.suggestedRepRange.length) {
                        if (!e.suggestedRepRange[1] && e.suggestedRepRange[0]) {
                            e.suggestedRepRange[1] = e.suggestedRepRange[0]
                        }
                    }
                    if (e?.suggestedRIRRange.length) {
                        if (!e.suggestedRIRRange[1] && e.suggestedRIRRange[0]) {
                            e.suggestedRIRRange[1] = e.suggestedRIRRange[0]
                        }
                    }
                })
            })
        })
        // if (selectedCycle?.global) {
        //     //implement make active for global
        //     try {
        //         setLoadingCycle(true)
        //         await axios.put(`workoutpnp/cycles/${selectedCycle._id}`, {
        //             clientId: clientId,
        //         })
        //         setLoadingCycle(false)
        //         setIsExerciseError(false)
        //         setIsModalError(false)
        //         fetchCycleOptions()
        //         setIsSuccess(true)
        //         setCycle(selectedCycle)
        //     } catch (error) {
        //         setLoadingCycle(false)
        //         setErrorOptions(true)
        //     }
        //     return
        // }
        if (isValid()) {
            return
        }

        const updatedCycle = { ...selectedCycle }
        const totalRoutines = updatedCycle?.routineRefs.length
        // console.log(updatedCycle)
        const cycleToUpload = {
            ...updatedCycle,
            routineRefs: updatedCycle.routineRefs.filter(
                (element) => element?.restDay != true,
            ),
        }
        let newCycle = JSON.parse(
            JSON.stringify({
                ...updatedCycle,
                routines: cycleToUpload.routineRefs.map((element) => {
                    if (element.restDay == false) {
                        delete element.restDay
                    }
                    return element
                }),
                totalRoutines: totalRoutines,
            }),
        )
        newCycle['routineRefs'] = [...newCycle.routines]
        newCycle.global = isGlobal ? true : false
        newCycle.forAutoAssign = updatedCycle.forAutoAssign ? true : false
        newCycle?.routineRefs?.map((routine) => {
            routine?.exercises?.forEach((exercise) => {
                if (typeof exercise?._id == 'number') {
                    delete exercise?._id
                }
            })
        })
        try {
            setLoadingCycle(true)
            if (newCycle?._id == 1) {
                newCycle?.routines?.forEach((routine) => {
                    delete routine?.cycleRef
                })
                const response = await axios.post('workoutpnp/cycles', {
                    ...newCycle,
                })
                if (response && selectedCycle?.makeActive) {
                    setCycle(response?.data)
                }
                id = response?.data?._id
            } else {
                const response = await axios.put(
                    `workoutpnp/cycles/${selectedCycle._id}`,
                    {
                        routines: newCycle.routines,
                        isThisClient: isThisClient,
                        global: isGlobal,
                        totalRoutines: totalRoutines,
                        makeActive: isMakeActive,
                        clientId: clientId,
                        forAutoAssign: newCycle.forAutoAssign,
                    },
                )
                id = selectedCycle?._id
                if (response) {
                    if (response.data.cycleRef) {
                        if (selectedCycle.makeActive) {
                            setCycle(response.data?.cycleData)
                        }
                    } else setCycle(false)
                }
            }
            const response = await axios.get(
                `/workoutpnp/cycles/fetch?clientId=${clientId}`,
            )
            setCycle(response?.data)
            setLoadingCycle(false)
            setIsExerciseError(false)
            setIsModalError(false)
            fetchCycleOptions(id)
            setIsSuccess(true)
        } catch (error) {
            setLoadingCycle(false)
            setErrorOptions(true)
        }
        return
    }

    // const saveForAllCLients = async () => {
    //     const updatedCycle = { ...selectedCycle }
    //     const cycleToUpload = {
    //         ...updatedCycle,
    //         routineRefs: updatedCycle.routineRefs.filter(
    //             (element) => element?.restDay != true,
    //         ),
    //     }
    //     let newCycle = {
    //         ...updatedCycle,
    //         routines: cycleToUpload.routineRefs.map((element) => {
    //             if (element.restDay == false) {
    //                 delete element.restDay
    //             }
    //             return element
    //         }),
    //     }
    //     newCycle = {
    //         ...updatedCycle,
    //         routines: cycleToUpload.routineRefs.map((element) => {
    //             element.exercises?.map((e, idx) => {
    //                 if (e._id == -1) {
    //                     delete e._id
    //                 }
    //                 e.exerciseSets.map((ele, idx) => (ele['number'] = idx + 1))
    //             })
    //             return element
    //         }),
    //     }
    //     console.log(newCycle)
    //     const response = await axios.put(
    //         `workoutpnp/cycles/${updatedCycle._id}`,
    //         {
    //             routines: newCycle.routines,
    //         },
    //     )
    //     console.log(response)
    // }
    const deleteCycle = async () => {
        try {
            const response = await axios.put(
                `workoutpnp/cycles/${selectedCycle._id}`,
                {
                    isActive: false,
                },
            )
            setSelectedCycleId(-1)
            setShowDeleteModal(false)
            fetchCycleOptions()
        } catch (err) {
            setShowDeleteModal(false)
            if (err?.response?.status == 405) {
                setErrorMessage(
                    "This cycle is assigned to a user, so it can't be deleted.",
                )
                setIsError(true)
                return
            }
            setErrorCycle(true)
        }
    }
    return errorCycle || errorOption ? (
        <ErrorPage />
    ) : loadingCycle ? (
        <div className="cycle-modal-loading">
            <Loader />
        </div>
    ) : (
        <div
            className={
                showReorderModal
                    ? 'cycle-modal container darken'
                    : 'cycle-modal container'
            }
        >
            <CycleHeader
                numDays={getNumDaysPerWeek(selectedCycle?.routineRefs)}
                cycleDropdown={cycleDropdown}
                setSelectedCycle={setSelectedCycleId}
                selectedCycleId={selectedCycleId}
                selectedCycle={selectedCycle}
                addCycle={() => {
                    setAskForNameModal(true)
                    setAskForNameModalMakeActive(true)
                }}
                cloneCycle={() => {
                    setmodalInputDetails(
                        structuredClone({
                            ...modalInputDetails,
                            cycle: selectedCycle,
                        }),
                    )
                    setAskForNameModal(true)
                    setAskForNameModalMakeActive(true)
                }}
                showReorder={() => {
                    setShowReorderModal(true)
                }}
                setForAutoAssign={(p) => {
                    setForAutoAssign(p)
                }}
                global={selectedCycle?.global && !isAdmin ? true : false}
                isAdmin={isAdmin}
            />
            {showSelectCycle ? (
                'Please Select A Cycle'
            ) : (
                <>
                    <DaysHeader
                        cycleRoutines={selectedCycle?.routineRefs}
                        selectedDay={selectedDay}
                        setSelectedDay={setSelectedDay}
                        addWorkout={addWorkout}
                        addRestDay={addRestDay}
                        deleteDay={deleteDay}
                        cloneDay={cloneDay}
                        global={selectedCycle?.global && !isAdmin}
                    />
                    {isError ? (
                        <small className="message error">{errorMessage}</small>
                    ) : isSuccess ? (
                        <small className="message success">
                            Saved cycle successfully
                        </small>
                    ) : (
                        <></>
                    )}
                    {selectedCycle?.routineRefs?.length == 0 ||
                    selectedDay + 1 > selectedCycle?.routineRefs?.length ? (
                        <div>Please add or select routines</div>
                    ) : (
                        <DayDetails
                            sessionThemes={sessionThemes}
                            routine={selectedCycle?.routineRefs[selectedDay]}
                            setRoutine={(routine) =>
                                updateRoutine(routine, selectedDay)
                            }
                            exerciseError={isExerciseError}
                            exerciseErrorMessage={exerciseErrorMessage}
                            global={
                                selectedCycle?.global && !isAdmin ? true : false
                            }
                            isThisClient={isThisClient}
                            getComment={!isGlobal}
                        />
                    )}
                    <div className="save-button-container">
                        {/* {selectedCycle.visibility !== VISIBILITY_TRAINER && (
                        <Button
                            text={'Save for All Clients'}
                            color="green"
                            size="m"
                            onClick={() => saveForAllCLients()}
                        />
                     )} */}

                        {/* {currentUser?.roles?.includes(ROLE_ADMIN) &&
                        selectedCycle.visibility !== VISIBILITY_WORLD && (
                            <Button
                                text={'Save Global'}
                                color="green"
                                size="m"
                                onClick={() =>
                                    saveWithVisibility(
                                        VISIBILITY_WORLD,
                                        true,
                                    )
                                }
                            />
                        )} */}
                        {isGlobal ? (
                            <></>
                        ) : (
                            <div className="make-active-div">
                                <label className="container">
                                    <span className="text">Make Active</span>
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            setIsMakeActive(!isMakeActive)
                                            setGlobal(false)
                                        }}
                                        checked={isMakeActive}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                        )}

                        {!isAdmin || isGlobal ? (
                            <></>
                        ) : (
                            <div className="toggle-div">
                                <Button
                                    classNames="action-button"
                                    text={'Make Global'}
                                    color="green"
                                    size="m"
                                    onClick={() => {
                                        {
                                            setGLobalCycle(selectedCycle)
                                        }
                                    }}
                                />
                            </div>
                        )}

                        {isGlobal ? (
                            <></>
                        ) : (
                            <div className="toggle-div">
                                <div>This Client</div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            setIsThisClient(!isThisClient)
                                            setGlobal(false)
                                        }}
                                        checked={!isThisClient}
                                    />
                                    <span class="slider round"></span>
                                </label>
                                <div>All Clients</div>
                            </div>
                        )}
                        <div className="d-flex">
                            {isGlobal && !isAdmin ? (
                                <></>
                            ) : (
                                <Button
                                    classNames="action-button"
                                    text={'Save Cycle'}
                                    color="green"
                                    size="m"
                                    onClick={saveCurrentCycle}
                                />
                            )}
                            {selectedCycle._id == 1 ||
                            (isGlobal && !isAdmin) ? (
                                <></>
                            ) : (
                                <Button
                                    classNames="action-button"
                                    text={'Delete Cycle'}
                                    color="red"
                                    size="m"
                                    onClick={() => {
                                        setShowDeleteModal(true)
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </>
            )}
            <div>
                <CustomModal
                    title={'Delete Cycle'}
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    width="medium"
                    dark={true}
                >
                    <div>
                        <p>Are you sure you want to delete the Cycle?</p>
                        <div className="d-flex">
                            <Button
                                text={'Yes'}
                                color="green"
                                size="s"
                                onClick={deleteCycle}
                            />
                            <Button
                                text={'No'}
                                color="red"
                                size="s"
                                onClick={() => {
                                    setShowDeleteModal(false)
                                }}
                            />
                        </div>
                    </div>
                </CustomModal>
            </div>
            <div>
                <CustomModal
                    title={'Reorder Cycle'}
                    show={showReorderModal}
                    onHide={() => {
                        closeReordered()
                        setShowReorderModal(false)
                    }}
                    width="medium"
                    className="reorder-modal"
                    dark={true}
                >
                    <div className="reorder-div">
                        <ReorderDaysHeader
                            actualCycle={selectedCycle}
                            setShowReorderModal={setShowReorderModal}
                            setSelectedCycle={setReorderedCycle}
                        />
                    </div>
                </CustomModal>
            </div>
            <CustomModal
                title={'Set Cycle Name'}
                show={askForNameModal || askForNameModalMakeActive}
                width="medium"
                onHide={() => {
                    setAskForNameModal(false)
                    setAskForNameModalMakeActive(false)
                }}
                className="cycle-name-input-modal"
                dark={true}
            >
                <div className="cycle-input-container">
                    <input
                        type={'text'}
                        className="cycle-name-input"
                        value={modalInputDetails?.name}
                        onChange={(evt) =>
                            setmodalInputDetails({
                                ...modalInputDetails,
                                name: evt?.target?.value,
                            })
                        }
                    />

                    <Button
                        text={'Save Cycle'}
                        color="green"
                        classNames="cycle-name-submit-button"
                        size="s"
                        onClick={() => {
                            addNewCycle()
                        }}
                    />
                </div>
                <div className="modal-cycle-options">
                    <div className="make-active-div">
                        <label className="container">
                            <span className="text">Make Active</span>
                            <input
                                type="checkbox"
                                onChange={() => {
                                    setmodalInputDetails({
                                        ...modalInputDetails,
                                        makeActive:
                                            !modalInputDetails?.makeActive,
                                    })
                                }}
                                checked={modalInputDetails?.makeActive}
                            />
                            <span className="checkmark"></span>
                        </label>
                    </div>

                    <div className="toggle-div">
                        <div>This Client</div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                onChange={() => {
                                    setmodalInputDetails({
                                        ...modalInputDetails,
                                        isThisClient:
                                            !modalInputDetails?.isThisClient,
                                    })
                                }}
                                checked={!modalInputDetails?.isThisClient}
                            />
                            <span className="slider round"></span>
                        </label>
                        <div>All Clients</div>
                    </div>
                </div>
                {isModalError ? (
                    <small className="message error">{errorMessage}</small>
                ) : (
                    <></>
                )}
            </CustomModal>
        </div>
    )
}

Cycle.propTypes = { clientId: PropTypes.string, setCycle: PropTypes.func }

export default Cycle

// TODO Optimise Make Active Part. Can change server as well. Discuss
