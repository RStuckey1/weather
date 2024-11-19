import { promises as fs } from 'fs';
import {v4} from 'uuid';

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


class HistoryService {

  
  private async read(): Promise<City[]> {
    const data = await fs.readFile('./db/searchHistory.json', 'utf8');
    let history: City[] = [];
    if (data) {
      history = JSON.parse(data);
    }
    return history;
  }

  private async write(cities: City[]) {
    fs.writeFile('./db/searchHistory.json', (JSON.stringify(cities)));
  }
  

  async getCities(): Promise<City[]> {
    const cityHistory: City[] = await this.read();
    return cityHistory;
  }

  async addCity(city: string) { 
    const toUpdate: City[] = await this.getCities();
    const newCity = new City(
      city,
      v4()
    )
    toUpdate.push(newCity);
    this.write(toUpdate);
  }

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
