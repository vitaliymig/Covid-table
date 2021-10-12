let objCovidData = {}
let tableData = []
let dataType = `world`
let lang = `en`
const currentData = new Date().toJSON().split(`T`)[0]
const dashboardTable = document.getElementById(`dashboardTable`)
const dashboardTotals = document.getElementById(`dashboardTotals`)
const dashboardTableThead = document.getElementById(`tableHead`)
const dashboardTableTbody = document.getElementById(`tableBody`)
const dashboardSearch = document.getElementById(`dashboardSearch`)
const dashboardTabs = document.getElementById(`dashboardTabs`)
const thLabel = document.getElementById(`thLabel`)
console.log(thLabel);


const translations ={
    en: {
        world: 'World'
    },
    uk: {
        world: 'Свiт'
    }
}


getData()


dashboardTabs.addEventListener(`click`, e=>{
    const currentTab = e.target.closest(`a`)
    if (currentTab) {
        const tabs = Array.from(dashboardTabs.children)
        tabs.forEach(tab => {
            if (tab !== currentTab) {
                tab.dataset.active = `false`
            }else {
                tab.dataset.active = `true`
            }
        })
        const type = currentTab.dataset.type
        dataType = type
        tableData = objCovidData[dataType]
    }
    renderTableBody(dashboardTableTbody, tableData)
})


dashboardTableThead.addEventListener(`click`, e => {
    const targetSpan = e.target.closest('span')
    if (targetSpan) {
        const tr = targetSpan.closest('tr')
        if (tr) {
            const ths = Array.from(tr.children)
            ths.forEach(th => {
                const span = th.firstElementChild
                if (span === targetSpan) {
                    span.dataset.sorting = 'true'
                    span.dataset.order *= -1
                } else {
                    span.dataset.sorting = 'false'
                    if (span.dataset.key === 'label') {
                        span.dataset.order = -1
                    } else {
                        span.dataset.order = 1
                    }
                }
            })
            const currentOrder = targetSpan.dataset.order
            const key = targetSpan.dataset.key
            if (key === 'label') {
                tableData.sort((a, b) => {
                    return a.label[lang].localeCompare(b.label[lang]) * currentOrder
                })
            } else {
                tableData.sort((a, b) => {
                    return (a[key] - b[key]) * currentOrder
                })
            }
            renderTableBody(dashboardTableTbody, tableData)
        }
    }
})


dashboardSearch.addEventListener(`submit`, event => {
    event.preventDefault()
})


dashboardSearch.addEventListener(`keyup`, event => {
    const query = event.target.value.toLowerCase().trim().split(` `).filter(word => Boolean(word))
    tableData = objCovidData[dataType].filter(dataObj => {
        return query.every(word => {
            return dataObj.label[lang].toLowerCase().includes(word)
        })
    })
    renderTableBody(dashboardTableTbody, tableData)
})


function renderTabsTotals(tabsEl,allDataObj) {
    const tabs = Array.from(tabsEl.children)
        console.log(tabs);
        tabs.forEach(tab =>{
            const type = tab.dataset.type
            tab.firstElementChild.textContent = addThousandsSeparators(allDataObj[type].map(dataObj => dataObj.confirmed).reduce((acc, num) => acc + num,0))
        })
}


function renderDashboardTotals(totalsEl, dataArr) {
    totalsEl.innerHTML = createDashboardTotals(dataArr).join(``)
}


function createDashboardTotals(dataArr) {
    const keys = ['confirmed', 'deaths', 'recovered', 'existing']
    return keys.map(key => {
        const total = dataArr.map(dataObj => dataObj[key]).reduce((acc, num) => acc + num, 0)
        const delta_total = dataArr.map(dataObj => dataObj[`delta_${key}`]).reduce((acc, num) => acc + num, 0)
        return createKeyTotals(key, total, delta_total)
    })
}


function createKeyTotals(key, total, delta_total) {
    return `<div>
    <h2>${key}:</h2>
    <div class="dashboard__totals-data ${key}-color">${addThousandsSeparators(total)}</div>
    <div class="dashboard__totals-delta ${key}-color">${displayDelta(delta_total)}</div>
  </div>`
}


function renderTableBody(tableEl, dataArr) {
    if (dataType === 'world') {
        thLabel.textContent = 'Country'
    }else if(dataType ==='ukraine')
        thLabel.textContent = 'Region'
    tableEl.innerHTML = createTableBody(dataArr).join(``)
}


function createTableBody(dataArr) {
    return dataArr.map(dataObj => createTableRow(dataObj))
}


function createTableRow(dataObj) {
    return `<tr>
        <td class="font-color">${dataObj.label[lang]}</td>
        <td class="confirmed-color"><span>${addThousandsSeparators(dataObj.confirmed)}</span><span>${displayDelta(dataObj.delta_confirmed)}</span></td>
        <td class="deaths-color"><span>${addThousandsSeparators(dataObj.deaths)}</span><span>${displayDelta(dataObj.delta_deaths)}</span></td>
        <td class="recovered-color"><span>${addThousandsSeparators(dataObj.recovered)}</span><span>${displayDelta(dataObj.delta_recovered)}</span></td>
        <td class="existing-color"><span>${addThousandsSeparators(dataObj.existing)}</span><span>${displayDelta(dataObj.delta_existing)}</span></td>
        </tr>`
}


function displayDelta(delta) {
    let displayDelta = ''
    if (delta > 0) {
        displayDelta = `&#9650; ${addThousandsSeparators(delta)}`
    } else if (delta < 0) {
        displayDelta = `&#9660; ${addThousandsSeparators(delta)}`
    } else {
        displayDelta = '-'
    }
    return displayDelta
}


function addThousandsSeparators(value) {
    const re = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g
    return `${value}`.replace(re , g1 => `${g1},`);
}


async function getData() {
    try {
        const response = await fetch(`https://api-covid19.rnbo.gov.ua/data?to=${currentData}`)
        const jsonData = await response.json()
        objCovidData = jsonData
        tableData = objCovidData[dataType]
        renderTabsTotals(dashboardTabs,objCovidData)
        renderDashboardTotals(dashboardTotals, tableData) 
        renderTableBody(dashboardTableTbody, tableData)
    } catch (e) {
        console.log(`error`);
    }
}