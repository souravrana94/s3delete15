import React, { useEffect, useState } from 'react'
import Button from '../../../Common/Button'
import axios from '../../../../store/axios-secure'
import './index.scss'
import ProgramsComponent from './Program'
import Loader from '../../../Common/Loader'
import AccordionComponent from '../../../Common/AccordionComponent'
const ProgramsPage = () => {
    const [programs, setPrograms] = useState([])
    const [loading, setLoading] = useState(false)
    const [disableAddButton, setDisableAddButton] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState({
        message: 'Could not be saved',
        idx: -1,
    })
    useEffect(async () => {
        setLoading(true)
        try {
            const response = await axios.get('/trainers/programs/all')
            const programsOffered =
                response?.data?.profileRef?.programOfferedRefs
            programsOffered?.forEach((program) => {
                program['editing'] = false
            })
            setPrograms(programsOffered)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }, [])
    const newProgram = async () => {
        let newProgram = {
            _id: -1,
            name: '',
            editing: true,
            highlights: ['', '', '', ''],
            description: '',
            programTypes: [
                {
                    duration: '',
                    price: '',
                    discount: '',
                },
            ],
        }
        setPrograms([...programs, newProgram])
    }
    const deleteProgram = async (idx) => {
        setLoading(true)
        let updatedPrograms = [...programs]
        if (updatedPrograms[idx]?._id != -1) {
            try {
                const response = await axios.patch(
                    `/trainers/programs/patch?programId=${updatedPrograms[idx]?._id}`,
                )
            } catch (error) {
                if (error?.response?.status == 405) {
                    setErrorMessage({
                        message:
                            "This program is assigned to a user, so it can't be deleted.",
                        idx: idx,
                    })
                    setIsError(true)
                    setLoading(false)
                    return
                }
            }
        }
        updatedPrograms?.splice(idx, 1)
        setPrograms(updatedPrograms)
        setLoading(false)
    }
    return (
        <div className="programs-container">
            <p className="heading">Programs</p>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {programs?.map((program, idx) => {
                        return (
                            <ProgramsComponent
                                programs={programs}
                                program={program}
                                deleteProgram={deleteProgram}
                                key={idx}
                                idx={idx}
                                setPrograms={(program) => {
                                    let updatedPrograms = [...programs]
                                    updatedPrograms[idx] = {
                                        ...program,
                                    }
                                    setPrograms(updatedPrograms)
                                }}
                                setDisableAddButton={setDisableAddButton}
                                isError={isError}
                                setIsError={setIsError}
                                setErrorMessage={setErrorMessage}
                                errorMessage={errorMessage}
                            />
                        )
                    })}

                    <Button
                        text={'+ Add Program'}
                        color={'green'}
                        disabled={disableAddButton}
                        classNames="add-button"
                        onClick={() => {
                            newProgram()
                        }}
                    />
                </>
            )}
        </div>
    )
}

export default ProgramsPage
