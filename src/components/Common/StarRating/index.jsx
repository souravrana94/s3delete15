import React from 'react'
import ReactStars from 'react-rating-stars-component'
import PropTypes from 'prop-types'
import './index.scss'

const HalfStar =
    'https://storage.googleapis.com/evolv-store/icons/store/halfStar.svg'
const FullStar =
    'https://storage.googleapis.com/evolv-store/icons/store/star.svg'
const EmptyStar =
    'https://storage.googleapis.com/evolv-store/icons/store/emptyStar.svg'

const StarRating = ({
    star = '0',
    reverse = false,
    size = 'small',
    edit = false,
    isHalf = true,
    showNumber = true,
    refValue,
    align = 'left',
    ...props
}) => {
    const starSize =
        size === 'v-small'
            ? 12
            : size === 'small'
            ? 18
            : size === 'normal'
            ? 20
            : 40

    const items = [
        showNumber ? (
            <span key="0" className={`star-text star-text-${size}`}>
                {star}
            </span>
        ) : (
            ''
        ),
        <ReactStars
            key={1}
            ref={refValue}
            count={5}
            edit={edit}
            value={star === null ? 0 : parseFloat(star)}
            size={starSize}
            isHalf={isHalf}
            emptyIcon={<img src={EmptyStar} alt="0.0" />}
            halfIcon={<img src={HalfStar} alt="0.5" />}
            fullIcon={<img src={FullStar} alt="1.0" />}
            activeColor="#38CC9E"
            {...props}
        />,
    ]

    return (
        <div className={`star-container ${align}-align`}>
            {reverse ? items.reverse() : items}
        </div>
    )
}

StarRating.propTypes = {
    star: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reverse: PropTypes.bool,
    size: PropTypes.string,
    edit: PropTypes.bool,
    showNumber: PropTypes.bool,
    refValue: PropTypes.object,
    isHalf: PropTypes.bool,
    align: PropTypes.string,
}

export default StarRating
