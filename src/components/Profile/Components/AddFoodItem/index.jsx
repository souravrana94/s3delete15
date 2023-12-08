import * as React from 'react'
import Button from '../../../Common/Button'
import InputBox from '../../../Common/Form/InputBox'
import UploadFileButton from '../../../Common/Form/UploadFileButton'
import axios from '../../../../store/axios-secure'
import Loader from '../../../Common/Loader'
import { Icon } from '@iconify/react'
import './style.scss'
import { useEffect } from 'react'

const AddFoodItem = ({ item, foodInfo }) => {
    const [foodItemName, setFoodItemName] = React.useState(item ? item : '')
    const [protein, setProtein] = React.useState(foodInfo?.protein ?? '')
    const [fat, setFat] = React.useState(foodInfo?.fat ?? '')
    const [carbs, setCarbs] = React.useState(foodInfo?.carbs ?? '')
    const [calorie, setCalorie] = React.useState(foodInfo?.calories ?? '')
    const [error, setError] = React.useState({
        foodItemName: '',
        protein: '',
        fat: '',
        carbs: '',
        calorie: '',
    })
    const [isValid, setIsValid] = React.useState(true)
    const [isLoading, setIsLoading] = React.useState(false)
    const [errorMsg, setErrorMsg] = React.useState('')
    const [successMsg, setSuccessMsg] = React.useState('')
    const [currentServing, setCurrentServing] = React.useState()
    const [servingUnits, setServingUnits] = React.useState([])
    const [otherServingUnits, setOtherServingUnits] = React.useState([])
    const serving_units_list = [
        { label: 'cup', value: 'cup' },
        { label: 'glass', value: 'glass' },
        { label: 'serving', value: 'serving' },
        { label: 'tbs', value: 'tbs' },
        { label: 'tsp', value: 'tsp' },
        { label: 'bowl', value: 'bowl' },
        { label: 'slice', value: 'slice' },
        { label: 'small', value: 'small' },
        { label: 'medium', value: 'medium' },
        { label: 'large', value: 'large' },
        { label: 'piece', value: 'piece' },
        { label: 'small bowl', value: 'small bowl' },
        { label: 'large bowl', value: 'large bowl' },
        { label: 'fl oz', value: 'fl oz' },
        { label: 'oz', value: 'oz' },
    ]
    useEffect(() => {
        if (foodInfo?.serving_sizes) {
            const serving = foodInfo?.serving_sizes?.map((item) => {
                return {
                    unit: item?.unit,
                    multiplier: Math.round(item?.multiplier * 100),
                }
            })
            setServingUnits([...serving])
        }
    }, [])

    const handleServing = (value) => {
        let data = [...servingUnits]
        let containsValue = false
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                if (data[i]?.unit === value) {
                    containsValue = true
                }
            }
        }
        if (!containsValue) {
            data.push({ unit: value, multiplier: null })
        }
        setServingUnits([...data])
    }
    const handleAddOtherUnit = () => {
        let data = [...otherServingUnits]
        data.push({ unit: '', multiplier: null })
        setOtherServingUnits([...data])
    }
    const handleRemoveUnit = (item, key) => {
        if (key === 'other') {
            let data = [...otherServingUnits]
            let index = data.indexOf(item)
            data.splice(index, 1)
            setOtherServingUnits([...data])
        } else {
            let data = [...servingUnits]
            let index = data.indexOf(item)
            data.splice(index, 1)
            setServingUnits([...data])
        }
    }
    const handleChangeQuantity = (item, value) => {
        let data = [...servingUnits]
        let index = data.indexOf(item)
        if (index !== -1) {
            data[index]['multiplier'] = value
        }
        setServingUnits([...data])
    }
    const handleChangeUnit = (item, key, value) => {
        let data = [...otherServingUnits]
        let index = data.indexOf(item)
        if (index !== -1) {
            data[index][key] = value
        }
        setOtherServingUnits([...data])
    }
    useEffect(() => {
        let calorie = 4 * (Number(protein) + Number(carbs)) + 9 * Number(fat)
        setCalorie(calorie)
    }, [protein, fat, carbs])
    const handleValidation = () => {
        let formIsValid = true

        if (!foodItemName) {
            setIsValid(false)
            formIsValid = false
            setError((error) => ({
                ...error,
                foodItemName: 'Please enter Name of the Food Item',
            }))
        } else {
            setError((error) => ({ ...error, foodItemName: '' }))
        }
        if (!protein) {
            setIsValid(false)
            formIsValid = false
            setError((error) => ({
                ...error,
                protein: 'Required*',
            }))
        } else if (isNaN(protein)) {
            setIsValid(false)
            formIsValid = false
            setError((error) => ({ ...error, protein: 'Valid number only' }))
        } else {
            setError((error) => ({ ...error, protein: '' }))
        }
        if (!fat) {
            setIsValid(false)
            formIsValid = false
            setError((error) => ({
                ...error,
                fat: 'Required*',
            }))
        } else if (isNaN(fat)) {
            setIsValid(false)
            formIsValid = false
            setError((error) => ({ ...error, fat: 'Valid number only' }))
        } else {
            setError((error) => ({ ...error, fat: '' }))
        }
        if (!carbs) {
            setIsValid(false)
            formIsValid = false
            setError((error) => ({
                ...error,
                carbs: 'Required*',
            }))
        } else if (isNaN(carbs)) {
            setIsValid(false)
            formIsValid = false
            setError((error) => ({ ...error, carbs: 'Valid number only' }))
        } else {
            setError((error) => ({ ...error, carbs: '' }))
        }
        if (!calorie) {
            setIsValid(false)
            formIsValid = false
            setError((error) => ({
                ...error,
                calorie: 'Required*',
            }))
        } else if (isNaN(calorie)) {
            setIsValid(false)
            formIsValid = false
            setError((error) => ({ ...error, calorie: 'Valid number only' }))
        } else {
            setError((error) => ({ ...error, calorie: '' }))
        }
        // if (calorie && isNaN(calorie)) {
        //     setIsValid(false)
        //     formIsValid = false
        //     setError((error) => ({ ...error, calorie: 'Valid number only' }))
        // }

        return formIsValid
    }
    const clearAllFiels = () => {
        setFoodItemName('')
        setProtein('')
        setFat('')
        setCalorie('')
        setCarbs('')
    }
    const handleUpdateFood = async () => {
        const formIsValid = handleValidation()
        let serving = servingUnits?.map((item) => {
            return { unit: item?.unit, multiplier: item?.multiplier / 100 }
        })
        if (otherServingUnits) {
            const serving2 = otherServingUnits?.map((item) => {
                return { unit: item?.unit, multiplier: item?.multiplier / 100 }
            })
            serving = [...serving, ...serving2]
        }
        foodInfo['name'] = foodItemName
        foodInfo['protein'] = protein
        foodInfo['calories'] = calorie
        foodInfo['fat'] = fat
        foodInfo['carbs'] = carbs
        foodInfo['serving_sizes'] = serving
        if (formIsValid) {
            setIsLoading(true)
            try {
                const response = await axios.put('/food', foodInfo)
                setSuccessMsg('Food Item updated successfully')
                clearAllFiels()
            } catch (err) {
                console.log(err)
                setErrorMsg(" Data couldn't be saved. Please try again!")
            }
            setIsLoading(false)
        }
    }
    const handleAddExercise = async () => {
        const formIsValid = handleValidation()
        let serving = servingUnits?.map((item) => {
            return { unit: item?.unit, multiplier: item?.multiplier / 100 }
        })
        if (otherServingUnits) {
            const serving2 = otherServingUnits?.map((item) => {
                return { unit: item?.unit, multiplier: item?.multiplier / 100 }
            })
            serving = [...serving, ...serving2]
        }
        const data = {
            name: foodItemName,
            calories: calorie,
            protein: protein,
            fat: fat,
            carbs: carbs,
            serving_sizes: serving,
        }
        if (formIsValid) {
            setIsLoading(true)
            try {
                const response = await axios.post('/food', data)
                setSuccessMsg('Food Item Added successfully')
                clearAllFiels()
            } catch (err) {
                console.log(err)
                setErrorMsg(" Data couldn't be saved. Please try again!")
            }
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                setErrorMsg('')
            }, 8000)
        }
        if (successMsg) {
            setTimeout(() => {
                setSuccessMsg('')
            }, 8000)
        }
    }, [successMsg, errorMsg])

    return (
        <div>
            {item ? null : <p className="heading">Add Food Item</p>}

            <div>
                <div style={{ padding: '10px' }}>
                    <span style={{ color: 'red' }}>
                        {errorMsg ? errorMsg : null}
                    </span>
                    <span style={{ color: '#36f5c7' }}>
                        {successMsg ? successMsg : null}
                    </span>
                </div>
                <div style={{ padding: '10px' }}>
                    <span style={{ color: 'red', fontSize: '12px' }}>
                        {!isValid && error.foodItemName
                            ? error.foodItemName
                            : null}
                    </span>
                    <InputBox
                        id={'Food Item'}
                        type={'text'}
                        placeholder={'Food Item'}
                        value={foodItemName}
                        label={'Name'}
                        required={true}
                        disabled={false}
                        inputClassNames="white-border"
                        onChange={(evt) => {
                            setFoodItemName(evt.target.value)
                            setIsValid(true)
                        }}
                        divClassNames={'col-md-12'}
                        labelClass={'label'}
                        maxLength={50}
                    />
                </div>
                <div className="note">
                    Note- These entries should be per 100gm
                </div>
                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <div style={{ padding: '10px', marginRight: '20px' }}>
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            {!isValid && error.protein ? error.protein : null}
                        </span>
                        <InputBox
                            id={'Protein'}
                            type={'text'}
                            placeholder={'Protein'}
                            value={protein}
                            required={true}
                            label={'Protein'}
                            disabled={false}
                            inputClassNames="white-border"
                            onChange={(evt) => {
                                setProtein(evt.target.value)
                                setIsValid(true)
                            }}
                            divClassNames={'col-md-12'}
                            labelClass={'label'}
                            maxLength={200}
                        />
                    </div>
                    <div style={{ padding: '10px' }}>
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            {!isValid && error.fat ? error.fat : null}
                        </span>
                        <InputBox
                            id={'Fat'}
                            type={'text'}
                            placeholder={'Fat'}
                            value={fat}
                            required={true}
                            label={'Fat'}
                            disabled={false}
                            inputClassNames="white-border"
                            onChange={(evt) => {
                                setFat(evt.target.value)
                                setIsValid(true)
                            }}
                            divClassNames={'col-md-12'}
                            labelClass={'label'}
                            maxLength={200}
                        />
                    </div>
                </div>
                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <div style={{ padding: '10px', marginRight: '20px' }}>
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            {!isValid && error.carbs ? error.carbs : null}
                        </span>
                        <InputBox
                            id={'Carbs'}
                            type={'text'}
                            placeholder={'Carbs'}
                            value={carbs}
                            required={true}
                            label={'Carbs'}
                            disabled={false}
                            inputClassNames="white-border"
                            onChange={(evt) => {
                                setCarbs(evt.target.value)
                                setIsValid(true)
                            }}
                            divClassNames={'col-md-12'}
                            labelClass={'label'}
                            maxLength={200}
                        />
                    </div>
                    <div style={{ padding: '10px' }}>
                        <span style={{ color: 'red', fontSize: '12px' }}>
                            {!isValid && error.calorie ? error.calorie : null}
                        </span>
                        <InputBox
                            id={'Calorie'}
                            type={'text'}
                            placeholder={'Calorie'}
                            value={calorie}
                            required={true}
                            label={'Calorie'}
                            disabled={false}
                            inputClassNames="white-border"
                            onChange={(evt) => {
                                setCalorie(evt.target.value)
                                setIsValid(true)
                            }}
                            divClassNames={'col-md-12'}
                            labelClass={'label'}
                            maxLength={200}
                        />
                    </div>
                </div>
                <div
                    style={{
                        padding: '0 10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                    }}
                >
                    <div>
                        <label>Serving Size</label>
                        <select
                            value={currentServing}
                            onChange={(e) => {
                                setCurrentServing(e.target.value)
                                handleServing(e.target.value)
                            }}
                        >
                            {serving_units_list?.map((item, idx) => (
                                <option key={idx} value={item?.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div
                        onClick={handleAddOtherUnit}
                        className="OtherUnitButton"
                    >
                        + Other Units
                    </div>
                </div>
                {servingUnits && servingUnits?.length
                    ? servingUnits?.map((item, idx) => {
                          return (
                              <div
                                  style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: 10,
                                  }}
                              >
                                  <div style={{ minWidth: '100px' }}>
                                      {item?.unit}
                                  </div>
                                  <InputBox
                                      id={item?.unit}
                                      type={'number'}
                                      placeholder={'Enter quantity in gm'}
                                      value={item?.multiplier}
                                      required={true}
                                      label={'Quantity'}
                                      disabled={false}
                                      inputClassNames="white-border"
                                      onChange={(evt) => {
                                          handleChangeQuantity(
                                              item,
                                              evt.target.value,
                                          )
                                      }}
                                      divClassNames={'col-md-12'}
                                      labelClass={'label'}
                                      maxLength={200}
                                  />
                                  <Icon
                                      icon={'maki:cross'}
                                      color="red"
                                      onClick={() => handleRemoveUnit(item)}
                                  />
                              </div>
                          )
                      })
                    : null}
                {otherServingUnits && otherServingUnits?.length
                    ? otherServingUnits?.map((item, idx) => {
                          return (
                              <div
                                  style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                  }}
                              >
                                  <div
                                      style={{
                                          padding: '10px',
                                          marginRight: '20px',
                                      }}
                                  >
                                      <InputBox
                                          id={idx}
                                          type={'text'}
                                          placeholder={'Enter Unit'}
                                          value={item?.unit}
                                          required={true}
                                          label={'Unit'}
                                          disabled={false}
                                          inputClassNames="white-border"
                                          onChange={(evt) => {
                                              handleChangeUnit(
                                                  item,
                                                  'unit',
                                                  evt.target.value,
                                              )
                                          }}
                                          divClassNames={'col-md-12'}
                                          labelClass={'label'}
                                          maxLength={200}
                                      />
                                  </div>
                                  <div style={{ padding: 10 }}>
                                      <InputBox
                                          id={item?.unit}
                                          type={'number'}
                                          placeholder={'Enter quantity in gm'}
                                          value={item?.multiplier}
                                          required={true}
                                          label={'Quantity'}
                                          disabled={false}
                                          inputClassNames="white-border"
                                          onChange={(evt) => {
                                              handleChangeUnit(
                                                  item,
                                                  'multiplier',
                                                  evt.target.value,
                                              )
                                          }}
                                          divClassNames={'col-md-12'}
                                          labelClass={'label'}
                                          maxLength={200}
                                      />
                                  </div>
                                  <Icon
                                      icon={'maki:cross'}
                                      color="red"
                                      onClick={() =>
                                          handleRemoveUnit(item, 'other')
                                      }
                                  />
                              </div>
                          )
                      })
                    : null}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                    style={{
                        margin: '10px',
                        padding: '10px',
                        color: '#36f5c7',
                    }}
                >
                    {isLoading ? <Loader /> : null}
                </div>
                <div style={{ margin: '10px' }}>
                    <Button
                        classNames="mybutton"
                        text={'Add'}
                        color="green"
                        onClick={
                            foodInfo ? handleUpdateFood : handleAddExercise
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default AddFoodItem
