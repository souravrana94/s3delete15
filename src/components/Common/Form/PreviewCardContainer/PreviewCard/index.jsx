import React, { useState } from 'react'
import UploadFileButton from '../../UploadFileButton'
import StarRating from '../../../StarRating'
import { previewCardColorPalette } from '../../../../../constants/Colors'
import './index.scss'
import auth from '../../../../../firebase-config'
import { Icon } from '@iconify/react'

const defaultPicture =
    'https://storage.googleapis.com/evolv-assets/trainers/default.png'

const PreviewCard = ({
    value,
    idx = 0,
    disabled = false,
    register = () => {},
    setValue = () => {},
    onChange = () => {},
}) => {
    const formatter = Intl.NumberFormat('en', { notation: 'compact' })
    const { currentUser } = auth
    const [imgUrl, setImgUrl] = useState(
        value.displayPictureUrl == undefined ? null : value.displayPictureUrl,
    )
    const [errorMessage, setErrorMessage] = useState('')
    const [isError, setIsError] = useState(false)
    let color = previewCardColorPalette[idx].dark ? 'white' : 'black'
    return (
        <>
            <div
                style={{
                    backgroundColor: previewCardColorPalette[idx].themeColor,
                    color: color,
                }}
                className="preview-card-container"
            >
                <div className="left">
                    {imgUrl != null && imgUrl.length != 0 ? (
                        <>
                            {disabled ? (
                                <img
                                    className="trainer-image"
                                    src={imgUrl ?? defaultPicture}
                                    key={imgUrl}
                                    alt=""
                                />
                            ) : (
                                <>
                                    <img
                                        className="trainer-image-edit"
                                        src={imgUrl ?? defaultPicture}
                                        key={imgUrl}
                                        alt=""
                                    />
                                    <div
                                        onClick={() => {
                                            if (disabled) {
                                                return
                                            }
                                            setImgUrl(null)
                                        }}
                                        className="image-overlay"
                                    >
                                        <Icon
                                            color="black"
                                            height={30}
                                            icon={'ep:close-bold'}
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <UploadFileButton
                            disabled={disabled}
                            id={'preview-card-upload'}
                            buttonText={'Upload profile img'}
                            onChange={(e) => {
                                onChange(e)
                                setIsError(false)
                                setErrorMessage('')
                                if (
                                    !['image/png', 'image/jpeg'].includes(
                                        e.target.files[0].type,
                                    )
                                ) {
                                    setIsError(true)
                                    setErrorMessage(
                                        'Please upload a valid png or jpg file',
                                    )
                                    return ''
                                } else if (e.target.files[0].size > 5000000) {
                                    setIsError(true)
                                    setErrorMessage(
                                        'Please upload a file less than 5MB.',
                                    )
                                    return ''
                                }
                                setValue('displayPicture', e.target.files)
                                setImgUrl(
                                    URL.createObjectURL(e.target.files[0]),
                                )
                            }}
                        />
                    )}
                </div>
                <div className="right">
                    <p className="name">{currentUser?.displayName}</p>
                    <StarRating
                        size="v-small"
                        star={'4.5'}
                        edit={false}
                        align={'center'}
                        reverse
                        count={1}
                    />
                    <p className="tagline">{value.tagline}</p>
                    <p className="people-trained-text">
                        {isNaN(value.peopleTrained)
                            ? '-'
                            : formatter.format(value.peopleTrained)}
                    </p>
                    <p className="people-trained">people trained</p>
                </div>
                <input
                    type="file"
                    name={'displayPicture'}
                    ref={register}
                    style={{ display: 'none' }}
                />
            </div>
            {isError && (
                <small className="text-danger m-1">{errorMessage}</small>
            )}
        </>
    )
}

export default PreviewCard
