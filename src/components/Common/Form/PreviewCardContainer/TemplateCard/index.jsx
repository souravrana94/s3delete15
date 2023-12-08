import React, { useState } from 'react'
import UploadFileButton from '../../UploadFileButton'
import StarRating from '../../../StarRating'
import { previewCardColorPalette } from '../../../../../constants/Colors'
import './index.scss'

const defaultPicture =
    'https://storage.googleapis.com/evolv-assets/trainers/default.png'

const TemplateCard = ({
    name,
    imgUrl,
    tagline,
    colorIndex,
    peopleTrained,
    rating = 4.5,
}) => {
    let color = previewCardColorPalette[colorIndex].dark ? 'white' : 'black'
    return (
        <div
            style={{
                backgroundColor: previewCardColorPalette[colorIndex].themeColor,
                color: color,
            }}
            className="template-card-container"
        >
            <div className="left">
                <img
                    className="trainer-image"
                    src={imgUrl ?? defaultPicture}
                    alt=""
                />
            </div>
            <div className="right">
                <p className="name">{name}</p>
                <StarRating
                    size="v-small"
                    star={rating}
                    edit={false}
                    align={'center'}
                    reverse
                    count={1}
                />
                <p className="tagline">{tagline}</p>
                <p className="people-trained-text">{peopleTrained}</p>
                <p className="people-trained">people trained</p>
            </div>
        </div>
    )
}

export default TemplateCard
