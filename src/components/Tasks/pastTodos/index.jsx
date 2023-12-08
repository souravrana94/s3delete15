import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from '../../../store/axios-secure'
import './index.scss'
import Loader from '../../Common/Loader'
import Todos from '../todos'

const PastTodos = ({ clientId }) => {
    // const data = [
    //     {
    //         date: '2023-06-01T10:00:00.000Z',
    //         isCompleted: true,
    //         userRef: '1234354fr444444',
    //         lists: [
    //             {
    //                 category: 'Training',
    //                 items: [
    //                     { item: 'Finish Workout', isChecked: true },
    //                     { item: 'Move fast', isChecked: true },
    //                 ],
    //             },
    //             {
    //                 category: 'Movement',
    //                 items: [
    //                     { item: 'Finish Steps', isChecked: true },
    //                     { item: 'Jog for 5mins', isChecked: true },
    //                 ],
    //             },
    //             {
    //                 category: 'Lifestyle',
    //                 items: [
    //                     { item: 'Add Weight', isChecked: true },
    //                     { item: 'Drink water ', isChecked: true },
    //                 ],
    //             },
    //             {
    //                 category: 'Miscellaneous',
    //                 items: [],
    //             },
    //         ],
    //     },
    //     {
    //         date: '2023-05-31T10:00:00.000Z',
    //         isCompleted: true,
    //         userRef: '1234354fr444444',
    //         lists: [
    //             {
    //                 category: 'Training',
    //                 items: [
    //                     { item: 'Finish Workout', isChecked: true },
    //                     { item: 'Move fast', isChecked: true },
    //                 ],
    //             },
    //             {
    //                 category: 'Movement',
    //                 items: [
    //                     { item: 'Finish Steps', isChecked: true },
    //                     { item: 'Jog for 5mins', isChecked: true },
    //                 ],
    //             },
    //             {
    //                 category: 'Lifestyle',
    //                 items: [
    //                     { item: 'Add Weight', isChecked: true },
    //                     { item: 'Drink 5 liters of water ', isChecked: true },
    //                 ],
    //             },
    //             {
    //                 category: 'Miscellaneous',
    //                 items: [{ item: 'Buy dumbells ', isChecked: true }],
    //             },
    //         ],
    //     },
    //     {
    //         date: '2023-05-30T10:00:00.000Z',
    //         isCompleted: false,
    //         userRef: '1234354fr444444',
    //         lists: [
    //             {
    //                 category: 'Training',
    //                 items: [
    //                     { item: 'Finish Workout', isChecked: true },
    //                     { item: 'Move fast', isChecked: true },
    //                 ],
    //             },
    //             {
    //                 category: 'Movement',
    //                 items: [
    //                     { item: 'Jog for 10mins', isChecked: true },
    //                     { item: 'Finish Steps', isChecked: true },
    //                     { item: 'Jog for 5mins', isChecked: true },
    //                 ],
    //             },
    //             {
    //                 category: 'Lifestyle',
    //                 items: [
    //                     { item: 'Add Weight', isChecked: true },
    //                     { item: 'Move ', isChecked: false },
    //                 ],
    //             },
    //             {
    //                 category: 'Miscellaneous',
    //                 items: [
    //                     { item: 'Buy dumbells ', isChecked: false },
    //                     { item: 'Order something ', isChecked: true },
    //                 ],
    //             },
    //         ],
    //     },
    // ]
    const [loading, setLoading] = useState(true)
    const [todos, setTodos] = useState([])
    const fetchData = async () => {
        try {
            const response = await axios.get('/trainers/pastTasks', {
                params: { clientId: clientId },
            })
            setTodos(response.data)
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => fetchData(), [])

    return (
        <>
            <div className="past-title">Past Tasks</div>
            {loading ? <Loader /> : <Todos todos={todos} past={true} />}
        </>
    )
}

export default PastTodos
