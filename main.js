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

// эта функция добавляет прослушиватель событий по щелчку мыши на кнопке поиска
// и переключения между вкладками
function addListeners() {
  searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    getWeatherData(city);
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(tab => {
        tab.classList.remove('active');
      });
      tab.classList.add('active');
      updateChart(index);
    });
  });
}

// извлекaю данные из openweathermap по API
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
  // сначала импортируем библиотеку chart js через CDN для построение графиков

  const chart = new Chart(chartContainer, {
    type: 'line',
    data: {
      labels: chartLabels[0],
      datasets: [
        {
          label: 'Temperature',
          data: temperatureData[0],
          borderColor: 'rgba(24, 90, 157, 1)',
          borderWidth: 1,
          pointRadius: 5,
          pointHoverRadius: 10,
          fill: true
        }
      ]
    },
  });

  window.chart = chart;
}

function updateText(city, currentWeatherData) {
  cityDisplay.textContent = city;
  temperatureDisplay.textContent = `${currentWeatherData.main.temp}°C`;
  weatherTypeDisplay.textContent = `${currentWeatherData.weather[0].main}`;
  feelsLikeDisplay.textContent = `По ощущению:  ${currentWeatherData.main.feels_like}°C`;
  humidityDisplay.textContent = `${currentWeatherData.main.humidity} %`;
  windspeedDisplay.textContent = `${currentWeatherData.wind.speed} м/с`;
  const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const date = new Date().toLocaleDateString('ru-RU', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  dateDisplay.textContent = date + ' ' + time;

  weatherIcon.src = `http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`;
}

async function getWeatherData(city) {

  // сброс;ываю массивы для каждого нового города
  temperatureData.length = 0;
  labels.length = 0;
  chartLabels.length = 0;

  const [currentWeatherData, forecastData] = await fetchData(city);

  /** 
   * здесь мы перебираем данные прогноза погоды и 
   * заполняем наши массивы температурных данных для диаграммы
   * */
  forecastData.list.forEach((item, i) => {
    let date = new Date(item.dt * 1000);
    let dateString = date.toLocaleDateString();

    if (i === 0 || dateString !== new Date(forecastData.list[i - 1].dt * 1000).toLocaleDateString()) {
      temperatureData.push([item.main.temp]);
      labels.push(date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }));
      chartLabels.push([date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })]);
    } else {
      temperatureData[temperatureData.length - 1].push(item.main.temp);
      chartLabels[chartLabels.length - 1].push(date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }));
    }

  });

  updateText(city, currentWeatherData);
  drawChart();

  // делает первую вкладку активной при выборе нового города и
  // обновляются даты до актуальных в вкладках данных прогноза погоды
  tabs[0].classList.add('active');
  tabs.forEach((tab, index) => {
    tab.textContent = labels[index];
  });

}

function updateChart(index) {
  chart.data.datasets[0].data = temperatureData[index];
  chart.data.labels = chartLabels[index];
  chart.update();
}

addListeners();
getWeatherData('Irkutsk');