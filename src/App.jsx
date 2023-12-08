import React, { Suspense, useEffect, useState } from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import auth from './firebase-config'
import routes from './routes'
import axios from './store/axios-secure'
import SecureRoute from './components/Authentication/SecureRoute'
import Loader from './components/Common/Loader'
import { useAuthState } from 'react-firebase-hooks/auth'

import Navbar from './components/Structure/Navbar'
import AppContext from './store/context'

import './stylesheet/common.scss'
import 'react-datepicker/dist/react-datepicker.css'
import ErrorPage from './components/Common/ErrorPage'

const App = () => {
    const location = useLocation()
    const history = useHistory()
    const [user, loading, error] = useAuthState(auth)
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [verified, setVerified] = useState(null)
    const [profileRef, setProfileRef] = useState()
    const [profilePicture, setProfilePicture] = useState()
    const [initialClientList, setInitialClientList] = useState([])
    const [clientList, setClientList] = useState([])

    const userSettings = {
        verified: verified,
        profileRef: profileRef,
        setProfileRef: setProfileRef,
        profilePicture: profilePicture,
        initialClientList: initialClientList,
        clientList: clientList,
        setClientList: setClientList,
        setInitialClientList: setInitialClientList,
    }
    const handleTrainerRedirect = async () => {
        try {
            const response = await axios.post(`trainers/add`, {
                timezone: new Date().getTimezoneOffset(),
            })
            const profileRef = response?.data?.profileRef
            setVerified(response?.data?.isVerified)
            setProfileRef(profileRef)
            if (response?.data?.isVerified) {
                const clientDataResponse = await axios.get(
                    '/trainers/users?active=true',
                )
                let newClientList = clientDataResponse?.data
                let finalList = {
                    NoProgram: [],
                    Paused: [],
                }
                newClientList.forEach((client) => {
                    if (client?.currentProgramName && !client?.isPaused) {
                        let newGroup =
                            finalList[client.currentProgramName] || []
                        newGroup.push(client)
                        finalList[client.currentProgramName] = newGroup
                    } else if (client.isPaused) {
                        let newGroup = finalList['Paused'] || []
                        newGroup.push(client)
                        finalList['Paused'] = newGroup
                    } else {
                        let newGroup = finalList['NoProgram'] || []
                        newGroup.push(client)
                        finalList['NoProgram'] = newGroup
                    }
                })
                let pausedProgram = finalList['Paused']
                delete finalList.Paused
                finalList['Paused'] = pausedProgram
                let noProgram = finalList['NoProgram']
                delete finalList.NoProgram
                finalList['NoProgram'] = noProgram
                setInitialClientList(Object.entries(finalList))
                setClientList(Object.entries(finalList))
            }
            if (!profileRef && location.pathname !== '/trainer-onboarding') {
                history.push('/trainer-onboarding')
            } else if (
                profileRef &&
                location.pathname === '/trainer-onboarding'
            ) {
                history.push('/')
            }
        } catch (error) {
            setIsError(true)
        }
        setIsLoading(false)
    }
    useEffect(() => {
        if (user) {
            setIsLoading(true)
            setProfilePicture(user.photoURL.replace('=s96-c', '=s400-c'))
            handleTrainerRedirect()
        }
    }, [user])
    const menu = routes.map((route, index) => {
        if (route.secure) {
            return (
                <SecureRoute
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    role={route.role}
                    component={route.component}
                />
            )
        } else {
            return (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => <route.component {...props} />}
                />
            )
        }
    })

    return (
        <AppContext.Provider value={userSettings}>
            <Suspense fallback={<Loader fullscreen />}>
                {isLoading ? (
                    <Loader fullscreen />
                ) : isError ? (
                    <ErrorPage />
                ) : (
                    <>
                        {user && location.pathname != '/user' && <Navbar />}
                        <main className="main">
                            <Switch>{menu}</Switch>
                        </main>
                    </>
                )}
            </Suspense>
        </AppContext.Provider>
    )
}

export default App
