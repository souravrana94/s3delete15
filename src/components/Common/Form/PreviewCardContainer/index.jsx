import React from 'react'
import './index.scss'
import PreviewCard from './PreviewCard'
import TemplateCard from './TemplateCard'

const TempCard1 =
    'https://storage.googleapis.com/evolv-mobile/trainers/swadhintrainer.png'

const TempCard2 =
    'https://storage.googleapis.com/evolv-mobile/trainers/anasmithtrainer.png'
const PreviewCardContainer = ({ props, register, setValue }) => {
    return (
        <div className="preview-container">
            <div className="col-md-7 preview-container-left">
                <h3 className="heading">Template Cards</h3>
                <div className="template-cards-container">
                    <TemplateCard
                        name="Swadhin Saraf"
                        imgUrl={TempCard1}
                        peopleTrained={204}
                        tagline="INFS Certified"
                        colorIndex={8}
                    />
                    <TemplateCard
                        name="Ana Smith"
                        imgUrl={TempCard2}
                        peopleTrained={285}
                        tagline="Fat Loss Expert"
                        colorIndex={5}
                    />
                    {/* <img src={TempCard1} alt="no-image" />
                    <img src={TempCard2} alt="no-image" /> */}
                </div>
            </div>
            <div className="col-md-5 preview-container-right">
                <h3 className="heading">Your Card</h3>
                <div className="template-cards-container">
                    <PreviewCard
                        register={register}
                        setValue={setValue}
                        idx={props.color}
                        value={props}
                    />
                </div>
            </div>
        </div>
    )
}

export default PreviewCardContainer
