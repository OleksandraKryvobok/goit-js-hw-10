import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.info'),
};

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {    
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    const searchCountry = e.target.value.trim();  

    if(searchCountry === '') {
        return;
    }
 
    fetchCountries(searchCountry)
        .then(createMarkup)
        .catch(createError);
}

function createMarkup(data) {
    if(data.length > 10) {
        Notify.success('Too many matches found. Please enter a more specific name.');
    } else if (data.length >= 2 && data.length <= 10) {
        const markup = data.map(({ 
            name: {official}, 
            flags: {svg}, 
        }) => `
            <li class='country-item'>
                <img class='counry-flag' src='${svg}' alt='flag' width='30' heigth='30'>
                
                <h1 class='country-name'>
                    ${official}
                </hi>
            </li>
        `).join('');
    
        refs.countryList.insertAdjacentHTML('beforeend', markup);
    } else {
        const markup = data.map(({ 
            name: {official}, 
            flags: {svg}, 
        }) => `
            <li class='country-item__one'>
                <img class='counry-flag' src='${svg}' alt='flag' width='30' heigth='30'>
                
                <h1 class='country-name__one'>
                    ${official}
                </hi>
            </li>
        `).join('');
    
        refs.countryList.insertAdjacentHTML('beforeend', markup);

        const markupInfo = data.map(({  
            capital, 
            population, 
            languages,
        }) =>         `
            <ul class='info-list'>
                <li class='info-item'>
                    <span class='info-item__bold'>Capital:</span> ${capital}
                </li>
                <li class='info-item'>
                    <span class='info-item__bold'>Population:</span> ${population}
                </li>
                <li class='info-item'>
                    <span class='info-item__bold'>Languages:</span> ${Object.values(languages).join(', ')}
                </li>
            </ul>
        `).join('');

        refs.countryInfo.insertAdjacentHTML('beforeend', markupInfo);
    }
}

function createError() {
    Notify.failure('Oops, there is no country with that name');
}