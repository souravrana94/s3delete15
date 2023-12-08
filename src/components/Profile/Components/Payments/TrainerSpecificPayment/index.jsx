import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import './style.scss'
import axios from '../../../../../store/axios-secure'
import { Box, Grid, IconButton } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'
import ProgramBar from '../PaymentRow/index'
import Button from '../../../../Common/Button'
import auth from '../../../../../firebase-config'
import { Icon } from '@iconify/react'
import Loader from '../../../../Common/Loader'

const TrainerPaymentsPage = () => {
    const [paymentsList, setPaymentList] = useState([])
    const [awaitedList, setAwaitedList] = useState([])
    const [verifiedList, setVerfiedList] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [pages, setPages] = useState()
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState()
    const [sortOrder, setSortOrder] = useState(-1)
    const [sortKey, setSortKey] = useState('createdAt')
    const [pageOffset, setPageOffset] = useState(20)
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const getAllPayments = async () => {
        setLoading(true)
        try {
            let res = await axios.get(
                `/verify/getUnverifiedPayments?pageSize=${pageOffset}&pageNumber=${page}&sortKey=${sortKey}&sortOrder=${sortOrder}`,
            )
            let data = res.data
            setTotalPages(Math.ceil(data?.totalPayments / pageOffset))
            let unverifiedPayments = data?.payments?.filter(
                (e) => e.status == 'PENDING',
            )
            setPaymentList(unverifiedPayments)
            let awaitedPayments = data?.payments?.filter(
                (e) => e.status == 'AWAITED',
            )
            setAwaitedList(awaitedPayments)
            const verifiedPayments = data?.payments?.filter(
                (e) => e.status == 'VERIFIED',
            )
            sortPayments(verifiedPayments)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }
    const sortPayments = (payments) => {
        // payments.sort((a, b) => {
        //     if (a.paidOn < b.paidOn) {
        //         return 1
        //     } else {
        //         return -1
        //     }
        // })
        let totalRecieved = 0
        for (let payment of payments) {
            totalRecieved += payment.amount
        }
        setTotalAmount(totalRecieved)
        setVerfiedList(payments)
    }
    useEffect(() => {
        getAllPayments()
    }, [page, sortKey, sortOrder])
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
    return loading ? (
        <Loader />
    ) : (
        <>
            <div className="programs-container">
                <div>
                    <p className="payment-title">Unverified Payments</p>
                </div>
                <div className="payment-container">
                    <div className="body">
                        <div className="program-types">
                            {paymentsList.length > 0 ||
                            awaitedList.length > 0 ? (
                                <div className="header">
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
                                    <div>Paid</div>
                                    <div>Unpaid</div>
                                    <div>Action</div>
                                </div>
                            ) : (
                                <div
                                    className="body"
                                    style={{ textAlign: 'center' }}
                                >
                                    No Record Found
                                </div>
                            )}
                            {
                                paymentsList.length > 0 ? (
                                    <>
                                        <p className="payment-title">New</p>

                                        <div>
                                            {paymentsList?.map(
                                                (payment, idx) => {
                                                    return (
                                                        <div>
                                                            <ProgramBar
                                                                payment={
                                                                    payment
                                                                }
                                                                idx={idx}
                                                                paymentsList={
                                                                    paymentsList
                                                                }
                                                                awaitedList={
                                                                    awaitedList
                                                                }
                                                                verifiedList={
                                                                    verifiedList
                                                                }
                                                                setPaymentsList={(
                                                                    payments,
                                                                ) =>
                                                                    setPaymentList(
                                                                        payments,
                                                                    )
                                                                }
                                                                setAwaitedList={(
                                                                    payments,
                                                                ) =>
                                                                    setAwaitedList(
                                                                        payments,
                                                                    )
                                                                }
                                                                sortPayments={(
                                                                    payments,
                                                                ) =>
                                                                    sortPayments(
                                                                        payments,
                                                                    )
                                                                }
                                                                verified={false}
                                                            ></ProgramBar>
                                                        </div>
                                                    )
                                                },
                                            )}
                                        </div>
                                    </>
                                ) : null
                                // (
                                //     <div
                                //         className="body"
                                //         style={{ textAlign: 'center' }}
                                //     >
                                //         No Record Found
                                //     </div>
                                // )
                            }
                            {awaitedList.length > 0 ? (
                                <>
                                    <p className="payment-title">Awaited</p>

                                    <div>
                                        {awaitedList?.map((payment, idx) => {
                                            return (
                                                <div>
                                                    <ProgramBar
                                                        payment={payment}
                                                        idx={idx}
                                                        paymentsList={
                                                            paymentsList
                                                        }
                                                        awaitedList={
                                                            awaitedList
                                                        }
                                                        verifiedList={
                                                            verifiedList
                                                        }
                                                        setPaymentsList={(
                                                            payments,
                                                        ) =>
                                                            setPaymentList(
                                                                payments,
                                                            )
                                                        }
                                                        setAwaitedList={(
                                                            payments,
                                                        ) =>
                                                            setAwaitedList(
                                                                payments,
                                                            )
                                                        }
                                                        sortPayments={(
                                                            payments,
                                                        ) =>
                                                            sortPayments(
                                                                payments,
                                                            )
                                                        }
                                                        verified={false}
                                                    ></ProgramBar>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div>
                    <p className="payment-title">Verified Payments</p>
                </div>
                <div className="payment-container">
                    <div className="body">
                        <div className="program-types">
                            {verifiedList?.length > 0 ? (
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
                            ) : (
                                <div
                                    className="body"
                                    style={{ textAlign: 'center' }}
                                >
                                    No Record Found
                                </div>
                            )}
                            {verifiedList.length > 0 ? (
                                <div>
                                    {verifiedList?.map((payment, idx) => {
                                        return (
                                            <div>
                                                <ProgramBar
                                                    payment={payment}
                                                    idx={idx}
                                                    paymentsList={paymentsList}
                                                    awaitedList={awaitedList}
                                                    verifiedList={verifiedList}
                                                    setPaymentsList={(
                                                        payments,
                                                    ) =>
                                                        setPaymentList(payments)
                                                    }
                                                    setAwaitedList={(
                                                        payments,
                                                    ) =>
                                                        setAwaitedList(payments)
                                                    }
                                                    setVerfiedList={(
                                                        payments,
                                                    ) =>
                                                        setVerfiedList(payments)
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
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            {paymentsList || awaitedList || verifiedList ? (
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
    )
}

export default TrainerPaymentsPage
