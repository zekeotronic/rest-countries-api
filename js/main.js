const themeChooser = document.getElementById('theme-chooser');
const theme = document.getElementById('theme');
const themeText = document.getElementById('theme-text');
const themeIcon = document.getElementById('theme-icon');
const searchIcon = document.getElementById('search-icon');
const countries = document.getElementById('countries-wrapper');
const regionsSelect = document.getElementById('regions-select');
const searchInput = document.getElementById('search-input')
const darkMode = './css/dark.css';
const lightMode = './css/light.css';
const moon = './assets/moon.svg';
const sun = './assets/sun.svg';

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
  } else {
    theme.href = darkMode;
    themeText.textContent = 'Light Mode';
    themeIcon.src = sun
    searchIcon.src = icons.search.dark;
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
  card.innerHTML = `
    <div class="flag">
      <img src="${country.flags.svg}" alt="${country.flag.alt}">
    </div>
    <div class="country-info">
      <h2>${country.name.common}</h2>
      <p><strong>Population:</strong> ${country.population.toLocaleString('en-us')}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Capital:</strong> ${country.capital}</p>
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

getAllCountries().then(data => {
  data.forEach(country => {
    countries.appendChild(createCountyCard(country));
  });
})

regionsSelect.addEventListener('change', (e) => {
  clearCountries();
  const region = e.target.value;
  if (region === '') {
    getAllCountries().then(data => {
      data.forEach(country => {
        countries.appendChild(createCountyCard(country));
      });
    })
  } else {
    getCountriesByRegion(region).then(data => {
      data.forEach(country => {
        countries.appendChild(createCountyCard(country));
      });
    })
  }
})



searchInput.addEventListener('input', findCountry);
