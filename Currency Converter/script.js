const apiKeyCountries = COUNTRIES_API_KEY;//replace with your actual API key for countries API
const countriesApiEndpointForFirstFetch = `https://api.restcountries.com/countries/v5?response_fields=names.common,currencies,flag.emoji&limit=100&offset=0&api-key=${apiKeyCountries}&pretty=1`;
const countriesApiEndpointForSecondFetch = `https://api.restcountries.com/countries/v5?response_fields=names.common,currencies,flag.emoji&limit=100&offset=100&api-key=${apiKeyCountries}&pretty=1`;
const countriesApiEndpointForThirdFetch = `https://api.restcountries.com/countries/v5?response_fields=names.common,currencies,flag.emoji&limit=100&offset=200&api-key=${apiKeyCountries}&pretty=1`;

const apiKeyCurrency = CURRENCY_API_KEY;//replace with your actual API key for currency conversion
const currencyApiEndpoint = `https://v6.exchangerate-api.com/v6/${apiKeyCurrency}/pair/`;

let countries;
let fromCountryCode;
let toCountryCode;

const errorLabel = document.getElementById("error-label");
const resultLabel = document.getElementById("result-label");

const fromCountries = document.getElementById("from-countries");
const toCountries = document.getElementById("to-countries");

const amountInput = document.getElementById("amount-input");
const convertButton = document.getElementById("convert-button");

// Function to fetch country details and populate the dropdowns
async function getCountryDetails(){
    try{
        const savedCountries = localStorage.getItem("countries");

        if(savedCountries){
            countries = JSON.parse(savedCountries);
            addOptions(countries);
            return;
        }

        const [fetch1, fetch2, fetch3] = await Promise.all([
            fetch(countriesApiEndpointForFirstFetch),
            fetch(countriesApiEndpointForSecondFetch),
            fetch(countriesApiEndpointForThirdFetch)
        ]);

        if(!fetch1.ok || !fetch2.ok || !fetch3.ok){
            throw new Error("Failed to fetch country details");
        }

        const data1 = await fetch1.json();
        const data2 = await fetch2.json();
        const data3 = await fetch3.json();

        const { data: { objects: countries1 } } = data1;
        const { data: { objects: countries2 } } = data2;
        const { data: { objects: countries3 } } = data3;

        countries = [...countries1, ...countries2, ...countries3]

        localStorage.setItem("countries", JSON.stringify(countries));
        addOptions(countries);
        
    }catch(message){
        console.error(message);
        errorLabel.textContent = "Failed to fetch country details.";
        errorLabel.hidden = false;
    }
}

// Function to convert currency
async function convertCurrency(fromCurrency, toCurrency, amount){
    try{
        const response = await fetch(`${currencyApiEndpoint}${fromCurrency}/${toCurrency}/${amount}`);

        if(!response.ok){
            throw new Error("Failed to convert currency");
        }

        const data = await response.json();

        if (data.result !== "success") {
            throw new Error("Conversion failed");
        }

        resultLabel.textContent = `${amount} ${fromCurrency} = ${data.conversion_result} ${toCurrency}`;
        resultLabel.hidden = false;

    }catch(message){
        console.error(message);
        errorLabel.textContent = "Failed to convert currency.";
        errorLabel.hidden = false;
    }
}

// Function to add options to the dropdowns
const addOptions = (countries) =>{
    countries.forEach(country => {

        if(country.currencies?.[0]?.code){
            let option1 = document.createElement('option');
            option1.value = country.currencies[0].code;
            option1.textContent = `${country.flag.emoji} ${country.currencies[0].code} - ${country.names.common}`;
            fromCountries.append(option1);
        
            let option2 = document.createElement('option');
            option2.value = country.currencies[0].code;
            option2.textContent = `${country.flag.emoji} ${country.currencies[0].code} - ${country.names.common}`;
            toCountries.append(option2);
        }
    });

    fromCountryCode = fromCountries.value;
    toCountryCode = toCountries.value;
}

// Event listener for fromCountries dropdown change
fromCountries.addEventListener("change", (event) => {
    fromCountryCode = event.target.value;
    errorLabel.hidden = true;
    resultLabel.hidden = true;
});

// Event listener for toCountries dropdown change
toCountries.addEventListener("change", (event) => {
    toCountryCode = event.target.value;
    errorLabel.hidden = true;
    resultLabel.hidden = true;
});

// Event listener for amount input change(last error is hidden when input is changed)
amountInput.addEventListener("input", () => {
    errorLabel.hidden = true;
});

// Event listener for convert button click
convertButton.addEventListener("click", () => {
    //checking if both currencies are selected
    if(!fromCountryCode || !toCountryCode){
        errorLabel.textContent = "Please select both currencies.";
        errorLabel.hidden = false;
        return;
    }
    //checking if the amount is valid
    if(!amountInput.value || isNaN(amountInput.value) || parseFloat(amountInput.value) <= 0){
        errorLabel.textContent = "Please enter a valid amount.";
        errorLabel.hidden = false;
        return;
    }
    errorLabel.hidden = true;
    
    const amount = parseFloat(amountInput.value);
    convertCurrency(fromCountryCode, toCountryCode, amount);
});


getCountryDetails();
