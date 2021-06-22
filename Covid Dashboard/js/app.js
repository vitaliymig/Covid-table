let objCovidData = {}
let tableData = []
let dataType = `ukraine`
let lang = `en`
const currentData = new Date().toJSON().split(`T`)[0]
const dashboardTable = document.getElementById(`dashboardTable`)
const dashboardTableThead = document.getElementById(`tableHead`)
const dashboardTableTbody = document.getElementById(`tableBody`)
const dashboardSearch = document.getElementById(`dashboardSearch`)


const tr = document.getElementById(`tr`)
const dashboardTableHeaderds = tr.querySelectorAll(`span`)
console.log(tr);
console.log(dashboardTableHeaderds);

// const dashboardTableHeaderds = dashboardTableThead.querySelectorAll(`span`)
// console.log(ter);

// e.target.classList.toggle(`header-arrow-down`)
tr.addEventListener(`click`, e=>{
    if (e.target.classList.contains(`header-arrow-up`)) {
        e.target.classList.add(`header-arrow-down`)
    }

})



// .removeClass(`header-arrow-up`).addClass('header-arrow-down')





















dashboardSearch.addEventListener(`keyup`, event=>{
    event.preventDefault()
    const query = event.target.value.toLowerCase().trim().split(` `).filter(word => Boolean(word))
    tableData = objCovidData[dataType].filter(dataObj =>{
        return  query.every(word =>{
            return dataObj.label[lang].toLowerCase().includes(word)
        })
        
    })
    renderTableBody(dashboardTableTbody, tableData)
})



function renderTableBody(tableEl, dataArr) {
    tableEl.innerHTML = createTableBody(dataArr).join(``)
}

function createTableBody(dataArr) {
    return dataArr.map(dataObj => createTableRow(dataObj))
}

function createTableRow(dataObj) {
    return `<tr>
        <td class="font-color">${dataObj.label[lang]}</td>
        <td class="yellow-color"><span>${dataObj.confirmed}</span><span>${dataObj.delta_confirmed}</span></td>
        <td class="white-color"><span>${dataObj.deaths}</span><span>${dataObj.delta_deaths}</span></td>
        <td class="green-color"><span>${dataObj.recovered}</span><span>${dataObj.delta_recovered}</span></td>
        <td class="red-color"><span>${dataObj.existing}</span><span>${dataObj.delta_existing}</span></td>
        </tr>`
}


getData()
async function getData() {
    try {
        const response = await fetch(`https://api-covid19.rnbo.gov.ua/data?to=${currentData}`)
        const jsonData = await response.json()
        objCovidData = jsonData 
        tableData = objCovidData[dataType]
        createTableBody(tableData)
        renderTableBody(dashboardTableTbody, tableData)

    } catch (e) {
        console.log(`error`);
    }
}
