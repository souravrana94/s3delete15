import React from 'react'
import axios from '../../../../store/axios-secure'
import { useEffect } from 'react'
import { useState } from 'react'
import moment from 'moment'
import { Image } from 'react-bootstrap'
import CustomModal from '../../../Common/Modal'
import './index.scss'
import Loader from '../../../Common/Loader'

const WeightTransformation = ({ clientId }) => {
    const imageWidth = '110px'
    const imageHeight = '130px'
    const numberofRows = 3
    const [showImageModal, setShowImageModal] = useState(false)
    const [imgURL, setImgURL] = useState('')
    const [sliceIndex, setSliceIndex] = useState(numberofRows)
    const [transformationData, setTransformationData] = useState()
    const [sortOrder, setSortOrder] = useState(-1)
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `/trainers/transformations?clientId=${clientId}&sortOrder=${sortOrder}`,
            )
            console.log(response?.data)
            setTransformationData(response?.data)
        } catch (error) {
            console.log('Erroor in weight transformation ', error)
        }
        setLoading(false)
    }
    const dateFormat = (week, year) => {
        return (
            moment(
                moment()
                    .set('year', year)
                    .dayOfYear(week * 7 - 6)?._d,
            ).format('DD') +
            '-' +
            moment(
                moment()
                    .set('year', year)
                    .dayOfYear(week * 7)?._d,
            ).format('DD MMM')
        )
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="weightsTransformation">
            <div className="weightsHeader">
                <div className="weightText">Weight Transformation</div>
            </div>
            {loading ? (
                <Loader />
            ) : (
                <div className="weightScreenTransformation">
                    {transformationData?.code === 1 ? (
                        <>
                            <div className="imageRowContainer">
                                <div style={{ width: '20%' }}></div>
                                <div className="headerContainer">Front</div>
                                <div className="headerContainer">Side</div>
                                <div className="headerContainer">Back</div>
                            </div>
                            {transformationData?.message?.data
                                ?.slice(0, sliceIndex)
                                ?.map((ele, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            className="imageRowContainer"
                                        >
                                            <div style={{ width: '20%' }}>
                                                {dateFormat(ele.week, ele.year)}{' '}
                                                {ele?.year}
                                            </div>
                                            <div>
                                                {ele?.transformations?.front ? (
                                                    <Image
                                                        onClick={() => {
                                                            setShowImageModal(
                                                                true,
                                                            )
                                                            setImgURL(
                                                                ele
                                                                    ?.transformations
                                                                    ?.front,
                                                            )
                                                        }}
                                                        src={
                                                            ele?.transformations
                                                                ?.front
                                                        }
                                                        // roundedCircle
                                                        className="ImageContainer"
                                                        width={imageWidth}
                                                        height={imageHeight}
                                                    />
                                                ) : (
                                                    <div className="noImageContainer">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                {ele?.transformations?.side ? (
                                                    <Image
                                                        onClick={() => {
                                                            setShowImageModal(
                                                                true,
                                                            )
                                                            setImgURL(
                                                                ele
                                                                    ?.transformations
                                                                    ?.side,
                                                            )
                                                        }}
                                                        src={
                                                            ele?.transformations
                                                                ?.side
                                                        }
                                                        // roundedCircle
                                                        className="ImageContainer"
                                                        width={imageWidth}
                                                        height={imageHeight}
                                                    />
                                                ) : (
                                                    <div className="noImageContainer">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                {ele?.transformations?.back ? (
                                                    <Image
                                                        onClick={() => {
                                                            setShowImageModal(
                                                                true,
                                                            )
                                                            setImgURL(
                                                                ele
                                                                    ?.transformations
                                                                    ?.back,
                                                            )
                                                        }}
                                                        src={
                                                            ele?.transformations
                                                                ?.back
                                                        }
                                                        // roundedCircle
                                                        className="ImageContainer"
                                                        width={imageWidth}
                                                        height={imageHeight}
                                                    />
                                                ) : (
                                                    <div className="noImageContainer">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            {transformationData?.message?.data?.length >
                            numberofRows ? (
                                sliceIndex === numberofRows ? (
                                    <div
                                        onClick={() =>
                                            setSliceIndex(
                                                transformationData?.message
                                                    ?.data?.length ?? 1,
                                            )
                                        }
                                        className="seemoreLessButton"
                                    >
                                        See more
                                    </div>
                                ) : (
                                    <div
                                        onClick={() =>
                                            setSliceIndex(numberofRows)
                                        }
                                        className="seemoreLessButton"
                                    >
                                        See less
                                    </div>
                                )
                            ) : null}
                        </>
                    ) : (
                        <div>{transformationData?.message}</div>
                    )}
                </div>
            )}
            <CustomModal
                show={showImageModal}
                width="fullwidth"
                // title="Feedback"
                onHide={() => {
                    setShowImageModal(false)
                }}
                dark={true}
            >
                <div>
                    <img
                        src={imgURL}
                        style={{
                            padding: '5px',
                            objectFit: 'contain',
                            height: '90vh',
                            width: '100%',
                            margin: '0 auto',
                        }}
                    />
                </div>
            </CustomModal>
        </div>
    )
}

export default WeightTransformation
