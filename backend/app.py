from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os
import json
import random
from datetime import datetime
from PIL import Image
import io

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5500", "http://127.0.0.1:5500"])

# Global variables
model = None
scaler = None
crop_labels = []
crop_analysis = {}
training_accuracy = 0
training_date = None

# File paths
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'models', 'crop_model.pkl')
scaler_path = os.path.join(current_dir, 'models', 'scaler.pkl')
labels_path = os.path.join(current_dir, 'models', 'crop_labels.pkl')
soil_health_data_path = os.path.join(current_dir, 'data', 'soil_health_data.json')

# Weather API configuration
WEATHER_API_KEY = "4c9a36d7be25bfddb79d125d629c56aa"
WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather"

def load_model():
    """Load the trained model and scaler"""
    global model, scaler, crop_labels, crop_analysis, training_accuracy
    
    try:
        if os.path.exists(model_path) and os.path.exists(scaler_path) and os.path.exists(labels_path):
            # Load model
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
            
            with open(scaler_path, 'rb') as f:
                scaler = pickle.load(f)
                
            with open(labels_path, 'rb') as f:
                crop_labels = pickle.load(f)
            
            # Load crop analysis data
            if os.path.exists(soil_health_data_path):
                with open(soil_health_data_path, 'r') as f:
                    crop_analysis = json.load(f)
            
            print("✅ Model loaded successfully!")
            print(f"✅ Model classes: {len(crop_labels)} crops")
            return True
        else:
            print("❌ Model files not found. Please run train_model.py first.")
            return False
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'model_loaded': model is not None,
        'available_crops': len(crop_labels) if crop_labels else 0,
        'crops': crop_labels if crop_labels else [],
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/crops', methods=['GET'])
def get_crops():
    return jsonify({
        'crops': crop_labels if crop_labels else [],
        'count': len(crop_labels) if crop_labels else 0
    })

@app.route('/api/crop-info/<crop_name>', methods=['GET'])
def get_crop_info(crop_name):
    crop_key = crop_name.lower().strip()
    
    # Try exact match first
    if crop_key in crop_analysis:
        return jsonify(crop_analysis[crop_key])
    
    # Try fuzzy matching
    for key in crop_analysis:
        if key in crop_key or crop_key in key:
            return jsonify(crop_analysis[key])
    
    # Return generic info if not found
    return jsonify({
        'name': crop_name.title(),
        'avg_temperature': 25.0,
        'avg_humidity': 70.0,
        'avg_ph': 6.5,
        'avg_rainfall': 150.0,
        'soil_types': ['Loamy Soil'],
        'growing_season': 'Variable',
        'water_requirement': 'Medium',
        'duration': '90-120 days',
        'states': ['Various states'],
        'icon': 'fa-seedling'
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if model is None or scaler is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded. Please train the model first.'
            }), 500
        
        data = request.get_json()
        
        # Extract features
        features = [
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]
        
        # Convert to numpy array and reshape
        features_array = np.array(features).reshape(1, -1)
        
        # Scale the features
        features_scaled = scaler.transform(features_array)
        
        # Make prediction
        prediction = model.predict(features_scaled)[0]
        probabilities = model.predict_proba(features_scaled)[0]
        confidence = float(np.max(probabilities))
        
        # Get top 5 recommendations
        top_indices = np.argsort(probabilities)[-5:][::-1]
        recommendations = []
        
        for idx in top_indices:
            crop_name = crop_labels[idx]
            prob = float(probabilities[idx])
            
            # Get crop analysis data
            crop_info = crop_analysis.get(crop_name.lower(), {})
            
            recommendations.append({
                'crop': crop_name,
                'confidence': round(prob * 100, 2),
                'avg_temperature': crop_info.get('avg_temperature', 25),
                'avg_humidity': crop_info.get('avg_humidity', 70),
                'avg_ph': crop_info.get('avg_ph', 6.5),
                'avg_rainfall': crop_info.get('avg_rainfall', 150),
                'soil_types': crop_info.get('soil_types', ['Loamy Soil']),
                'growing_season': crop_info.get('growing_season', 'Variable'),
                'water_requirement': crop_info.get('water_requirement', 'Medium'),
                'duration': crop_info.get('duration', '90-120 days'),
                'states': crop_info.get('states', ['Various states'])
            })
        
        response = {
            'success': True,
            'prediction': recommendations[0]['crop'],
            'confidence': recommendations[0]['confidence'],
            'recommendations': recommendations[:3],  # Top 3
            'all_recommendations': recommendations  # All 5
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/soil-health', methods=['POST'])
def analyze_soil():
    try:
        data = request.get_json()
        
        N = float(data.get('N', 0))
        P = float(data.get('P', 0))
        K = float(data.get('K', 0))
        ph = float(data.get('ph', 7))
        
        # Calculate soil health scores based on optimal ranges from your data
        n_score = min(100, (N / 140) * 100)
        p_score = min(100, (P / 145) * 100)
        k_score = min(100, (K / 205) * 100)
        
        # pH score - optimal range from your data (5.5-7.5 for most crops)
        if 5.5 <= ph <= 7.5:
            ph_score = 100
        elif ph < 5.5:
            ph_score = max(0, 100 - (5.5 - ph) * 20)
        else:
            ph_score = max(0, 100 - (ph - 7.5) * 20)
        
        overall = (n_score + p_score + k_score + ph_score) / 4
        
        # Determine soil health category
        if overall >= 80:
            category = 'Excellent - Your soil is very healthy!'
            color = '#4caf50'
            recommendation = 'Your soil is in excellent condition. It can support most crops.'
        elif overall >= 60:
            category = 'Good - Your soil is healthy'
            color = '#8bc34a'
            recommendation = 'Your soil is good. Add organic manure to improve further.'
        elif overall >= 40:
            category = 'Average - Needs improvement'
            color = '#ffc107'
            recommendation = 'Consider adding compost and following crop rotation.'
        else:
            category = 'Poor - Needs significant improvement'
            color = '#f44336'
            recommendation = 'Add organic matter, green manure, and consider soil testing.'
        
        return jsonify({
            'success': True,
            'overall': round(overall, 1),
            'category': category,
            'color': color,
            'recommendation': recommendation,
            'parameters': {
                'nitrogen': round(n_score, 1),
                'phosphorus': round(p_score, 1),
                'potassium': round(k_score, 1),
                'ph': round(ph_score, 1)
            },
            'interpretation': {
                'nitrogen': {
                    'value': N,
                    'advice': get_nitrogen_advice(N)
                },
                'phosphorus': {
                    'value': P,
                    'advice': get_phosphorus_advice(P)
                },
                'potassium': {
                    'value': K,
                    'advice': get_potassium_advice(K)
                },
                'ph': {
                    'value': round(ph, 1),
                    'advice': get_ph_advice(ph)
                }
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_nitrogen_advice(N):
    if N < 50:
        return 'Low nitrogen. Add urea, DAP, or organic manure. Good for pulses.'
    elif N < 100:
        return 'Adequate nitrogen. Maintain with compost.'
    else:
        return 'High nitrogen. Good for leafy vegetables like cabbage, spinach.'

def get_phosphorus_advice(P):
    if P < 30:
        return 'Low phosphorus. Add superphosphate or bone meal for root development.'
    elif P < 60:
        return 'Adequate phosphorus. Good for root crops like carrots, potatoes.'
    else:
        return 'High phosphorus. Good for flowering and fruiting crops.'

def get_potassium_advice(K):
    if K < 50:
        return 'Low potassium. Add potash or wood ash for disease resistance.'
    elif K < 100:
        return 'Adequate potassium. Maintain with organic matter.'
    else:
        return 'High potassium. Good for all crops, especially fruiting vegetables.'

def get_ph_advice(ph):
    if ph < 5.5:
        return 'Too acidic. Add lime to raise pH.'
    elif ph < 6.5:
        return 'Slightly acidic. Good for potatoes, berries.'
    elif ph < 7.5:
        return 'Neutral. Ideal for most crops.'
    elif ph < 8.5:
        return 'Slightly alkaline. Good for spinach, cabbage.'
    else:
        return 'Too alkaline. Add sulfur or organic matter.'

@app.route('/api/weather/<city>', methods=['GET'])
def get_weather(city):
    """Get real weather data from OpenWeatherMap API"""
    try:
        # Make request to OpenWeatherMap API
        params = {
            'q': city,
            'appid': WEATHER_API_KEY,
            'units': 'metric',
            'lang': 'en'
        }
        
        import requests
        response = requests.get(WEATHER_API_URL, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            weather_data = {
                'city': data['name'],
                'country': data['sys']['country'],
                'temperature': round(data['main']['temp'], 1),
                'feels_like': round(data['main']['feels_like'], 1),
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'precipitation': data.get('rain', {}).get('1h', 0),
                'condition': data['weather'][0]['description'],
                'icon': data['weather'][0]['icon'],
                'wind_speed': data['wind']['speed'],
                'wind_direction': data['wind'].get('deg', 0),
                'clouds': data['clouds']['all'],
                'advice': get_weather_advice(
                    data['main']['temp'],
                    data['main']['humidity'],
                    data.get('rain', {}).get('1h', 0)
                )
            }
            
            return jsonify({
                'success': True,
                'weather': weather_data
            })
            
        elif response.status_code == 401:
            return jsonify({
                'success': False,
                'error': 'Invalid API key. Please check your OpenWeatherMap API key.'
            }), 401
        elif response.status_code == 404:
            return jsonify({
                'success': False,
                'error': f'City "{city}" not found. Please check the spelling.'
            }), 404
        else:
            return jsonify({
                'success': False,
                'error': f'Weather API error: {response.status_code}'
            }), response.status_code
            
    except ImportError:
        # Fallback to mock data if requests not installed
        return get_mock_weather(city)
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_mock_weather(city):
    """Generate mock weather data as fallback"""
    import random
    from datetime import datetime
    
    weather_conditions = ['Clear sky', 'Partly cloudy', 'Cloudy', 'Light rain', 'Moderate rain']
    condition = random.choice(weather_conditions)
    
    # Base values based on city name
    city_lower = city.lower()
    if 'mumbai' in city_lower or 'chennai' in city_lower:
        base_temp = 30
        base_humidity = 80
    elif 'delhi' in city_lower or 'lucknow' in city_lower:
        base_temp = 35
        base_humidity = 60
    elif 'bangalore' in city_lower:
        base_temp = 25
        base_humidity = 70
    else:
        base_temp = 28
        base_humidity = 65
    
    temp = base_temp + random.randint(-3, 3)
    humidity = base_humidity + random.randint(-5, 5)
    rainfall = random.choice([0, 0, 0, 2, 5, 10])
    
    weather_data = {
        'city': city.title(),
        'temperature': temp,
        'humidity': humidity,
        'precipitation': rainfall,
        'condition': condition,
        'icon': '01d' if rainfall == 0 else '10d',
        'advice': get_weather_advice(temp, humidity, rainfall)
    }
    
    return jsonify({
        'success': True,
        'weather': weather_data
    })

def get_weather_advice(temp, humidity, rainfall):
    """Generate farmer-friendly weather advice"""
    advice = []
    
    if rainfall > 10:
        advice.append("🌧️ Rain expected. Delay irrigation and cover harvested crops.")
    elif rainfall > 0:
        advice.append("☁️ Light rain possible. Good for sowing if soil is prepared.")
    else:
        advice.append("☀️ No rain expected. Plan irrigation accordingly.")
    
    if temp > 35:
        advice.append("🔥 Very hot! Provide shade to seedlings and water in evening.")
    elif temp < 15:
        advice.append("❄️ Cool weather. Protect young plants from cold.")
    else:
        advice.append("✅ Temperature is favorable for most crops.")
    
    if humidity > 80:
        advice.append("💧 High humidity. Watch for fungal diseases.")
    elif humidity < 40:
        advice.append("💨 Low humidity. Increase irrigation frequency.")
    
    return " ".join(advice)

@app.route('/api/soil-image', methods=['POST'])
def analyze_soil_image():
    """Analyze soil image and return condition + suggested crops."""
    if 'soil_image' not in request.files:
        return jsonify({'success': False, 'error': 'soil_image file is required'}), 400

    soil_image = request.files['soil_image']
    if soil_image.filename == '':
        return jsonify({'success': False, 'error': 'No soil image selected'}), 400

    try:
        image = Image.open(io.BytesIO(soil_image.read())).convert('RGB')
        image = image.resize((80, 80))
        pixels = np.array(image).astype(float)
        avg_rgb = pixels.mean(axis=(0, 1))
        r, g, b = avg_rgb.tolist()

        brightness = float(np.mean(avg_rgb))
        green_ratio = float(g / (r + 1e-8))

        if brightness < 80:
            moisture_status = 'Wet/Heavy soil'
            soil_condition = 'Poor drainage and possibly compacted. Consider adding organic matter and improving drainage.'
            recommended_crops = ['Rice', 'Sugarcane', 'Banana']
            health_score = 45
        elif brightness < 130:
            moisture_status = 'Healthy/Moderate soil'
            soil_condition = 'Soil looks balanced. Maintain fertility and crop rotation.'
            recommended_crops = ['Wheat', 'Maize', 'Chickpea']
            health_score = 78
        else:
            moisture_status = 'Dry soil'
            soil_condition = 'Soil appears dry and sandy. Increase irrigation, add compost, and use mulching.'
            recommended_crops = ['Millet', 'Sorghum', 'Pigeonpeas']
            health_score = 55

        if green_ratio > 1.07:
            soil_type = 'Loamy/Alluvial'
        elif brightness > 140 and green_ratio < 0.95:
            soil_type = 'Sandy'
        else:
            soil_type = 'Clayey'

        return jsonify({
            'success': True,
            'soil_type': soil_type,
            'moisture_status': moisture_status,
            'soil_condition': soil_condition,
            'health_score': health_score,
            'recommended_crops': recommended_crops,
            'color': {
                'r': round(r, 1),
                'g': round(g, 1),
                'b': round(b, 1)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/crop-analysis', methods=['GET'])
def get_crop_analysis():
    """Get detailed crop analysis data"""
    return jsonify({
        'success': True,
        'crops': crop_analysis
    })

if __name__ == '__main__':
    print("=" * 60)
    print("🌱 CROP RECOMMENDATION API")
    print("=" * 60)
    
    # Load the trained model
    if load_model():
        print("\n✅ API is ready!")
        print(f"📍 Server running on: http://localhost:5001")
        print(f"📍 Available crops: {len(crop_labels)}")
        print("\n📍 Available endpoints:")
        print("   - GET  /api/health")
        print("   - GET  /api/crops")
        print("   - GET  /api/crop-info/<crop>")
        print("   - POST /api/predict")
        print("   - POST /api/soil-health")
        print("   - GET  /api/weather/<city>")
        print("   - GET  /api/crop-analysis")
    else:
        print("\n❌ Failed to load model. Please run train_model.py first.")
        print("   cd backend && python train_model.py")
    
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5001)