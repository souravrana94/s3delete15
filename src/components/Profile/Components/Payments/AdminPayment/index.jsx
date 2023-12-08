import React, { useEffect, useState } from 'react'
import axios from '../../../../../store/axios-secure'
import Loader from '../../../../Common/Loader'
import { Icon } from '@iconify/react'
import ProgramBar from '../PaymentRow'
import './style.scss'
const AdminPayments = () => {
    const [loading, setLoading] = useState(false)
    const [verifiedList, setVerfiedList] = useState()
    const [trainerList, setTrainerList] = useState()
    const [userList, setUserList] = useState()
    const [totalAmount, setTotalAmount] = useState()
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState()
    const [totalPages, setTotalPages] = useState()
    const [pageOffset, setPageOffset] = useState(25)
    const [sortOrder, setSortOrder] = useState(-1)
    const [sortKey, setSortKey] = useState('createdAt')
    const [searchKey, setSearchKey] = useState()
    const [searchId, setSearchId] = useState()
    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `verify/verifiedPayments?pageSize=${pageOffset}&pageNumber=${page}&sortKey=${sortKey}&sortOrder=${sortOrder}&searchKey=${searchKey}&searchId=${searchId}`,
            )
            setVerfiedList(response?.data?.payments)
            setTotalPages(Math.ceil(response?.data?.totalPayments / pageOffset))
        } catch (e) {
            console.log('eerroe ', e)
        }
        setLoading(false)
    }
    const fetchUserTrainer = async () => {
        try {
            const response = await axios.get(`verify/getUnique`)
            setTrainerList(response?.data?.trainers)
            setUserList(response?.data?.users)
        } catch (e) {
            console.log('errohjhs', e)
        }
    }
    useEffect(() => {
        let totalRecieved = 0
        if (verifiedList?.length) {
            for (let payment of verifiedList) {
                totalRecieved += payment?.amount
            }
        }
        setTotalAmount(totalRecieved)
    }, [verifiedList])
    useEffect(() => {
        fetchUserTrainer()
    }, [])
    useEffect(() => {
        fetchTransactions()
    }, [page, sortOrder, sortKey, searchId, searchKey])
    const arrayRange = (start, stop, step) =>
        Array.from(
            { length: (stop - start) / step + 1 },
            (value, index) => start + index * step,
        )
    useEffect(() => {
        if (totalPages <= 10) {
            let pagesSet = arrayRange(1, totalPages, 1)
            setPages(pagesSet)
        } else {
            let pagesSet = arrayRange(1, 10, 1)
            setPages(pagesSet)
        }
    }, [totalPages])
    useEffect(() => {
        if (totalPages > 10 && page === pages[9] && page + 1 <= totalPages) {
            pages.shift()
            pages.push(page + 1)
        }
        if (totalPages > 10 && page === pages[0] && page - 1 >= 1) {
            pages.pop()
            pages.unshift(page - 1)
        }
    }, [page])
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div>
                        {/* <p className='payment-title'>Verified Payments</p> */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                padding: '10px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <div>
                                <span className="font">Trainer: </span>
                                <select
                                    className="font"
                                    onChange={({ target: { value } }) => {
                                        setSearchId(value)
                                        setSearchKey('trainer')
                                    }}
                                >
                                    <option value="">Select Trainer</option>
                                    {trainerList?.map((trainer, idx) => (
                                        <option
                                            key={idx}
                                            value={trainer?._id}
                                            selected={
                                                searchId === trainer?._id
                                                    ? true
                                                    : false
                                            }
                                        >
                                            {trainer?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <span className="font">User: </span>
                                <select
                                    className="font"
                                    onChange={({ target: { value } }) => {
                                        setSearchId(value)
                                        setSearchKey('user')
                                    }}
                                >
                                    <option value="">Select User</option>
                                    {userList?.map((user, idx) => (
                                        <option
                                            key={idx}
                                            value={user?.userId}
                                            selected={
                                                searchId === user?.userId
                                                    ? true
                                                    : false
                                            }
                                        >
                                            {user?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="payment-container">
                        <div className="body">
                            <div className="program-types">
                                <div className="verified-header">
                                    <div>User</div>
                                    <div>Trainer</div>
                                    <div>Program</div>
                                    <div>
                                        <span style={{ padding: '5px' }}>
                                            Paid On
                                        </span>
                                        <span
                                            style={{ display: 'inline-grid' }}
                                        >
                                            <Icon
                                                icon={'akar-icons:chevron-up'}
                                                className="down-caret"
                                                onClick={() => {
                                                    setSortKey('createdAt')
                                                    setSortOrder(1)
                                                }}
                                            />
                                            <Icon
                                                icon={'akar-icons:chevron-down'}
                                                className="down-caret"
                                                onClick={() => {
                                                    setSortOrder(-1)
                                                    setSortKey('createdAt')
                                                }}
                                            />
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ padding: '5px' }}>
                                            Amount
                                        </span>
                                        <span
                                            style={{ display: 'inline-grid' }}
                                        >
                                            <Icon
                                                icon={'akar-icons:chevron-up'}
                                                className="down-caret"
                                                onClick={() => {
                                                    setSortOrder(1)
                                                    setSortKey('amount')
                                                }}
                                            />
                                            <Icon
                                                icon={'akar-icons:chevron-down'}
                                                className="down-caret"
                                                onClick={() => {
                                                    setSortOrder(-1)
                                                    setSortKey('amount')
                                                }}
                                            />
                                        </span>
                                    </div>
                                </div>
                                {verifiedList?.length > 0 ? (
                                    <div>
                                        {verifiedList?.map((payment, idx) => {
                                            return (
                                                <div>
                                                    <ProgramBar
                                                        payment={payment}
                                                        idx={idx}
                                                        verifiedList={
                                                            verifiedList
                                                        }
                                                        verified={true}
                                                    ></ProgramBar>
                                                </div>
                                            )
                                        })}
                                        <div className="total-amount">
                                            Total:- Rs. {totalAmount}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="body"
                                        style={{ textAlign: 'center' }}
                                    >
                                        No Record Found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {verifiedList ? (
                        <div class="pagination">
                            <div
                                className="inactivePage"
                                onClick={() =>
                                    setPage((prev) => {
                                        if (pages.includes(prev - 1)) {
                                            return prev - 1
                                        } else {
                                            return prev
                                        }
                                    })
                                }
                            >
                                &laquo;
                            </div>
                            {pages?.map((item, idx) => {
                                return (
                                    <div
                                        className={
                                            item === page
                                                ? 'inactivePage activePage'
                                                : 'inactivePage'
                                        }
                                        onClick={() => setPage(item)}
                                    >
                                        {item}
                                    </div>
                                )
                            })}

                            <div
                                className="inactivePage"
                                onClick={() =>
                                    setPage((prev) => {
                                        if (pages.includes(prev + 1)) {
                                            return prev + 1
                                        } else {
                                            return prev
                                        }
                                    })
                                }
                            >
                                &raquo;
                            </div>
                        </div>
                    ) : null}
                </>
            )}
        </>
    )
}
export default AdminPayments
