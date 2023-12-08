import React, { useEffect, useState } from 'react'
import Creatable from 'react-select/creatable'
import { Controller } from 'react-hook-form'
import PropTypes from 'prop-types'
import './index.scss'

const customStyles = {
    control: (provided) => ({
        ...provided,
        color: 'white',
        background: 'transparent',
        borderColor: 'white',
        borderRadius: 8,
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'white',
    }),
    container: (provided) => ({
        ...provided,
        color: 'black',
        background: 'transparent',
    }),
    svg: (provided) => ({
        ...provided,
        color: 'black',
        background: 'transparent',
    }),
}

const DynamicDropdown = ({
    control,
    defaultOptions = [],
    errorClassName = '',
    name,
    required = false,
    multi = false,
    canCreate = false,
    placeholder = 'Select...',
    maxCharLength = 30,
    maxOptions = 30,
    disabled = false,
    minOptions = 0,
    initialValues,
}) => {
    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ onChange, value, name, ref }) => (
                    <Creatable
                        defaultValue={[
                            initialValues?.map((ini) => {
                                return {
                                    label: ini,
                                    value: ini,
                                }
                            }),
                        ]}
                        isDisabled={disabled}
                        className={`creatable-dropdown ${errorClassName}`}
                        inputRef={ref}
                        placeholder={placeholder}
                        classNamePrefix="addl-class"
                        options={defaultOptions}
                        isMulti={multi}
                        value={
                            // TODO check why is it working
                            !canCreate && multi
                                ? defaultOptions.filter((option) => {
                                      if (
                                          value?.length > 0 &&
                                          typeof value[0] === 'object'
                                      ) {
                                          value = value?.map((v) => v.id)
                                      }
                                      return value?.includes(option.value)
                                  })
                                : defaultOptions.find((c) => c.value === value)
                        }
                        onChange={(val) => {
                            multi
                                ? onChange(val?.map((v) => v?.value))
                                : onChange(val?.value)
                        }}
                        isClearable
                        isValidNewOption={(value, values) => {
                            return (
                                canCreate &&
                                value?.length > 0 &&
                                value?.length < maxCharLength &&
                                values?.length < maxOptions
                            )
                        }}
                        isSearchable
                        styles={customStyles}
                    />
                )}
                rules={{
                    required: required,
                    validate: (value) =>
                        value?.length >= minOptions &&
                        value?.length <= maxOptions,
                }}
            />
            {required ? (
                <small className="message error">*required </small>
            ) : (
                <></>
            )}
        </>
    )
}

DynamicDropdown.propTypes = {
    defaultOptions: PropTypes.array,
    multi: PropTypes.bool,
    errorClassName: PropTypes.string,
    name: PropTypes.string,
    control: PropTypes.object,
    canCreate: PropTypes.bool,
    placeholder: PropTypes.string,
}

export default DynamicDropdown
