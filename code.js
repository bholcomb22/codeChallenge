//Using moment.js to format time and numeral.js to format decimals

//restructure dataList object to array of objects
const companyArray = Object.keys(dataList).map(i =>  dataList[i])
//function to set and render to the DOM
const renderDom = (activeCompany, event) => {
  const quoteModule = document.querySelector('#quote-module')
  const modCompany = document.querySelector('.mod-company')
  const stockPrice = document.querySelector('.stock-price')
  const stockChange = document.querySelector('.change')
  const rangeData = document.querySelector('.range-data')
  const openData = document.querySelector('.open-data')
  const volumeData = document.querySelector('.volume-data')
  const marketCap = document.querySelector('.market-data')
  const asOf = document.querySelector('.as-of')
  const dataBlock = document.querySelectorAll('.data-block')
  const error = document.querySelector('.error')
  //delete company name incase of no results
  modCompany.innerHTML = ''
  //delete error message 
  error.style.display = 'none'
  //data blocks back to visible if coming from error msg
  dataBlock.forEach(item => {item.style.display = 'flex'})
  
  if (activeCompany !== undefined ) {
    //convert timestamp into moment instance
    const timeStamp = moment(new Date(activeCompany.Timestamp))
    
    if(activeCompany.Change > 0 ) {
        stockChange.style.color = 'green'
    } else if (activeCompany.Change === 0) {
        stockChange.style.color = 'black'       
    } else {
        stockChange.style.color = 'red'
    }

    modCompany.innerHTML = activeCompany.Name.toUpperCase()
    stockPrice.innerHTML = numeral(activeCompany.LastPrice).format('0,0.[00]')
    stockChange.innerHTML = `${activeCompany.Change.toFixed(2)} (${activeCompany.ChangePercent.toFixed(2)}%)`
    rangeData.innerHTML = `${numeral(activeCompany.Low).format('0,0.[00]')} - ${numeral(activeCompany.High).format('0,0.[00]')}`
    openData.innerHTML = numeral(activeCompany.Open).format('0,0.[00]')
    volumeData.innerHTML = numeral(activeCompany.Volume.toFixed(1)).format('0,0.0a').toUpperCase()
    marketCap.innerHTML = numeral(activeCompany.MarketCap).format('0,0.[0]a').toUpperCase()
    asOf.innerHTML = `As of ${timeStamp.format('LTS')}`
  } else {
    //if we hit this else there was no match - hide blocks and show error
    error.style.display = 'block'
    error.innerHTML = `No symbol matches found for ${event.target.children[0].value}. Try another symbol such as MSFT or AAPL, or use the Lookup API.`
    dataBlock.forEach(item => {item.style.display = 'none'})
  }
}
//
const updateModule = (event) => {
  let activeCompany = companyArray[0]
  
  if(event){
      activeCompany = companyArray.find((item) => {
      if (item.Status === 'SUCCESS') {
        return item.Name.toLowerCase() === event.target.children[0].value.toLowerCase() || item.Symbol.toLowerCase() === event.target.children[0].value.toLowerCase()
       }  
      })
  }
  renderDom(activeCompany, event)
}
//called once with Microsoft as default
updateModule()
//listen for submit of search form - if the string length is greater than 0 call update module
document.querySelector('form').addEventListener('submit', (e) => {
  //prevent page refresh
  e.preventDefault()
  if ( e.target.children[0].value.length > 0 ){
    updateModule(e)
    e.target.children[0].value = ''
  }
})