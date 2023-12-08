import React, { useState } from 'react'
import './index.scss'
import { previewCardColorPalette } from '../../../../constants/Colors'
const ColorSelector = ({
    register,
    setValue = () => {},
    initialValue = 0,
    disabled = false,
    getValue = () => {},
}) => {
    const [selectedColor, setSelectedColor] = useState(initialValue)
    const selected = (idx) => {
        setValue('color', idx)
        getValue(idx)
        setSelectedColor(idx)
    }
    return (
        <div className="color-selection-container">
            <input
                type="hidden"
                name="color"
                value={selectedColor}
                ref={register}
            />
            <label className="label">Theme color</label>
            <div className="colors-container">
                {previewCardColorPalette.map((v, idx) => {
                    return idx == selectedColor ? (
                        <div
                            key={idx}
                            className="color-option-container-selected"
                            onClick={() => {
                                if (disabled) {
                                    return
                                }
                                setSelectedColor(idx)
                            }}
                            style={{ backgroundColor: v.paletteColor }}
                        ></div>
                    ) : (
                        <div
                            key={idx}
                            className="color-option-container"
                            onClick={() => {
                                if (disabled) {
                                    return
                                }
                                selected(idx)
                            }}
                            style={{ backgroundColor: v.paletteColor }}
                        ></div>
                    )
                })}
            </div>
        </div>
    )
}

export default ColorSelector
