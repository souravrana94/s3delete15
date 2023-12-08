import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Loader from '../../../Common/Loader'

const Result = ({ data, sendInvite }) => {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState()

    // TODO once the request is sent. Make sure the user cannot send it again, until he refreshes.

    return (
        <div className="result row">
            {isSuccess ? (
                'Invite Sent Successfully'
            ) : error ? (
                'Unable send an invite at the moment'
            ) : loading ? (
                <Loader />
            ) : (
                <>
                    {/* <img
                        className="col-1 rounded-circle pfp"
                        src={data.pfp}
                        alt="pfp"
                    /> */}
                    <div className="col-12 row result-content">
                        <span className="col">{data.name}</span>
                        {/* <span className="col-5">{data.email}</span> */}
                        <span
                            onClick={() =>
                                sendInvite(
                                    data?.username,
                                    setLoading,
                                    setIsSuccess,
                                    setError,
                                )
                            }
                            className="col-2 add-btn"
                        >
                            Add
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}

Result.propTypes = {
    data: PropTypes.object,
    sendInvite: PropTypes.func,
}

export default Result
