// CONVERT CSV TO JSON using
// Not working right now
// https://csvjson.com/csv2json

const addBtn = document.getElementsByClassName('btn-green')[0]
addBtn.click()

const nameField = document.getElementsByClassName('search-box-input')[1]
nameField.select()
nameField.value = 'Pushup'

const progressionField = document.getElementsByClassName('search-box-input')[2]
progressionField.select()
progressionField.value = 'High Incline(32")'

const diffucultyRatingField =
    document.getElementsByClassName('search-box-input')[3]
diffucultyRatingField.select()
diffucultyRatingField.value = '1'

const submitBtn = document.getElementsByClassName('btn-green')[1]
submitBtn.click()
