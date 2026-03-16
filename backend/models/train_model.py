
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import pickle
import os

print("=" * 60)
print("🌱 CROP RECOMMENDATION MODEL TRAINING")
print("=" * 60)

# Find the CSV file (relative to repository root)
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
csv_path = os.path.join(root_dir, 'crop_data.csv')
print(f"📊 Loading dataset from: {csv_path}")

try:
    df = pd.read_csv(csv_path)
    print(f"✅ Dataset loaded with {len(df)} samples")
    print(f"✅ Columns: {list(df.columns)}")
    
    # Prepare features and target
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']
    
    # Get unique crops
    crops = y.unique()
    print(f"✅ Found {len(crops)} crop types:")
    for crop in crops:
        count = len(y[y == crop])
        print(f"   - {crop}: {count} samples")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"✅ Training set: {len(X_train)} samples")
    print(f"✅ Test set: {len(X_test)} samples")
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    # Train model
    print("🤖 Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train_scaled, y_train)
    
    # Calculate accuracy
    X_test_scaled = scaler.transform(X_test)
    accuracy = model.score(X_test_scaled, y_test)
    print(f"✅ Model accuracy: {accuracy:.2%}")
    
    # Feature importance
    feature_importance = model.feature_importances_
    features = ['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'pH', 'Rainfall']
    print("\n📊 Feature Importance:")
    for feat, imp in sorted(zip(features, feature_importance), key=lambda x: x[1], reverse=True):
        print(f"   - {feat}: {imp:.3f}")
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Save model
    with open('models/crop_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    with open('models/scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    with open('models/crop_labels.pkl', 'wb') as f:
        pickle.dump(list(crops), f)
    
    print("\n✅ Model training complete!")
    print(f"✅ Model saved in: {os.path.abspath('models')}")
    print("=" * 60)
    
except FileNotFoundError:
    print(f"❌ Error: Could not find crop_data.csv at {csv_path}")
    print("Please make sure the file exists at that location.")
except Exception as e:
    print(f"❌ Error: {e}")
