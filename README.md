[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=yellow)](https://www.python.org/)
[![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Crop%20Prediction-green)](https://scikit-learn.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4-orange.svg)](https://scikit-learn.org/)
[![Pandas](https://img.shields.io/badge/Pandas-Data%20Analysis-blue)](https://pandas.pydata.org/)
[![NumPy](https://img.shields.io/badge/NumPy-Numerical%20Computing-lightblue)](https://numpy.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# 🌱 AI-Based Crop Recommendation System

### Smart Agriculture Crop Prediction Using Machine Learning

**Soil nutrient analysis · Weather-based recommendation · Data-driven farming support**

The **AI-Based Crop Recommendation System** is a machine learning project that recommends the most suitable crop to grow based on soil nutrients and environmental conditions.

This system analyzes key agricultural parameters such as **Nitrogen, Phosphorus, Potassium, Temperature, Humidity, pH value, and Rainfall** to predict the best crop for cultivation.

> Agriculture Disclaimer: This project is built for educational and research purposes. Real farming decisions should also consider local soil testing, climate conditions, irrigation availability, market demand, and expert agricultural advice.

---

## 🎯 What Makes This Project Useful?

### Smart Crop Recommendation

- Predicts the most suitable crop based on soil and weather data
- Helps farmers make better crop selection decisions
- Reduces guesswork in agriculture planning
- Uses machine learning for fast and accurate prediction
- Supports data-driven smart farming

---

## ⚡ Core Capabilities

### Crop Prediction

- Takes soil nutrient values as input
- Accepts environmental conditions such as temperature, humidity, pH, and rainfall
- Predicts the best crop using a trained ML model
- Provides instant output through a simple interface

### Soil Nutrient Analysis

- Nitrogen-based soil condition analysis
- Phosphorus-based crop suitability support
- Potassium-based crop recommendation
- pH-based soil compatibility checking

### Weather-Based Suggestion

- Temperature-aware recommendation
- Humidity-aware recommendation
- Rainfall-based crop suitability
- Supports agriculture planning based on environmental factors

### User Interface

- Simple and beginner-friendly interface
- Easy input form for soil and weather values
- Fast prediction result
- Suitable for students, farmers, and agriculture researchers

---

## 🧠 Technologies Used

- Python
- Machine Learning
- Pandas
- NumPy
- Scikit-Learn
- Flask / Streamlit
- HTML
- CSS
- Jupyter Notebook

---

## 📊 Dataset

The dataset contains soil and environmental features used for crop prediction.

| Feature | Description |
|--------|-------------|
| Nitrogen | Nitrogen content in soil |
| Phosphorus | Phosphorus content in soil |
| Potassium | Potassium content in soil |
| Temperature | Temperature in degree Celsius |
| Humidity | Relative humidity percentage |
| pH Value | Soil pH value |
| Rainfall | Rainfall in millimeters |

### Target Output

The model predicts the most suitable crop name based on the given input values.

Example crops may include:

- Rice
- Maize
- Chickpea
- Kidney Beans
- Pigeon Peas
- Moth Beans
- Mung Bean
- Blackgram
- Lentil
- Pomegranate
- Banana
- Mango
- Grapes
- Watermelon
- Muskmelon
- Apple
- Orange
- Papaya
- Coconut
- Cotton
- Jute
- Coffee

---

## 🏗️ System Architecture

```text
User Input
  N, P, K, Temperature, Humidity, pH, Rainfall
        |
        v
Data Preprocessing
  Feature scaling / cleaning / formatting
        |
        v
Machine Learning Model
  Trained crop recommendation model
        |
        v
Prediction Output
  Recommended crop name
        |
        v
User Interface
  Flask / Streamlit result display
```

---

## 📁 Project Structure

```text
AI-based-Crop-Recommendation-System/
├── app.py                         # Main application file
├── crop_recommendation.ipynb      # Model training notebook
├── Crop_recommendation.csv        # Dataset
├── model.pkl                      # Trained machine learning model
├── requirements.txt               # Python dependencies
├── README.md                      # Project documentation
│
├── templates/                     # HTML templates
│   └── index.html                 # Main UI page
│
├── static/                        # Static files
│   ├── style.css                  # CSS styling
│   └── images/                    # Project images
│
└── assets/                        # Screenshots and demo images
    └── screenshot.png
```

---

## 📷 Project Screenshot

### Crop Recommendation Interface

<img width="2940" height="1912" alt="image" src="https://github.com/user-attachments/assets/9e3c48d7-f431-469f-88e3-3cf754e9c863" />


> Add your project screenshot inside the `assets` folder and rename it as `screenshot.png`.

---

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- pip
- Git
- Flask or Streamlit
- Basic knowledge of running Python projects

---

### 1. Clone the Repository

```bash
git clone https://github.com/Chandan-coder07/AI-based-Crop-Recommendation-System.git
cd AI-based-Crop-Recommendation-System
```

---

### 2. Create Virtual Environment

```bash
python -m venv venv
```

---

### 3. Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### macOS / Linux

```bash
source venv/bin/activate
```

---

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 5. Run the Project

#### If using Flask

```bash
python app.py
```

Open the browser and visit:

```text
http://127.0.0.1:5000
```

#### If using Streamlit

```bash
streamlit run app.py
```

---

## 🧪 Example Prediction

### Sample Input

| Parameter | Value |
|----------|-------|
| Nitrogen | 90 |
| Phosphorus | 42 |
| Potassium | 43 |
| Temperature | 20.87 |
| Humidity | 82.00 |
| pH Value | 6.50 |
| Rainfall | 202.93 |

### Predicted Output

```text
Recommended Crop: Rice
```

---

## 🤖 Machine Learning Model

The project can use different supervised machine learning algorithms for crop prediction.

### Possible Algorithms

- Logistic Regression
- Decision Tree Classifier
- Random Forest Classifier
- Support Vector Machine
- K-Nearest Neighbors
- Naive Bayes

### Model Workflow

```text
Dataset Collection
        |
        v
Data Cleaning and Preprocessing
        |
        v
Feature Selection
        |
        v
Model Training
        |
        v
Model Evaluation
        |
        v
Save Trained Model
        |
        v
Crop Prediction
```

---

## 📈 Model Input Features

| Feature | Unit / Type | Purpose |
|--------|-------------|---------|
| Nitrogen | Numeric | Measures nitrogen level in soil |
| Phosphorus | Numeric | Measures phosphorus level in soil |
| Potassium | Numeric | Measures potassium level in soil |
| Temperature | Celsius | Captures climate condition |
| Humidity | Percentage | Captures moisture level |
| pH | Numeric | Measures soil acidity/basicity |
| Rainfall | mm | Captures water availability |

---

## 📦 Requirements

Example `requirements.txt`:

```txt
numpy
pandas
scikit-learn
flask
streamlit
matplotlib
seaborn
pickle-mixin
```

---

## 🌐 Deployment

### Deploy Flask App

You can deploy this project using:

- Render
- Railway
- PythonAnywhere
- Heroku
- AWS
- Google Cloud

### Deploy Streamlit App

You can deploy this project using:

- Streamlit Community Cloud
- Hugging Face Spaces
- Render

---

## 🎯 Future Improvements

- Mobile application for farmers
- Real-time weather API integration
- Location-based crop recommendation
- Smart irrigation suggestions
- Fertilizer recommendation system
- Crop disease detection using AI
- Farmer dashboard with analytics
- Multi-language support
- Voice-based input for farmers
- Market price prediction for recommended crops

---

## ✅ Advantages

- Helps farmers select suitable crops
- Improves agriculture planning
- Reduces risk of wrong crop selection
- Uses soil and weather data for prediction
- Simple and fast system
- Easy to understand and use
- Can be extended into a complete smart farming platform

---

## Built With

Python · Machine Learning · Pandas · NumPy · Scikit-Learn · Flask · Streamlit · HTML · CSS

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Chandan Sharma**  
*Department of Computer Science and Engineering*  
**KPR Institute of Engineering and Technology (KPR IET)**  
*Coimbatore, Tamil Nadu, India*

**© 2026 Chandan Sharma | KPR Institute of Engineering and Technology, CSE Department**

*Built with ❤️ for smart agriculture and better farming decisions* 🌱
