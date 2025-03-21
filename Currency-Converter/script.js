document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const input = document.querySelector("#input")
  const swap = document.querySelector("#swap")
  const convert = document.querySelector("#convert")
  const fromSelect = document.querySelector("#fromSelect")
  const toSelect = document.querySelector("#toSelect")
  const fromFlag = document.querySelector("#fromFlag")
  const toFlag = document.querySelector("#toFlag")
  const resultDiv = document.querySelector("#result")
  const loadingSpinner = document.querySelector("#loading")
  const msg = document.querySelector("#msg")
  const errorMsg = document.querySelector("#errorMsg")
  const list = document.querySelector("#list")
  const toggleSidebar = document.querySelector("#toggleSidebar")
  const closeSidebar = document.querySelector("#closeSidebar")
  const sidebar = document.querySelector("#sidebar")
  const yearElement = document.querySelector("#year")

  // API Key and URL
  const apiKey = "fca_live_7zSoCBHZb6CsFEIGUoqe7XTNvY86m5ac7cCmmirr"
  const fetchURL = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}`

  // Set current year in footer
  yearElement.textContent = new Date().getFullYear()

  // Currency data
  let currencyRates = null

  // Dummy data for countryList and countryRates (replace with actual data if available)
  const countryList = {
    AUD: "AU",
    BGN: "BG",
    BRL: "BR",
    CAD: "CA",
    CHF: "CH",
    CNY: "CN",
    CZK: "CZ",
    DKK: "DK",
    EUR: "EU",
    GBP: "GB",
    HKD: "HK",
    HRK: "HR",
    HUF: "HU",
    IDR: "ID",
    ILS: "IL",
    INR: "IN",
    ISK: "IS",
    JPY: "JP",
    KRW: "KR",
    MXN: "MX",
    MYR: "MY",
    NOK: "NO",
    NZD: "NZ",
    PHP: "PH",
    PLN: "PL",
    RON: "RO",
    RUB: "RU",
    SEK: "SE",
    SGD: "SG",
    THB: "TH",
    TRY: "TR",
    USD: "US",
    ZAR: "ZA",
  }

  const countryRates = {
    AUD: "AU",
    BGN: "BG",
    BRL: "BR",
    CAD: "CA",
    CHF: "CH",
    CNY: "CN",
    CZK: "CZ",
    DKK: "DK",
    EUR: "EU",
    GBP: "GB",
    HKD: "HK",
    HRK: "HR",
    HUF: "HU",
    IDR: "ID",
    ILS: "IL",
    INR: "IN",
    ISK: "IS",
    JPY: "JP",
    KRW: "KR",
    MXN: "MX",
    MYR: "MY",
    NOK: "NO",
    NZD: "NZ",
    PHP: "PH",
    PLN: "PL",
    RON: "RO",
    RUB: "RU",
    SEK: "SE",
    SGD: "SG",
    THB: "TH",
    TRY: "TR",
    USD: "US",
    ZAR: "ZA",
  }

  // Initialize selects with currency options
  function initializeCurrencySelects() {
    for (const code in countryList) {
      // From select
      const fromOption = document.createElement("option")
      fromOption.text = `${code}`
      fromOption.value = code
      if (code === "USD") {
        fromOption.selected = true
      }
      fromSelect.appendChild(fromOption)

      // To select
      const toOption = document.createElement("option")
      toOption.text = `${code}`
      toOption.value = code
      if (code === "INR") {
        toOption.selected = true
      }
      toSelect.appendChild(toOption)
    }
  }

  // Update flag based on selected currency
  function updateFlag(select, flagImg) {
    const countryCode = countryList[select.value]
    flagImg.src = `https://flagsapi.com/${countryCode}/flat/64.png`
  }

  // Fetch currency rates
  async function fetchCurrencyRates() {
    try {
      resultDiv.classList.remove("d-none")
      loadingSpinner.style.display = "inline-block"
      msg.textContent = "Fetching latest rates..."
      errorMsg.classList.add("d-none")

      const response = await fetch(fetchURL)
      const data = await response.json()

      if (data.data) {
        currencyRates = data.data
        calculateConversion()
        updateAllCurrencies()
        return true
      } else {
        throw new Error("Invalid data format")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      resultDiv.classList.add("d-none")
      errorMsg.classList.remove("d-none")
      return false
    }
  }

  // Calculate conversion between selected currencies
  function calculateConversion() {
    if (!currencyRates) return

    const amount = Number.parseFloat(input.value) || 0
    const fromCurrency = fromSelect.value
    const toCurrency = toSelect.value

    const fromRate = currencyRates[fromCurrency]
    const toRate = currencyRates[toCurrency]

    if (fromRate && toRate) {
      const result = (amount * toRate) / fromRate
      const formattedResult = result.toFixed(4)

      loadingSpinner.style.display = "none"
      msg.textContent = `${amount} ${fromCurrency} = ${formattedResult} ${toCurrency}`
      resultDiv.classList.remove("d-none")
    }
  }

  // Update all currency conversions in sidebar
  function updateAllCurrencies() {
    if (!currencyRates) return

    list.innerHTML = ""
    const amount = Number.parseFloat(input.value) || 0
    const fromCurrency = fromSelect.value
    const fromRate = currencyRates[fromCurrency]

    for (const currency in countryRates) {
      if (countryRates[currency]) {
        const toRate = currencyRates[currency]
        const result = (amount * toRate) / fromRate
        const formattedResult = result.toFixed(4)

        const listItem = document.createElement("li")
        listItem.className = "list-group-item d-flex justify-content-between align-items-center"

        const flagSpan = document.createElement("span")
        flagSpan.className = "d-flex align-items-center"

        const flag = document.createElement("img")
        flag.src = `https://flagsapi.com/${countryList[currency]}/flat/64.png`
        flag.alt = currency
        flag.className = "currency-flag me-2"

        flagSpan.appendChild(flag)
        flagSpan.appendChild(document.createTextNode(currency))

        const valueSpan = document.createElement("span")
        valueSpan.className = "badge bg-primary rounded-pill"
        valueSpan.textContent = formattedResult

        listItem.appendChild(flagSpan)
        listItem.appendChild(valueSpan)
        list.appendChild(listItem)
      }
    }
  }

  // Swap currencies
  function swapCurrencies() {
    const tempValue = fromSelect.value
    fromSelect.value = toSelect.value
    toSelect.value = tempValue

    updateFlag(fromSelect, fromFlag)
    updateFlag(toSelect, toFlag)

    if (currencyRates) {
      calculateConversion()
    }
  }

  // Toggle sidebar on mobile
  function toggleSidebarVisibility() {
    sidebar.classList.toggle("show")
  }

  // Event Listeners
  initializeCurrencySelects()

  // Currency select change events
  fromSelect.addEventListener("change", function () {
    updateFlag(this, fromFlag)
    if (currencyRates) calculateConversion()
  })

  toSelect.addEventListener("change", function () {
    updateFlag(this, toFlag)
    if (currencyRates) calculateConversion()
  })

  // Input change event
  input.addEventListener("input", () => {
    if (currencyRates) {
      calculateConversion()
      updateAllCurrencies()
    }
  })

  // Swap button click
  swap.addEventListener("click", swapCurrencies)

  // Convert button click
  convert.addEventListener("click", fetchCurrencyRates)

  // Sidebar toggle for mobile
  toggleSidebar.addEventListener("click", toggleSidebarVisibility)
  closeSidebar.addEventListener("click", toggleSidebarVisibility)

  // Initial fetch on page load
  fetchCurrencyRates()
})

