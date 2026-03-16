import requests
from config import Config

class WeatherAPI:
    def __init__(self):
        self.api_key = Config.WEATHER_API_KEY
        self.base_url = Config.WEATHER_API_URL
    
    def get_current_weather(self, city_name):
        """Get current weather data for a city using WeatherAPI.com"""
        if not self.api_key or self.api_key == 'your-weather-api-key':
            return self.get_sample_weather_data()
        
        try:
            params = {
                'key': self.api_key,
                'q': city_name
            }
            
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            return {
                'temperature': data['current']['temp_c'],
                'humidity': data['current']['humidity'],
                'condition': data['current']['condition']['text'],
                'wind_speed': data['current']['wind_kph'],
                'precipitation': data['current']['precip_mm'],
                'pressure': data['current']['pressure_mb'],
                'feels_like': data['current']['feelslike_c'],
                'visibility': data['current']['vis_km'],
                'uv_index': data['current']['uv'],
                'location': {
                    'name': data['location']['name'],
                    'region': data['location']['region'],
                    'country': data['location']['country']
                },
                'success': True,
                'last_updated': data['current']['last_updated']
            }
            
        except requests.exceptions.RequestException as e:
            print(f"Weather API error: {e}")
            return self.get_sample_weather_data(city_name)
    
    def get_sample_weather_data(self, city_name="Default City"):
        """Return sample weather data when API is not available"""
        # Different sample data based on city for demo purposes
        sample_data = {
            "delhi": {"temp": 28.5, "humidity": 65, "rainfall": 0},
            "mumbai": {"temp": 30.2, "humidity": 75, "rainfall": 2.5},
            "chennai": {"temp": 32.1, "humidity": 70, "rainfall": 1.2},
            "kolkata": {"temp": 29.8, "humidity": 78, "rainfall": 3.1},
            "bangalore": {"temp": 26.3, "humidity": 68, "rainfall": 0.5}
        }
        
        city_key = city_name.lower().split(',')[0]  # Take first part of city name
        city_data = sample_data.get(city_key, {"temp": 25.0, "humidity": 65, "rainfall": 0})
        
        return {
            'temperature': city_data['temp'],
            'humidity': city_data['humidity'],
            'condition': 'Partly cloudy',
            'wind_speed': 12.0,
            'precipitation': city_data['rainfall'],
            'pressure': 1013.0,
            'feels_like': city_data['temp'] + 2,
            'visibility': 10.0,
            'uv_index': 6.0,
            'location': {
                'name': city_name,
                'region': 'Sample Region',
                'country': 'Sample Country'
            },
            'success': False,
            'last_updated': '2024-01-01 12:00',
            'message': 'Using sample data. Real weather data is available when API is properly configured.'
        }
    
    def get_weather_for_recommendation(self, city_name):
        """Get weather data specifically formatted for crop recommendations"""
        weather_data = self.get_current_weather(city_name)
        
        return {
            'temperature': weather_data['temperature'],
            'humidity': weather_data['humidity'],
            'rainfall': weather_data['precipitation'],
            'weather_condition': weather_data['condition'],
            'source': 'api' if weather_data['success'] else 'sample'
        }