import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  city: string;
  date: string;
  icon: string;
  iconDesc: string;
  tempF: string;
  windSpeed: number;
  humidity: string;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDesc: string,
    tempF: string,
    windSpeed: number,
    humidity: string,
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDesc = iconDesc;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

class WeatherService {
  baseURL: string;
  apiKey: string;
  cityName: string;

  constructor(
    baseURL: string,
    apiKey: string,
    cityName: string
  ) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.cityName = cityName;
  }

 
  private async fetchLocationData(query: string) {
    const getCoordinates = await this.buildGeocodeQuery(query);
    const location = await fetch(getCoordinates);
    return location.json(); 
  }

 
  private destructureLocationData(locationData: Coordinates[]): Coordinates { 
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  
  private async buildGeocodeQuery(query: string): Promise<string> { 
    const geoQuery = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=5&appid=${this.apiKey}`;
    return geoQuery;
  }

  
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
    return weatherQuery;
  }

  
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.cityName);
    return this.destructureLocationData(locationData);
  }

 
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherData = await fetch(this.buildWeatherQuery(coordinates));
    return weatherData.json();
  }

 
  private buildForecastArray(weatherData: any[]) {
    const forecast = [];
    for (let i = 0; i < weatherData.length; i += 8) {
      const city = this.cityName;
      const date = new Date(weatherData[i].dt * 1000).toLocaleString();
      const icon = weatherData[i].weather[0].icon;
      const iconDesc = weatherData[i].weather[0].description;
      const tempF = weatherData[i].main.temp;
      const windSpeed = weatherData[i].wind.speed;
      const humidity = weatherData[i].main.humidity;
      forecast.push({ city, date, icon, iconDesc, tempF, windSpeed, humidity });
    }
    return forecast;
  }

  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    if (!coordinates) {
      throw new Error('Failed ot fetch location data.');
    }

    const weather = await this.fetchWeatherData(coordinates);
    if (!weather) {
      throw new Error('Failed ot fetch weather data.');
    }
    console.log(weather);

    const cityForecast = this.buildForecastArray(weather.list);

    return cityForecast;
  }
}

export default new WeatherService(`${process.env.API_BASE_URL}`, `${process.env.API_KEY}`, '');
