// CONVERT CSV TO JSON using
// https://csvjson.com/csv2json

const data = [
    {
        Equipment: 'None',
    },
    {
        Equipment: 'Dumbell',
    },
    {
        Equipment: 'Barbell',
    },
    {
        Equipment: 'Kettlebell',
    },
    {
        Equipment: 'Pull up bar',
    },
    {
        Equipment: 'EZ Curl Bar',
    },
    {
        Equipment: 'Towel',
    },
    {
        Equipment: 'Resistance Band',
    },
    {
        Equipment: 'Skipping Rope',
    },
    {
        Equipment: 'Bagpack/Weighted Vest',
    },
    {
        Equipment: 'Plate',
    },
    {
        Equipment: 'Book',
    },
    {
        Equipment: 'Elevated Surface',
    },
    {
        Equipment: 'Any Weight',
    },
    {
        Equipment: 'Rings',
    },
    {
        Equipment: 'TRX',
    },
    {
        Equipment: 'Resistance Band+Pullup Bar',
    },
    {
        Equipment: 'Friend+Pullup Bar',
    },
    {
        Equipment: 'Bagpack/Weighted Vest+ Pullup Bar',
    },
    {
        Equipment: 'Machine',
    },
    {
        Equipment: 'Cable Machine',
    },
]

data.forEach((d, idx) => {
    setTimeout(() => {
        const addBtn = document.getElementsByClassName('btn-green')[0]
        addBtn.click()
        const input = document.getElementsByClassName('search-box-input')[1]
        input.select()
        input.value = d.Equipment
        const submitBtn = document.getElementsByClassName('btn-green')[1]
        submitBtn.click()
    }, idx * 500)
})
