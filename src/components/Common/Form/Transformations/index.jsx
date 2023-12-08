import React, { useState, useEffect } from 'react'
import { TransformationCard } from './TransformationCard'
import Carousel from '../../Carousel'
import './index.scss'
import Button from '../../Button'

export const Transformations = ({
    register,
    transformations,
    setTransformations,
    breakpoints = [1400, 800],
    disabled = false,
    label = true,
    divClassName,
}) => {
    const deleteTransformation = (idx) => {
        let transformationUpdated = [...transformations]
        transformationUpdated.splice(idx, 1)
        setTransformations(
            transformationUpdated.map((tr) => {
                return { ...tr }
            }),
        )
    }
    const updateTransformation = (idx, transformation) => {
        let transformationUpdated = [...transformations]
        // transformationUpdated.splice(idx, 1)
        transformationUpdated[idx] = { ...transformation }
        setTransformations(transformationUpdated)
    }
    const updateEditing = (idx, editing) => {
        let transformationUpdated = [...transformations]
        transformationUpdated[idx].isEditing = editing
        setTransformations(transformationUpdated)
    }
    console.log(transformations)
    const newTransformation = () => {
        const transformation = {
            title: '',
            duration: '',
            beforeWeight: 0,
            afterWeight: 0,
            name: '',
            imageUrl: null,
            isEditing: true,
        }
        setTransformations([...transformations, transformation])
    }
    return (
        <div className={`col-md-12 transformations-container ${divClassName}`}>
            {label ? <label className="label">Transformations</label> : <></>}
            <input
                type="hidden"
                name="transformations"
                value={transformations}
                ref={register}
            />
            <div className="carousel-container">
                <Carousel breakpoints={[...breakpoints]}>
                    {transformations.map((value, idx) => {
                        return (
                            <TransformationCard
                                updateEditing={updateEditing}
                                key={idx}
                                props={value}
                                idx={idx}
                                disabled={disabled}
                                deleteTransformation={() =>
                                    deleteTransformation(idx)
                                }
                                updateTransformation={(transformation) =>
                                    updateTransformation(idx, transformation)
                                }
                                isEditing={value?.isEditing}
                            />
                        )
                    })}
                    {!disabled ? (
                        <div className="add-transformation-btn-container">
                            <Button
                                type="button"
                                text={'+ Add'}
                                classNames="add-transformation-btn"
                                onClick={newTransformation}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                </Carousel>
            </div>
        </div>
    )
}
