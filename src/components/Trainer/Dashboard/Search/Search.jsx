import React, { useEffect, useState } from 'react'
import Searchbar from './SearchBar'
import SearchResults from './SearchResults'
import axios from '../../../../store/axios-secure'
import './index.scss'
import { useContext } from 'react'
import AppContext from '../../../../store/context'

const Search = () => {
    const [isSearching, setIsSearching] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const { clientList, setClientList, initialClientList } =
        useContext(AppContext)
    const searchClient = (text) => {
        const list = JSON.parse(JSON.stringify(initialClientList))
        const newList = list.filter((item) => {
            let newClients = item[1]?.filter((client) => {
                return (
                    client?.email?.includes(text.toLowerCase()) ||
                    client?.name?.toLowerCase()?.includes(text.toLowerCase())
                )
            })
            item[1] = newClients
            if (newClients.length > 0) {
                return true
            }
            return false
        })
        setClientList(newList)
    }
    const searchHandler = (text = '') => {
        setSearchText(text)
        if (text == '') {
            setClientList(initialClientList)
            return
        }
        searchClient(text)
    }

    return (
        <div
            className="search sticky-top"
            style={isSearching ? null : { boxShadow: 'none' }}
            onMouseLeave={() => {
                if (!loading) {
                    setIsSearching(false)
                }
            }}
            onMouseEnter={() => {
                setIsSearching(true)
            }}
        >
            <Searchbar
                isError={error}
                onClick={() => setIsSearching(true)}
                isFocus={isSearching}
                searchHandler={searchHandler}
            />
            {isSearching ? (
                <SearchResults
                    loading={loading}
                    setLoading={setLoading}
                    setIsSearching={setIsSearching}
                    clientList={clientList}
                    searchText={searchText}
                />
            ) : null}
        </div>
    )
}

export default Search
