import React from 'react'
import { Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Support from '../../Profile/Components/Support'
import './index.scss'
const SupportPage = () => {
    return (
        <>
            <div className="support-div">
                <Support />
            </div>
        </>
    )
}

export default SupportPage
