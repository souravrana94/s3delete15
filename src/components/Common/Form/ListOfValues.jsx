import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import InputBox from './InputBox'
import DynamicDropdown from './DynamicDropdown'

const ListOfValues = ({
    darkTheme = false,
    register,
    control,
    helper,
    fieldKey,
    subFields,
    placeholder,
    size,
}) => {
    const [indexes, setIndexes] = useState([])
    const [counter, setCounter] = useState(0)

    const addRow = () => {
        setIndexes((prevIndexes) => [...prevIndexes, counter])
        setCounter((prevCounter) => prevCounter + 1)
    }

    const clearRows = () => {
        setIndexes([])
        setCounter(0)
    }

    useEffect(() => {
        let indexList = []
        let count = 0
        for (let index = 0; index < size; index++) {
            indexList.push(index)
            count++
        }
        setIndexes(indexList)
        setCounter(count)
    }, [])

    return (
        <>
            <div className="row">
                {indexes.map((index, k) => {
                    const fieldName = `${fieldKey}[${index}]`

                    return (
                        <div key={k} className="col-md-6">
                            <fieldset name={fieldName} key={fieldName}>
                                {subFields.map((value, idx) => {
                                    if (value.type === 'dynamic-dropdown') {
                                        return (
                                            <DynamicDropdown
                                                defaultOptions={value.options}
                                                name={`${fieldName}.${value.fieldName}`}
                                                // errorClassName={
                                                //     errors[value.fieldName]
                                                //         ? 'is-invalid'
                                                //         : ''
                                                // }
                                                control={control}
                                                multi={value.multi}
                                                canCreate={value.canCreate}
                                            />
                                        )
                                    } else {
                                        return (
                                            <div key={idx} className="p-2">
                                                <InputBox
                                                    label={value.label}
                                                    type={value.type}
                                                    placeholder={
                                                        value.placeholder
                                                    }
                                                    name={`${fieldName}.${value.fieldName}`}
                                                    refValue={register({
                                                        required:
                                                            value.required,
                                                        ...value?.validation,
                                                    })}
                                                    id={value.id}
                                                    readOnly={value.disabled}
                                                    labelClass={
                                                        value.labelClass
                                                    }
                                                    inputLabel={
                                                        value.inputLabel
                                                    }
                                                    divClassNames={
                                                        value.divClassNames
                                                    }
                                                    darkTheme={darkTheme}
                                                    inputClassNames={
                                                        value.inputClassNames
                                                    }
                                                />
                                            </div>
                                        )
                                    }
                                })}
                            </fieldset>
                        </div>
                    )
                })}
            </div>
            <button
                type="button"
                className="m-1 btn btn-primary small-btn p-2"
                onClick={addRow}
            >
                Add {placeholder}
            </button>
            <button
                type="button"
                className="m-1 btn btn-danger small-btn p-2"
                onClick={clearRows}
            >
                Clear {placeholder}
            </button>
            <small className="form-text text-muted">{helper}</small>
        </>
    )
}

ListOfValues.propTypes = {
    darkTheme: PropTypes.bool,
    register: PropTypes.func,
    control: PropTypes.func,
    helper: PropTypes.string,
    fieldKey: PropTypes.string,
    subFields: PropTypes.object,
    placeholder: PropTypes.string,
    size: PropTypes.number,
}

export default ListOfValues
