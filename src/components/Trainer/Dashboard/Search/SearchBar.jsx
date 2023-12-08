import React from 'react'
import PropTypes from 'prop-types'
import Loader from '../../../Common/Loader'

const Searchbar = ({ isFocus, onClick, searchHandler, isError }) => {
    return (
        <div
            className={`searchBar ${isError && 'is-invalid'} ${
                isFocus && 'is-focus'
            }`}
        >
            {/* <GoSearch className="search-icon" /> */}
            <input
                type="text"
                className="searchinput"
                placeholder="Search or Invite your clients for training . . ."
                onClick={() => {
                    onClick(true)
                }}
                onChange={(event) => searchHandler(event.target.value)}
            />
        </div>
    )
}

Searchbar.propTypes = {
    isFocus: PropTypes.bool,
    onClick: PropTypes.func,
    searchHandler: PropTypes.func,
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
}

export default Searchbar
