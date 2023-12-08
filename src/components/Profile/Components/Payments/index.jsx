import React, { useEffect, useState } from 'react'
import TrainerPaymentsPage from './TrainerSpecificPayment'
import Button from '../../../Common/Button'
import auth from '../../../../firebase-config'
import AdminPayments from './AdminPayment'

const PaymentsPage = () => {
    const [viewAll, setViewAll] = useState(false)
    return (
        <>
            {auth.currentUser.email === process.env.REACT_APP_ADMIN_MAIL ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {viewAll ? (
                        <Button
                            classNames="w-fc m-0"
                            color="green"
                            text={`View Your Transactions`}
                            onClick={() => setViewAll(false)}
                        />
                    ) : (
                        <Button
                            classNames="w-fc m-0"
                            color="green"
                            text={`View All Transactions`}
                            onClick={() => setViewAll(true)}
                        />
                    )}
                </div>
            ) : null}
            {viewAll ? <AdminPayments /> : <TrainerPaymentsPage />}
        </>
    )
}

export default PaymentsPage
