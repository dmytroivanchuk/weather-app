import './index.css';

const body = document.querySelector('body');
const input = document.createElement('input');
input.type = 'search';
const fetchTemperatureButton = document.createElement('button');
fetchTemperatureButton.textContent = 'Fetch Temperature';
const result = document.createElement('p');
const toggleUnitButton = document.createElement('button');
toggleUnitButton.classList.add('toggle-unit');
toggleUnitButton.textContent = 'View in ℉';
body.append(input, fetchTemperatureButton, result, toggleUnitButton);
let data;
let temperatureUnit = 'metric';

const getData = ({
  dataMetric: {
    address,
    currentConditions: { temp: temperatureMetric },
  },
  dataUS: {
    currentConditions: { temp: temperatureUS },
  },
}) => ({
  address,
  temperatureMetric,
  temperatureUS,
});

const fetchData = async (location, unit) => {
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?include=current&elements=temp&unitGroup=${unit}&key=TZT3LH3TDX99TNCF2LLP6ACHX`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
};

const fetchWeatherData = async (location) => {
  const [dataMetric, dataUS] = await Promise.all([
    fetchData(location, 'metric'),
    fetchData(location, 'us'),
  ]);
  return getData({ dataMetric, dataUS });
};

const displayData = ({ address, temperatureMetric, temperatureUS }) => {
  switch (temperatureUnit) {
    case 'metric':
      result.textContent = `${address}: ${temperatureMetric} ℃`;
      break;
    case 'us':
      result.textContent = `${address}: ${temperatureUS} ℉`;
      break;
    default:
  }
};

const fetchTemperature = async () => {
  try {
    switch (input.value) {
      case '':
        result.textContent = 'The field is empty.';
        if (toggleUnitButton.classList.contains('block')) {
          toggleUnitButton.classList.remove('block');
        }
        break;
      default: {
        result.textContent = 'Fetching...';
        data = await fetchWeatherData(input.value);
        displayData(data);
        toggleUnitButton.classList.add('block');
      }
    }
  } catch (error) {
    result.textContent = error;
  }
};

const toggleUnit = () => {
  if (temperatureUnit === 'metric') {
    temperatureUnit = 'us';
    toggleUnitButton.textContent = 'View in ℃';
  } else {
    temperatureUnit = 'metric';
    toggleUnitButton.textContent = 'View in ℉';
  }

  displayData(data);
};

fetchTemperatureButton.addEventListener('click', fetchTemperature);
toggleUnitButton.addEventListener('click', toggleUnit);
