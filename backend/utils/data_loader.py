import pandas as pd
import json
import os
from config import Config

class DataLoader:
    def __init__(self):
        self.crop_data = None
        self.soil_data = None
        self.load_data()
    
    def load_data(self):
        """Load crop data from CSV and soil data from JSON"""
        try:
            # Load crop data
            if os.path.exists(Config.DATA_PATH):
                self.crop_data = pd.read_csv(Config.DATA_PATH)
                print(f"Loaded crop data with {len(self.crop_data)} records")
            else:
                print(f"Warning: Crop data file not found at {Config.DATA_PATH}")
                self.crop_data = pd.DataFrame()
            
            # Load soil data
            if os.path.exists(Config.SOIL_DATA_PATH):
                with open(Config.SOIL_DATA_PATH, 'r') as f:
                    self.soil_data = json.load(f)
                print("Loaded soil data successfully")
            else:
                print(f"Warning: Soil data file not found at {Config.SOIL_DATA_PATH}")
                self.soil_data = {}
                
        except Exception as e:
            print(f"Error loading data: {e}")
            self.crop_data = pd.DataFrame()
            self.soil_data = {}
    
    def get_crop_data(self):
        """Return crop data"""
        return self.crop_data
    
    def get_soil_data(self):
        """Return soil data"""
        return self.soil_data
    
    def get_crop_details(self, crop_name):
        """Get detailed information about a specific crop"""
        if self.crop_data is not None and not self.crop_data.empty:
            crop_info = self.crop_data[self.crop_data['label'] == crop_name]
            if not crop_info.empty:
                return crop_info.iloc[0].to_dict()
        return None
    
    def get_all_crops(self):
        """Get list of all available crops"""
        if self.crop_data is not None and not self.crop_data.empty:
            return self.crop_data['label'].unique().tolist()
        return []