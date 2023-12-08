import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { socialIcons } from './Data/socialIcons'
import './index.scss'
import TemplateCard from '../Common/Form/PreviewCardContainer/TemplateCard'
import axios from '../../store/axios-order'
import { previewCardColorPalette } from '../../constants/Colors'
import Loader from '../Common/Loader'

const User = () => {
    const [isError, setIsError] = useState(false)
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [colorIndex, setColorIndex] = useState(0)
    const search = useLocation().search
    const trainerId = new URLSearchParams(search).get('trainerId')
    const message = new URLSearchParams(search).get('message')

    const fetchTrainerData = async () => {
        if (trainerId) {
            try {
                const response = await axios.get(
                    `trainercard?trainerId=${trainerId}`,
                )
                setIsError(false)
                setData(response?.data)
                setColorIndex(
                    previewCardColorPalette.findIndex(
                        (x) =>
                            x.name ==
                            response?.data?.trainerProfile?.themeColor,
                    ),
                )
            } catch (err) {
                setIsError(true)
            }
        }
        if (!trainerId && message) {
            setIsError(true)
            setLoading(false)
        }
    }

    useEffect(async () => {
        await fetchTrainerData()
        setLoading(false)
    }, [])

    const getSocialIcons = () => {
        return socialIcons.map((value, index) => (
            <a
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                href={value.link}
                className="text-green remove-a-decoration"
            >
                <img
                    className="social-icon-horizontal"
                    src={value.icon}
                    alt={value.title}
                />
            </a>
        ))
    }

    return (
        <div className="bodyLanding">
            {loading ? (
                <Loader />
            ) : (
                <div className="landingContainer">
                    <div className="row topContainer">
                        <div className="col-md-6 leftContainer">
                            <div className="logoContainer">
                                <Link className="navbar-brand" to="/">
                                    <img
                                        src="https://storage.googleapis.com/evolv-store/icons/common/EvolvLogoBlack.png"
                                        alt="Evolv Fit"
                                        className="navbar-evolv-logo"
                                        width="40px"
                                        height="40px"
                                    />
                                </Link>
                                <h3 className="companyText">EVOLV FIT</h3>
                            </div>
                            {trainerId ? (
                                <div className="d-flex flex-column">
                                    <h5 className="appText color-green mt-5">
                                        {message}
                                    </h5>
                                    <div className="m-4 mt-5">
                                        <TemplateCard
                                            name={data?.name}
                                            imgUrl={
                                                data?.trainerProfile
                                                    ?.displayPictureUrl
                                            }
                                            rating={'-'}
                                            peopleTrained={
                                                data?.trainerProfile
                                                    ?.peopleTrained
                                            }
                                            tagline={
                                                data?.trainerProfile?.tagline
                                            }
                                            colorIndex={colorIndex}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="d-flex">
                                        <h1 className="bigHeadingText">
                                            TRAIN
                                        </h1>
                                        <h1 className="bigHeadingText color-green">
                                            {' '}
                                            SMART!
                                        </h1>
                                    </div>
                                    <p className="descriptionText">
                                        Get personalized workout programs with
                                        detailed feedback on every exercise.
                                        Train at your home or gym and track your
                                        progress in one place.
                                    </p>
                                </>
                            )}

                            {isError && (
                                <p className="form-text text-danger descriptionText appText">
                                    {message}
                                </p>
                            )}
                            <div className="d-flex justify-content-center flex-column">
                                <p className="descriptionText appText d-flex">
                                    Download the app now to start training
                                </p>
                                <div className="col">
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="https://play.google.com/store/apps/details?id=com.evolvfitprivatelimited.user"
                                    >
                                        <img
                                            src="https://storage.googleapis.com/evolv-assets/MVP/UserPage/google-play-badge.png"
                                            height="70px"
                                        />
                                    </a>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="https://testflight.apple.com/join/sru5N6Fc"
                                    >
                                        <img
                                            src="https://storage.googleapis.com/evolv-assets/MVP/UserPage/AppStore.png"
                                            height="48px"
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className="socialIconContainer">
                                {getSocialIcons()}
                            </div>
                        </div>
                        <div className="col-md-6 appImageContainer">
                            <img
                                src="https://storage.googleapis.com/evolv-assets/landing/AppPicture.png"
                                alt="Img not loaded"
                                className="appImage"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default User
