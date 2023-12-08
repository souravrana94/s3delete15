import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { socialIcons } from './data/socialIcons'
import { ourTeam, contactUs } from './data/footerData'

import './index.scss'
import ShadowContainer from '../../Common/ShadowContainer'
import ScrollAnimation from '../../Common/ScrollAnimation'

const EvolvLogo =
    'https://storage.googleapis.com/evolv-store/icons/common/EvolvLogoBlack.png'

const Footer = () => {
    const [inView, setInView] = useState(true)

    const addInView = () => {
        setInView(false)
        setTimeout(() => {
            setInView(true)
        }, 100)
    }

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
                    className="social-icon-horizontal social-icon-horizontal-small"
                    src={value.icon}
                    alt={value.title}
                />
            </a>
        ))
    }

    const getTeamData = () => {
        return ourTeam.map((value, index) => {
            return (
                <p key={index} className="m-0 text">
                    <a
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={value.profile}
                        className="text-green remove-a-decoration"
                    >
                        {value.name}
                    </a>
                    - {value.title}
                    <br />
                </p>
            )
        })
    }

    const getContactUs = () => {
        return contactUs.map((value, index) => {
            return (
                <p key={index} className="m-0 text">
                    {value.key}:&nbsp;
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={value.link}
                        className="text-green remove-a-decoration"
                    >
                        {value.value}
                    </a>
                    <br />
                </p>
            )
        })
    }

    const getStriped = () => {
        const horizontal = ['left', 'right']
        const vertical = ['bottom', 'middle', 'top']
        let stripes = []
        horizontal.forEach((h) => {
            vertical.forEach((v) => {
                stripes.push(
                    <div
                        className={`stripes stripes-${v} stripes-${h} ${
                            inView ? `stripes-${v}-${h}` : ''
                        }`}
                    />,
                )
            })
        })
        return stripes
    }

    // TODO Clean this. Make a proper scss file
    return (
        <ShadowContainer classNames="mt-4">
            <div className="footer-container container-fluid  pt-5 pb-2 footer-z flex-shrink-0">
                <div className="d-flex justify-content-center align-items-center footer-text ">
                    <div className="logo-tagline-container">
                        <div className="logo-icon-container px-4">
                            <img
                                className="logo-icon"
                                src={EvolvLogo}
                                alt="Evolv"
                            />
                        </div>
                        <p className="m-0 p-0 text-center">
                            Smarter Approach Towards Health
                        </p>
                    </div>
                    <ScrollAnimation
                        offset={0}
                        animateOnce={false}
                        afterAnimatedIn={addInView}
                    >
                        {getStriped()}
                    </ScrollAnimation>
                </div>
                <div className="container-lg">
                    <div className="row px-2 text-center">
                        <div className="col-12 col-sm-6 col-md-4">
                            <h6>Our Team</h6>
                            <div className="footer-text">{getTeamData()}</div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4">
                            <h6>Contact</h6>
                            <div className="footer-text">{getContactUs()}</div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 mx-auto">
                            <h6>Connect</h6>
                            <div className="footer-text d-flex justify-content-center">
                                {getSocialIcons()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 mt-4 row">
                    <div className="col-md-2">
                        <a
                            href="//www.dmca.com/Protection/Status.aspx?ID=831ea5a0-94d7-481f-b019-f39ee4311eb2"
                            title="DMCA.com Protection Status"
                            className="dmca-badge"
                        >
                            {' '}
                            <img
                                src="https://images.dmca.com/Badges/dmca_protected_11_120.png?ID=831ea5a0-94d7-481f-b019-f39ee4311eb2"
                                alt="DMCA.com Protection Status"
                            />
                        </a>{' '}
                        <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js">
                            {' '}
                        </script>
                    </div>
                    <div className="termsAndConditions col-md-6 text-left mt-3">
                        <p> © 2021 EvolvFit Pvt Ltd. All Rights Reserved</p>
                    </div>
                    <div className=" termsAndConditions col-md-4 mt-3 row ">
                        <Link className="text-green pr-3" to="/termsOfSale">
                            ⚬ Terms of Sale
                        </Link>
                        <Link className="text-green pr-3">⚬ Terms of Use</Link>
                        <Link className="text-green pr-3" to="/privacyPolicy">
                            ⚬ EvolvFit Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </ShadowContainer>
    )
}

export default Footer
