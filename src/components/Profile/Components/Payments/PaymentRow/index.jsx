import React, { useState } from 'react'
import axios from '../../../../../store/axios-secure'
import { Box, Grid, IconButton } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'
import './style.scss'
import { format } from 'date-fns'

const ProgramBar = ({
    payment,
    idx,
    paymentsList,
    awaitedList,
    verifiedList,
    setAwaitedList,
    setPaymentsList,
    sortPayments,
    verified = false,
}) => {
    const performAction = async (row, type) => {
        let actionType =
            type === 'done'
                ? 'RECEIVED'
                : type === 'undone'
                ? 'NOT_RECEIVED'
                : type === 'delete'
                ? 'DELETE'
                : 'INVALID'
        try {
            const res = await axios.post(
                `/verify/verifyPayment?orderId=${row.orderId}`,
                {
                    action: actionType,
                },
            )
            if (row.status == 'AWAITED') {
                let payments = awaitedList.filter(
                    (payment) => payment.orderId != row.orderId,
                )
                awaitedList = payments
                setAwaitedList(payments)
            }
            if (row.status == 'PENDING') {
                let payments = paymentsList.filter(
                    (payment) => payment.orderId != row.orderId,
                )
                setPaymentsList(payments)
            }
            if (actionType === 'RECEIVED') {
                row.status = 'VERIFIED'
                let payments = [...verifiedList, row]
                sortPayments(payments)
            }
            if (actionType === 'NOT_RECEIVED') {
                row.status = 'AWAITED'
                setAwaitedList([...awaitedList, row])
            }
        } catch (error) {
            console.log(error)
        }
    }
    let classname = verified ? 'verified-program-details' : 'program-details'
    return (
        <>
            <div className={classname} key={idx}>
                <div className="program-detail">
                    <div className="user-detail">
                        <div className="name">{payment.user}</div>
                        <div className="email">{payment.userEmail}</div>
                    </div>
                </div>
                <div className="program-detail">{payment.trainer}</div>
                <div className="program-detail">{payment.programName}</div>
                <div className="program-detail">
                    <div className="user-detail">
                        <div className="name">
                            {format(new Date(payment.paidOn), 'dd-MMM-yyyy')}
                        </div>
                        {format(new Date(payment.paidOn), 'dd-MMM-yyyy') !=
                            format(
                                new Date(payment.startDate),
                                'dd-MMM-yyyy',
                            ) && (
                            <div className="email">
                                {format(
                                    new Date(payment.startDate),
                                    'dd-MMM-yyyy',
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="program-detail">
                    <span>{payment.amount}</span>
                </div>

                {verified == false && (
                    <>
                        <div className="program-detail">
                            <span>
                                <IconButton
                                    onClick={() =>
                                        performAction(payment, 'done')
                                    }
                                >
                                    <CheckCircleIcon
                                        style={{
                                            color: '#36f5c7',
                                            fontSize: '28px',
                                        }}
                                    />
                                </IconButton>
                            </span>
                        </div>
                        <div className="program-detail">
                            <span>
                                <IconButton
                                    onClick={() =>
                                        performAction(payment, 'undone')
                                    }
                                >
                                    <CancelIcon
                                        style={{
                                            // color: '#36f5c7',
                                            color: 'red',
                                            fontSize: '28px',
                                        }}
                                    />
                                </IconButton>
                            </span>
                        </div>
                        <div className="program-detail">
                            <span>
                                <IconButton
                                    onClick={() =>
                                        performAction(payment, 'delete')
                                    }
                                >
                                    <DeleteIcon
                                        style={{
                                            color: '#36f5c7',
                                            fontSize: '28px',
                                        }}
                                    />
                                </IconButton>
                            </span>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default ProgramBar
