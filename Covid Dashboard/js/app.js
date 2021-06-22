let objCovidData = {};
let tableData = [];
let dataType = `ukraine`;
let lang = `en`;
const currentData = new Date().toJSON().split(`T`)[0];
const dashboardTable = document.getElementById(`dashboardTable`);
const dashboardTableThead = document.getElementById(`tableHead`);
const dashboardTableTbody = document.getElementById(`tableBody`);
const dashboardSearch = document.getElementById(`dashboardSearch`);

const tr = document.getElementById(`tr`);
const dashboardTableHeaderds = tr.querySelectorAll(`span`);

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






























dashboardSearch.addEventListener(`keyup`, (event) => {
  event.preventDefault();
  const query = event.target.value
    .toLowerCase()
    .trim()
    .split(` `)
    .filter((word) => Boolean(word));
  tableData = objCovidData[dataType].filter((dataObj) => {
    return query.every((word) => {
      return dataObj.label[lang].toLowerCase().includes(word);
    });
  });
  renderTableBody(dashboardTableTbody, tableData);
});

function renderTableBody(tableEl, dataArr) {
  tableEl.innerHTML = createTableBody(dataArr).join(``);
}

function createTableBody(dataArr) {
  return dataArr.map((dataObj) => createTableRow(dataObj));
}

function createTableRow(dataObj) {
  return `<tr>
        <td class="font-color">${dataObj.label[lang]}</td>
        <td class="yellow-color"><span>${dataObj.confirmed}</span><span>${dataObj.delta_confirmed}</span></td>
        <td class="white-color"><span>${dataObj.deaths}</span><span>${dataObj.delta_deaths}</span></td>
        <td class="green-color"><span>${dataObj.recovered}</span><span>${dataObj.delta_recovered}</span></td>
        <td class="red-color"><span>${dataObj.existing}</span><span>${dataObj.delta_existing}</span></td>
        </tr>`;
}

getData();
async function getData() {
  try {
    const response = await fetch(
      `https://api-covid19.rnbo.gov.ua/data?to=${currentData}`
    );
    const jsonData = await response.json();
    objCovidData = jsonData;
    tableData = objCovidData[dataType];
    createTableBody(tableData);
    renderTableBody(dashboardTableTbody, tableData);
  } catch (e) {
    console.log(`error`);
  }
}
