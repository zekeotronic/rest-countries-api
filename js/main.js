const themeChooser = document.getElementById('theme-chooser');
const theme = document.getElementById('theme');
const themeText = document.getElementById('theme-text');
const themeIcon = document.getElementById('theme-icon');
const searchIcon = document.getElementById('search-icon');
const backIcon = document.getElementById('back-icon');
const backButton = document.getElementById('back-button');
const backText = document.getElementById('back-text');
const countries = document.getElementById('countries-wrapper');
const regionsSelect = document.getElementById('regions-select');
const searchInput = document.getElementById('search-input')
const singleCountry = document.getElementById('single-country');
const singleCountryFlag = document.getElementById('single-country-flag');

const darkMode = './css/dark.css';
const lightMode = './css/light.css';
const moon = './assets/moon.svg';
const sun = './assets/sun.svg';
let countryCards;

const codeMap = {}

const icons = {
  back: {
    light: './assets/back.svg',
    dark: './assets/back-dark.svg',
  },
  down: {
    light: './assets/down.svg',
    dark: './assets/down-dark.svg',
  },
  up: {
    light: './assets/up.svg',
    dark: './assets/up-dark.svg',
  },
  search: {
    light: './assets/search.svg',
    dark: './assets/search-dark.svg',
  }
};

checkForDarkMode();
themeChooser.addEventListener('click', toggleDarkMode);

function toggleDarkMode() {
  if (theme.getAttribute('href') ===  darkMode) {
    theme.href =  lightMode;
    themeText.textContent = 'Dark Mode';
    themeIcon.src = moon
    searchIcon.src = icons.search.light;
    backIcon.src = icons.back.light;
  } else {
    theme.href = darkMode;
    themeText.textContent = 'Light Mode';
    themeIcon.src = sun
    searchIcon.src = icons.search.dark;
    backIcon.src = icons.back.dark;
  }
}

function checkForDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    toggleDarkMode()
  }
}

function createCountyCard(country) {
  const card = document.createElement('div');
  card.classList.add('country-card');
  card.id = country.name.common;
  card.setAttribute('data-country', country.name.common);
  card.innerHTML = `
    <div class="flag" data-country="${country.name.common}">
      <img src="${country.flags.svg}" alt="${country.flag.alt}" data-country="${country.name.common}">
    </div>
    <div class="country-info" data-country="${country.name.common}">
      <h2 data-country="${country.name.common}">${country.name.common}</h2>
      <p data-country="${country.name.common}"><strong data-country="${country.name.common}">Population:</strong> ${country.population.toLocaleString('en-us')}</p>
      <p data-country="${country.name.common}"><strong data-country="${country.name.common}">Region:</strong> ${country.region}</p>
      <p data-country="${country.name.common}"><strong data-country="${country.name.common}">Capital:</strong> ${country.capital}</p>
    </div>
  `;
  return card;
}

function clearCountries() {
  while (countries.firstChild) {
    countries.removeChild(countries.firstChild);
  }
}

function findCountry() {
  const value = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll('.country-card');
  cards.forEach(card => {
    const countryName = card.querySelector('h2').textContent.toLowerCase();
    if (countryName.includes(value)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  })
}

function getCountryCards() {
  const cards = document.querySelectorAll('.country-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const country = e.target.getAttribute('data-country');
      window.scrollTo(0, 0);
      singleCountry.classList.remove('hidden');
      backButton.setAttribute('data-country', country);
      backText.setAttribute('data-country', country);;
      backIcon.setAttribute('data-country', country);
      getCountryByName(country).then(data => {
        singleCountryFlag.src = data[0].flags.svg;
        console.log(data[0]);
      })
    });
  })

}

async function getAllCountries() {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const data = await response.json();
  return data;
}

async function getCountriesByRegion(region) {
  const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
  const data = await response.json();
  return data;
}

async function getCountryByName(name) {
  const response = await fetch(`https://restcountries.com/v3.1/name/${name.toLowerCase()}`);
  const data = await response.json();
  return data;
}

getAllCountries().then(data => {
  data.forEach(country => {
    countries.appendChild(createCountyCard(country));
    codeMap[country.cca3] = country.name.common;
  });
  countryCards = getCountryCards();
})

regionsSelect.addEventListener('change', (e) => {
  clearCountries();
  const region = e.target.value;
  if (region === '') {
    getAllCountries().then(data => {
      data.forEach(country => {
        countries.appendChild(createCountyCard(country));
      });
      countryCards = getCountryCards();
    })
  } else {
    getCountriesByRegion(region).then(data => {
      data.forEach(country => {
        countries.appendChild(createCountyCard(country));
      });
      countryCards = getCountryCards();
    })
  }
})



searchInput.addEventListener('input', findCountry);

backButton.addEventListener('click', (e) => {
  const country = e.target.getAttribute('data-country');
  singleCountry.classList.add('hidden');
  const y = document.getElementById(country).getBoundingClientRect().top;
  window.scrollTo(0, y);
})

// getCountryCards().forEach(card => {
//   card.addEventListener('click', (e) => {
//     console.log(e.target.getAttribute('data-country'));
//   });
//   console.log(card);
// });

