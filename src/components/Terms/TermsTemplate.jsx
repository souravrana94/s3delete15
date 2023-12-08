import React, { useEffect } from 'react'

const TermsTemplate = ({ content, title }) => {
    useEffect(() => {
        document.getElementById('terms-of-sale').innerHTML = content
    }, [])

    return (
        <div className="container my-5">
            <h3 className="mb-5">{title}</h3>
            <span id="terms-of-sale"></span>
        </div>
    )
}

export default TermsTemplate
