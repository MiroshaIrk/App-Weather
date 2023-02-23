import { API_KEY } from "./utils.js";

// получаю кнопку и поле ввода города
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');

// чтобы иметь возможность изменять значок текущей погоды
const weatherIcon = document.getElementById('weatherImg');

// получаю <p> теги с левой стороны
const cityDisplay = document.getElementById('city');
const weatherTypeDisplay = document.getElementById('weatertype');
const feelsLikeDisplay = document.getElementById('feelsLike');
const temperatureDisplay = document.getElementById('temperature');

// получаю влажность, скорость ветра и дату
const dateDisplay = document.getElementById('date');
const humidityDisplay = document.getElementById('humidity');
const windspeedDisplay = document.getElementById('windspeed');

// получение точек диаграммы
const chartContainer = document.getElementById('chart');
const tabs = document.querySelectorAll('.tab');

// массивы данных прогноза погоды "temperatureData"
const temperatureData = [];
const chartLabels = [];
const labels = [];

function addListeners() {
  // todo
}

// извлекaю данные из openweathermap API
// первый запрос дает нам текущие данные о погоде
// второй запрос даст нам прогнозные данные
async function fetchData(city) {
  const [currentWeatherResponse, forecastResponse] = await Promise.all([
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    ),
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    )
  ]);

  const currentWeatherData = await currentWeatherResponse.json();
  const forecastData = await forecastResponse.json();

  return [currentWeatherData, forecastData];
}

function drawChart() {

}

function updateText() {
  // todo
}

async function getWeatherData(city) {
  const [currentWeatherData, forecastData] = await fetchData(city);
  console.log([currentWeatherData, forecastData])

}

getWeatherData('Moscow');