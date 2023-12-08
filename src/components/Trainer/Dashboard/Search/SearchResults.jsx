import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from '../../../../store/axios-secure'
import Result from './Result'
import { isEmail } from 'validator'
import inviteSVG from './invite.svg'
import Loader from '../../../Common/Loader'
import Button from '../../../Common/Button'

const SearchResults = ({
    clientList,
    searchText,
    setIsSearching,
    loading,
    setLoading,
}) => {
    const [enableInvite, setEnableInvite] = useState(false)
    const [success, setIsSuccess] = useState(false)
    const [error, setError] = useState(false)

    const sendInvite = async (username, setLoading, setIsSuccess, setError) => {
        setIsSearching(true)
        setLoading(true)
        try {
            const response = await axios.post(`users/invite`, {
                email: username,
            })
            if (response?.data?.status == 200) {
                setLoading(false)
                setIsSuccess(true)
            } else {
                setLoading(false)
                setError(response?.data?.message)
            }
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
        setTimeout(() => {
            setIsSearching(false)
        }, 5000)
    }

    useEffect(() => {
        if (isEmail(searchText)) setEnableInvite(true)
        else setEnableInvite(false)
    }, [searchText])

    const disabledStyle = { background: '#1e262f' }

    const inviteUser = () => {
        sendInvite(searchText, setLoading, setIsSuccess, setError)
    }
    return (
        <div className="results">
            {/* {clientList.map((result, index) => {
                return (
                    <Result data={result} key={index} sendInvite={sendInvite} />
                )
            })} */}

            {loading ? (
                <Loader />
            ) : error ? (
                <small className="form-text text-danger">{error}</small>
            ) : success ? (
                <small className="message success">
                    Invite Sent successfully
                </small>
            ) : (
                <div className="invite-container">
                    <small>Enter a valid email to invite </small>
                    <Button
                        text={'Invite'}
                        color="green"
                        size="s"
                        disabled={enableInvite ? false : true}
                        style={enableInvite ? null : disabledStyle}
                        onClick={inviteUser}
                    />
                </div>
                // <a
                //     className="invite-btn"
                //     style={enableInvite ? null : disabledStyle}
                //     onClick={enableInvite ? null : inviteUser}
                // >
                //     <img src={inviteSVG} alt="invite" />
                //     <span>Invite</span>
                // </a>
            )}
        </div>
    )
}

SearchResults.propTypes = {
    clientList: PropTypes.array,
    searchText: PropTypes.string,
}

export default SearchResults
