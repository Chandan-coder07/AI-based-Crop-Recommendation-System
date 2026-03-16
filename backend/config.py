# backend/config.py
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'crop-recommendation-secret-key-2024'
    WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY') or '1d58976a4834426a97445247252709'
    WEATHER_API_URL = "http://api.weatherapi.com/v1/current.json"
    
    # Model paths - using absolute paths
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODEL_PATH = os.path.join(BASE_DIR, 'models', 'crop_model.pkl')
    DATA_PATH = os.path.join(BASE_DIR, 'data', 'crop_data.csv')
    SOIL_DATA_PATH = os.path.join(BASE_DIR, 'data', 'soil_health_data.json')