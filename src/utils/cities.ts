import type { CityCoordinates } from '../types'

const CITIES: CityCoordinates[] = [
  { name: 'Warszawa', lat: 52.2297, lng: 21.0122 },
  { name: 'Kraków', lat: 50.0647, lng: 19.945 },
  { name: 'Gdańsk', lat: 54.352, lng: 18.6466 },
  { name: 'Wrocław', lat: 51.1079, lng: 17.0385 },
  { name: 'Poznań', lat: 52.4064, lng: 16.9252 },
  { name: 'Łódź', lat: 51.7592, lng: 19.456 },
  { name: 'Szczecin', lat: 53.4285, lng: 14.5528 },
  { name: 'Lublin', lat: 51.2465, lng: 22.5684 },
  { name: 'Katowice', lat: 50.2649, lng: 19.0238 },
  { name: 'Białystok', lat: 53.1325, lng: 23.1688 },
  { name: 'Bydgoszcz', lat: 53.1235, lng: 18.0084 },
  { name: 'Toruń', lat: 53.0138, lng: 18.5984 },
  { name: 'Rzeszów', lat: 50.0412, lng: 21.999 },
  { name: 'Olsztyn', lat: 53.7784, lng: 20.4801 },
  { name: 'Opole', lat: 50.6751, lng: 17.9213 },
  { name: 'Kielce', lat: 50.8661, lng: 20.6286 },
  { name: 'Zielona Góra', lat: 51.9356, lng: 15.5062 },
  { name: 'Gorzów Wielkopolski', lat: 52.7368, lng: 15.2288 },
]

export function getCityCoordinates(name: string): CityCoordinates | null {
  const city = CITIES.find((c) => c.name.toLowerCase() === name.toLowerCase())
  return city ?? null
}

export function getAvailableCities(): string[] {
  return CITIES.map((c) => c.name).sort()
}
