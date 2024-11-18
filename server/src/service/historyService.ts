import { promises as fs } from 'fs';
import {v4} from 'uuid';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor (
    name: string,
    id: string,
  ) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    const data = await fs.readFile('./db/searchHistory.json', 'utf8');
    let history: City[] = [];
    if (data) {
      history = JSON.parse(data);
    }
    return history;
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    fs.writeFile('./db/searchHistory.json', (JSON.stringify(cities)));
  }
  

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    const cityHistory: City[] = await this.read();
    return cityHistory;
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) { // this calles the write function
    const toUpdate: City[] = await this.getCities();
    const newCity = new City(
      city,
      v4()
    )
    toUpdate.push(newCity);
    this.write(toUpdate);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const oldList: City[] = await this.getCities();

    for (const city of oldList) {
      if (id === city.id) {
        const index = oldList.indexOf(city);
        oldList.splice(index, 1);
      }
    }
    this.write(oldList);
  }
}

export default new HistoryService();
