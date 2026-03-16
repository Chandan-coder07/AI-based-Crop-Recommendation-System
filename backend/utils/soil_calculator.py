import numpy as np

class SoilCalculator:
    @staticmethod
    def calculate_soil_health(n, p, k, ph, organic_carbon=None):
        """Calculate soil health score based on parameters"""
        # Normalize values
        n_norm = min(max(n / 140, 0), 1)  # Nitrogen 0-140 ppm
        p_norm = min(max(p / 145, 0), 1)  # Phosphorus 5-145 ppm  
        k_norm = min(max(k / 205, 0), 1)  # Potassium 5-205 ppm
        
        # pH optimal range is 6-7, score decreases as we move away
        ph_score = 1 - abs(ph - 6.5) / 3.5  # 3.5 is max deviation from optimal
        
        # Calculate overall health score (0-100)
        health_score = (n_norm + p_norm + k_norm + ph_score) / 4 * 100
        
        # Determine health category
        if health_score >= 80:
            category = "Excellent"
        elif health_score >= 60:
            category = "Good"
        elif health_score >= 40:
            category = "Fair"
        else:
            category = "Poor"
        
        return {
            'score': round(health_score, 2),
            'category': category,
            'parameters': {
                'nitrogen': round(n_norm * 100, 2),
                'phosphorus': round(p_norm * 100, 2),
                'potassium': round(k_norm * 100, 2),
                'ph_score': round(ph_score * 100, 2)
            }
        }
    
    @staticmethod
    def get_optimal_ranges(crop_type):
        """Get optimal soil parameter ranges for specific crop types"""
        ranges = {
            'rice': {'n': (50, 120), 'p': (30, 80), 'k': (40, 100), 'ph': (5.0, 6.5)},
            'wheat': {'n': (60, 130), 'p': (40, 90), 'k': (50, 110), 'ph': (6.0, 7.5)},
            'maize': {'n': (70, 140), 'p': (50, 100), 'k': (60, 120), 'ph': (5.8, 7.0)},
            'cotton': {'n': (50, 110), 'p': (30, 70), 'k': (40, 90), 'ph': (5.5, 8.0)},
            'default': {'n': (50, 120), 'p': (30, 80), 'k': (40, 100), 'ph': (5.5, 7.5)}
        }
        
        return ranges.get(crop_type.lower(), ranges['default'])