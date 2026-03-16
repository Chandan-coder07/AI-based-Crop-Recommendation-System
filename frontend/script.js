// script.js - Complete version with your CSV data
const API_BASE_URL = (() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        if (window.location.port === '3000') {
            return '/api';
        } else {
            return 'http://localhost:5001/api';
        }
    }
    return '/api';
})();

console.log('🌐 API Base URL:', API_BASE_URL);

// Sample data based on your CSV averages
const SAMPLE_DATA = {
    rice: {
        N: 90,
        P: 45,
        K: 40,
        temperature: 28,
        humidity: 82,
        ph: 6.5,
        rainfall: 200,
        soil_type: 'clay',
        name: 'Rice - West Bengal/Punjab'
    },
    wheat: {
        N: 110,
        P: 55,
        K: 45,
        temperature: 22,
        humidity: 65,
        ph: 7.2,
        rainfall: 75,
        soil_type: 'loamy',
        name: 'Wheat - Punjab/Haryana'
    },
    maize: {
        N: 85,
        P: 50,
        K: 40,
        temperature: 26,
        humidity: 70,
        ph: 6.8,
        rainfall: 85,
        soil_type: 'sandy loam',
        name: 'Maize - Karnataka'
    },
    cotton: {
        N: 95,
        P: 48,
        K: 52,
        temperature: 30,
        humidity: 60,
        ph: 7.5,
        rainfall: 65,
        soil_type: 'black',
        name: 'Cotton - Maharashtra'
    },
    chickpea: {
        N: 35,
        P: 45,
        K: 40,
        temperature: 22,
        humidity: 55,
        ph: 7.2,
        rainfall: 35,
        soil_type: 'sandy loam',
        name: 'Chickpea - Madhya Pradesh'
    },
    sugarcane: {
        N: 120,
        P: 60,
        K: 55,
        temperature: 28,
        humidity: 75,
        ph: 7.0,
        rainfall: 120,
        soil_type: 'loamy',
        name: 'Sugarcane - Uttar Pradesh'
    }
};

// Global variables
let cropChart = null;
let cropAnalysisData = {};

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An error occurred. Please check the console.', 'error');
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Crop Recommendation System...');
    initApp();
});

async function initApp() {
    try {
        // Test backend connection
        await testBackendConnection();
        
        // Load crop analysis data
        await loadCropAnalysis();
        
        // Initialize components
        initMobileMenu();
        initLanguageToggle();
        initFormFunctionality();
        initWeatherFunctionality();
        await loadCropsData();
        initCropSearch();
        initSmoothScrolling();
        initCropSuitabilityChart();
        
        // Set default form values
        setDefaultFormValues();
        // Render saved recommendations history
        renderRecommendationHistory();
        
        console.log('✅ App initialized successfully');
    } catch (error) {
        console.error('❌ App initialization failed:', error);
        showNotification('Cannot connect to backend. Please make sure it\'s running on port 5001.', 'error');
    }
}

async function loadCropAnalysis() {
    try {
        const response = await fetch(`${API_BASE_URL}/crop-analysis`);
        const data = await response.json();
        if (data.success) {
            cropAnalysisData = data.crops;
            console.log('✅ Crop analysis data loaded');
        }
    } catch (error) {
        console.error('Error loading crop analysis:', error);
    }
}

// Test backend connection
async function testBackendConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'healthy') {
            console.log('✅ Backend connection successful');
            console.log(`✅ Available crops: ${data.available_crops}`);
            showNotification('Connected to backend successfully!', 'success');
            return true;
        } else {
            throw new Error('Backend health check failed');
        }
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        showNotification('Cannot connect to backend on port 5001. Please start the backend server.', 'error');
        throw error;
    }
}

function setDefaultFormValues() {
    // Set to average values from your CSV
    document.getElementById('nitrogen').value = 70;
    document.getElementById('nitrogen-range').value = 70;
    document.getElementById('phosphorus').value = 50;
    document.getElementById('phosphorus-range').value = 50;
    document.getElementById('potassium').value = 45;
    document.getElementById('potassium-range').value = 45;
    document.getElementById('temperature').value = 25;
    document.getElementById('temperature-range').value = 25;
    document.getElementById('humidity').value = 70;
    document.getElementById('humidity-range').value = 70;
    document.getElementById('ph').value = 6.5;
    document.getElementById('ph-range').value = 6.5;
    document.getElementById('rainfall').value = 120;
    document.getElementById('rainfall-range').value = 120;
    document.getElementById('soil-type').value = 'loamy';
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', function() {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    }));
}

function initLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    let currentLanguage = 'en';
    
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            if (currentLanguage === 'en') {
                currentLanguage = 'hi';
                languageToggle.textContent = 'English';
                translateToHindi();
            } else {
                currentLanguage = 'en';
                languageToggle.textContent = 'हिंदी';
                translateToEnglish();
            }
        });
    }
}

function translateToHindi() {
    document.querySelector('.hero-title').textContent = 'स्मार्ट फसल सिफारिश प्रणाली';
    document.querySelector('.hero-description').textContent = 'मिट्टी की स्थिति, मौसम पैटर्न और क्षेत्रीय डेटा के आधार पर एआई-संचालित फसल सिफारिशें प्राप्त करें';
    document.querySelector('.btn-primary').textContent = 'सिफारिश प्राप्त करें';
    document.querySelector('.btn-secondary').textContent = 'फसल डेटा देखें';
    document.querySelector('.section-title').textContent = 'फसल सिफारिश';
    document.querySelector('.section-subtitle').textContent = 'अपनी भूमि के लिए सर्वोत्तम फसल सिफारिशें प्राप्त करने के लिए अपना कृषि विवरण दर्ज करें।';
}

function translateToEnglish() {
    document.querySelector('.hero-title').textContent = 'Smart Crop Recommendation System';
    document.querySelector('.hero-description').textContent = 'Get AI-powered crop recommendations based on soil conditions, weather patterns, and regional data to maximize your agricultural yield.';
    document.querySelector('.btn-primary').textContent = 'Get Recommendation';
    document.querySelector('.btn-secondary').textContent = 'View Crop Data';
    document.querySelector('.section-title').textContent = 'Crop Recommendation';
    document.querySelector('.section-subtitle').textContent = 'Enter your agricultural details to get the best crop recommendations for your land.';
}

function initFormFunctionality() {
    // Range and number input synchronization
    const rangeInputs = document.querySelectorAll('.range-input');
    rangeInputs.forEach(range => {
        const numberInput = document.getElementById(range.id.replace('-range', ''));
        
        if (numberInput) {
            range.addEventListener('input', function() {
                numberInput.value = this.value;
            });
            
            numberInput.addEventListener('input', function() {
                range.value = this.value;
            });
        }
    });

    // Form submission
    const cropForm = document.getElementById('crop-form');
    
    if (cropForm) {
        cropForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await submitCropForm();
        });
    }

    // Reset form
    const resetBtn = document.getElementById('reset-form');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetForm();
        });
    }

    // Close result
    const closeResult = document.getElementById('close-result');
    const resultContainer = document.getElementById('result');
    if (closeResult && resultContainer) {
        closeResult.addEventListener('click', function() {
            resultContainer.classList.add('hidden');
        });
    }

    const clearHistoryButton = document.getElementById('clear-history');
    if (clearHistoryButton) {
        clearHistoryButton.addEventListener('click', function() {
            localStorage.removeItem('recommendationHistory');
            renderRecommendationHistory();
            showNotification('✅ Recommendation history cleared.', 'info');
        });
    }
    
    // Add sample data buttons
    addSampleDataButtons();
    // Soil image analyzer
    initSoilImageFunctionality();
}


function addSampleDataButtons() {
    const formActions = document.querySelector('.form-actions');
    if (!formActions) return;
    
    const sampleDropdown = document.createElement('select');
    sampleDropdown.className = 'btn btn-secondary';
    sampleDropdown.style.marginRight = '10px';
    sampleDropdown.style.padding = '12px 20px';
    sampleDropdown.innerHTML = `
        <option value="">📋 Select Crop Sample</option>
        <option value="rice">🌾 Rice (Paddy)</option>
        <option value="wheat">🌾 Wheat</option>
        <option value="maize">🌽 Maize</option>
        <option value="cotton">👕 Cotton</option>
        <option value="chickpea">🌱 Chickpea</option>
        <option value="sugarcane">🍬 Sugarcane</option>
    `;
    
    sampleDropdown.addEventListener('change', function(e) {
        const value = e.target.value;
        if (value && SAMPLE_DATA[value]) {
            loadSampleData(SAMPLE_DATA[value]);
            showNotification(`✅ Loaded ${SAMPLE_DATA[value].name}`, 'success');
        }
        this.value = '';
    });
    
    formActions.insertBefore(sampleDropdown, formActions.firstChild);
}

function loadSampleData(sample) {
    document.getElementById('nitrogen').value = sample.N;
    document.getElementById('nitrogen-range').value = sample.N;
    document.getElementById('phosphorus').value = sample.P;
    document.getElementById('phosphorus-range').value = sample.P;
    document.getElementById('potassium').value = sample.K;
    document.getElementById('potassium-range').value = sample.K;
    document.getElementById('temperature').value = sample.temperature;
    document.getElementById('temperature-range').value = sample.temperature;
    document.getElementById('humidity').value = sample.humidity;
    document.getElementById('humidity-range').value = sample.humidity;
    document.getElementById('ph').value = sample.ph;
    document.getElementById('ph-range').value = sample.ph;
    document.getElementById('rainfall').value = sample.rainfall;
    document.getElementById('rainfall-range').value = sample.rainfall;
    document.getElementById('soil-type').value = sample.soil_type;
}

function initWeatherFunctionality() {
    const fetchWeatherBtn = document.getElementById('fetch-weather');
    const applyWeatherBtn = document.getElementById('apply-weather');
    const cityInput = document.getElementById('city-input');
    
    if (fetchWeatherBtn) {
        fetchWeatherBtn.addEventListener('click', async function() {
            await fetchWeatherData();
        });
    }
    
    if (applyWeatherBtn) {
        applyWeatherBtn.addEventListener('click', function() {
            applyWeatherToForm();
        });
    }
    
    if (cityInput) {
        cityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                fetchWeatherData();
            }
        });
        cityInput.placeholder = 'e.g., Mumbai, Delhi, Bangalore';
    }
}

function initSoilImageFunctionality() {
    const analyzeButton = document.getElementById('analyze-soil-image');
    const fileInput = document.getElementById('soil-image-input');
    const previewBox = document.getElementById('soil-image-preview-box');
    const previewImage = document.getElementById('soil-image-preview');

    if (!analyzeButton || !fileInput) return;

    fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewBox.classList.remove('hidden');
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    });

    analyzeButton.addEventListener('click', async function (e) {
        e.preventDefault();

        if (!fileInput.files || fileInput.files.length === 0) {
            showNotification('⚠️ Please choose a soil image to analyze.', 'error');
            return;
        }

        const file = fileInput.files[0];

        if (!file.type.startsWith('image/')) {
            showNotification('⚠️ Please upload a valid image file.', 'error');
            return;
        }

        analyzeButton.disabled = true;
        const oldText = analyzeButton.innerHTML;
        analyzeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

        try {
            const formData = new FormData();
            formData.append('soil_image', file);

            const response = await fetch(`${API_BASE_URL}/soil-image`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                const result = document.getElementById('soil-image-result');
                if (result) {
                    result.classList.remove('hidden');
                }
                document.getElementById('soil-image-type').textContent = data.soil_type || 'Unknown';
                document.getElementById('soil-image-moisture').textContent = data.moisture_status || 'Unknown';
                document.getElementById('soil-image-condition').textContent = data.soil_condition || '--';
                document.getElementById('soil-image-score').textContent = data.health_score || '--';
                document.getElementById('soil-image-crops').textContent = (data.recommended_crops || []).join(', ') || 'No recommendations';
                document.getElementById('soil-image-action').textContent = data.health_score >= 75 ? 'Soil is good. Continue maintenance and crop rotation.' : 'Soil needs improvement. Add compost and organic matter.';
                document.getElementById('soil-image-nextstep').textContent = data.health_score >= 75 ? 'Plant crops with confidence and monitor moisture.' : 'Test nutrients and apply recommended fertilizers.';
                showNotification('✅ Soil image analyzed successfully!', 'success');

                // update soil type input if available
                const soilTypeInput = document.getElementById('soil-type');
                if (soilTypeInput && data.soil_type) {
                    const normalized = data.soil_type.toLowerCase().includes('sandy') ? 'sandy' : data.soil_type.toLowerCase().includes('clay') ? 'clay' : 'loamy';
                    soilTypeInput.value = normalized;
                }
            } else {
                showNotification('❌ ' + (data.error || 'Soil image analysis failed'), 'error');
            }
        } catch (error) {
            console.error('Soil image analysis error:', error);
            showNotification('❌ Could not analyze soil image. Please try again.', 'error');
        } finally {
            analyzeButton.disabled = false;
            analyzeButton.innerHTML = oldText;
        }
    });
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Weather Functions
async function fetchWeatherData() {
    const cityInput = document.getElementById('city-input');
    const fetchWeatherBtn = document.getElementById('fetch-weather');
    const weatherDisplay = document.getElementById('weather-display');
    
    const cityName = cityInput.value.trim();
    if (!cityName) {
        showNotification('Please enter a city name', 'error');
        return;
    }
    
    const originalText = fetchWeatherBtn.innerHTML;
    fetchWeatherBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';
    fetchWeatherBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/weather/${encodeURIComponent(cityName)}`);
        const data = await response.json();
        
        if (data.success) {
            const weather = data.weather;
            
            document.getElementById('weather-temp').textContent = `${weather.temperature}°C`;
            document.getElementById('weather-humidity').textContent = `${weather.humidity}%`;
            document.getElementById('weather-rainfall').textContent = `${weather.precipitation}mm`;
            document.getElementById('weather-condition').textContent = weather.condition;
            
            // Add weather icon
            let weatherIcon = document.getElementById('weather-icon');
            if (!weatherIcon) {
                weatherIcon = document.createElement('img');
                weatherIcon.id = 'weather-icon';
                weatherIcon.style.width = '50px';
                weatherIcon.style.height = '50px';
                const weatherInfo = document.querySelector('.weather-info');
                if (weatherInfo) {
                    weatherInfo.prepend(weatherIcon);
                }
            }
            if (weather.icon) {
                weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
            }
            
            // Add weather advice
            let weatherAdvice = document.getElementById('weather-advice');
            if (!weatherAdvice) {
                weatherAdvice = document.createElement('div');
                weatherAdvice.id = 'weather-advice';
                weatherAdvice.className = 'weather-advice';
                weatherDisplay.appendChild(weatherAdvice);
            }
            
            weatherAdvice.innerHTML = `<i class="fas fa-info-circle"></i> ${weather.advice}`;
            
            weatherDisplay.classList.remove('hidden');
            showNotification(`✅ Weather data for ${cityName} loaded`, 'success');
        } else {
            showNotification(data.error || 'Could not fetch weather data', 'error');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showNotification('Error fetching weather data. Please try again.', 'error');
    } finally {
        fetchWeatherBtn.innerHTML = originalText;
        fetchWeatherBtn.disabled = false;
    }
}

function applyWeatherToForm() {
    const temp = document.getElementById('weather-temp').textContent.replace('°C', '');
    const humidity = document.getElementById('weather-humidity').textContent.replace('%', '');
    const rainfall = document.getElementById('weather-rainfall').textContent.replace('mm', '');
    
    if (temp !== '--') {
        document.getElementById('temperature').value = parseFloat(temp);
        document.getElementById('temperature-range').value = parseFloat(temp);
    }
    
    if (humidity !== '--') {
        document.getElementById('humidity').value = parseFloat(humidity);
        document.getElementById('humidity-range').value = parseFloat(humidity);
    }
    
    if (rainfall !== '--') {
        document.getElementById('rainfall').value = parseFloat(rainfall);
        document.getElementById('rainfall-range').value = parseFloat(rainfall);
    }
    
    showNotification('✅ Weather data applied to form', 'success');
}

// Form Submission
async function submitCropForm() {
    const cropForm = document.getElementById('crop-form');
    const resultContainer = document.getElementById('result');
    const submitBtn = cropForm.querySelector('button[type="submit"]');
    
    const formData = {
        N: Number(document.getElementById('nitrogen').value),
        P: Number(document.getElementById('phosphorus').value),
        K: Number(document.getElementById('potassium').value),
        temperature: Number(document.getElementById('temperature').value),
        humidity: Number(document.getElementById('humidity').value),
        ph: Number(document.getElementById('ph').value),
        rainfall: Number(document.getElementById('rainfall').value),
        soil_type: document.getElementById('soil-type').value
    };
    
    // Validate all fields are filled
    for (const [key, value] of Object.entries(formData)) {
        if (value === null || value === undefined || value === '') {
            showNotification(`⚠️ Please fill the ${key} field`, 'error');
            return;
        }

        if (key !== 'soil_type' && Number.isNaN(Number(value))) {
            showNotification(`⚠️ ${key} must be a valid number`, 'error');
            return;
        }
    }
    
    if (!validateFormData(formData)) {
        return;
    }
    
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            updateRecommendationResults(data);
            
            await analyzeSoilHealth(formData);
            
            resultContainer.classList.remove('hidden');
            resultContainer.scrollIntoView({ behavior: 'smooth' });
            showNotification('✅ Crop recommendations generated!', 'success');
        } else {
            showNotification('❌ Error: ' + (data.error || 'Unknown error occurred'), 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        if (error.message.includes('Failed to fetch')) {
            showNotification('❌ Cannot connect to backend. Please make sure it\'s running on port 5001.', 'error');
        } else {
            showNotification('❌ Error connecting to server. Please try again.', 'error');
        }
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function analyzeSoilHealth(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/soil-health`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('soil-score').textContent = data.overall;
            document.getElementById('soil-category').textContent = data.category;
            document.getElementById('soil-n').textContent = data.parameters.nitrogen + '%';
            document.getElementById('soil-p').textContent = data.parameters.phosphorus + '%';
            document.getElementById('soil-k').textContent = data.parameters.potassium + '%';
            document.getElementById('soil-ph').textContent = data.parameters.ph + '%';
            
            // Add soil interpretation
            let soilInterpretation = document.getElementById('soil-interpretation');
            if (!soilInterpretation) {
                const soilCard = document.querySelector('.soil-health-card');
                if (soilCard) {
                    soilInterpretation = document.createElement('div');
                    soilInterpretation.id = 'soil-interpretation';
                    soilInterpretation.className = 'soil-interpretation';
                    soilCard.appendChild(soilInterpretation);
                }
            }
            
            if (soilInterpretation && data.interpretation) {
                soilInterpretation.innerHTML = `
                    <h5>🌱 Soil Health Analysis:</h5>
                    <p><strong>🌿 Nitrogen (${data.interpretation.nitrogen.value}):</strong> ${data.interpretation.nitrogen.advice}</p>
                    <p><strong>🌱 Phosphorus (${data.interpretation.phosphorus.value}):</strong> ${data.interpretation.phosphorus.advice}</p>
                    <p><strong>🍂 Potassium (${data.interpretation.potassium.value}):</strong> ${data.interpretation.potassium.advice}</p>
                    <p><strong>🧪 pH Level (${data.interpretation.ph.value}):</strong> ${data.interpretation.ph.advice}</p>
                `;
            }
        }
    } catch (error) {
        console.error('Soil analysis error:', error);
    }
}

function validateFormData(formData) {
    const ranges = {
        N: { min: 0, max: 140 },
        P: { min: 0, max: 145 },
        K: { min: 0, max: 205 },
        temperature: { min: 0, max: 50 },
        humidity: { min: 0, max: 100 },
        ph: { min: 3, max: 10 },
        rainfall: { min: 0, max: 300 }
    };

    for (const [key, value] of Object.entries(formData)) {
        if (key === 'soil_type') {
            if (!value) {
                showNotification('⚠️ Please select a soil type.', 'error');
                return false;
            }
            continue;
        }

        const num = Number(value);
        if (Number.isNaN(num)) {
            showNotification(`⚠️ Invalid value for ${key}. Please enter a number.`, 'error');
            return false;
        }

        const range = ranges[key];
        if (range && (num < range.min || num > range.max)) {
            showNotification(`⚠️ ${key} must be between ${range.min} and ${range.max}.`, 'error');
            return false;
        }
    }
    return true;
}

function updateRecommendationResults(data) {
    const primary = data.recommendations[0];
    const secondary = data.recommendations[1] || null;
    const tertiary = data.recommendations[2] || null;
    
    // Update primary recommendation
    document.getElementById('primary-prob').textContent = `${primary.confidence}%`;
    document.getElementById('primary-crop').textContent = formatCropName(primary.crop);
    document.getElementById('primary-season').textContent = primary.growing_season || 'Variable';
    
    // Update optimal conditions with data from your CSV
    document.getElementById('optimal-crop').textContent = formatCropName(primary.crop);
    document.getElementById('optimal-temp').textContent = 
        `${Math.round(primary.avg_temperature - 5)}-${Math.round(primary.avg_temperature + 5)}°C`;
    document.getElementById('optimal-rain').textContent = 
        `${Math.round(primary.avg_rainfall - 50)}-${Math.round(primary.avg_rainfall + 50)}mm`;
    document.getElementById('optimal-ph').textContent = 
        `${(primary.avg_ph - 0.5).toFixed(1)}-${(primary.avg_ph + 0.5).toFixed(1)}`;
    document.getElementById('optimal-soil').textContent = primary.soil_types[0] || 'Loamy Soil';
    
    // Update secondary recommendation
    if (secondary) {
        document.getElementById('secondary-prob').textContent = `${secondary.confidence}%`;
        document.getElementById('secondary-crop').textContent = formatCropName(secondary.crop);
        document.getElementById('secondary-season').textContent = secondary.growing_season || 'Variable';
    }
    
    // Update tertiary recommendation
    if (tertiary) {
        document.getElementById('tertiary-prob').textContent = `${tertiary.confidence}%`;
        document.getElementById('tertiary-crop').textContent = formatCropName(tertiary.crop);
        document.getElementById('tertiary-season').textContent = tertiary.growing_season || 'Variable';
    }
    
    // Add detailed crop information
    addCropDetails(primary);

    // Save this recommendation to history
    saveRecommendationHistory(data);
}

function saveRecommendationHistory(data) {
    const history = JSON.parse(localStorage.getItem('recommendationHistory') || '[]');
    const newEntry = {
        timestamp: new Date().toISOString(),
        primary: data.recommendations[0]?.crop || 'Unknown',
        confidence: data.recommendations[0]?.confidence || 0,
        soilScore: document.getElementById('soil-score')?.textContent || 'N/A'
    };

    history.unshift(newEntry);
    localStorage.setItem('recommendationHistory', JSON.stringify(history.slice(0, 6)));
    renderRecommendationHistory();
}

function renderRecommendationHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    const history = JSON.parse(localStorage.getItem('recommendationHistory') || '[]');

    if (!history.length) {
        historyList.innerHTML = '<p class="history-empty">No recommendations yet. Get your first recommendation now.</p>';
        return;
    }

    historyList.innerHTML = '';
    history.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'history-card';
        const dt = new Date(entry.timestamp);
        card.innerHTML = `<strong>${formatCropName(entry.primary)}</strong> • ${entry.confidence}% confidence • Soil score: ${entry.soilScore}%<br><small>${dt.toLocaleString()}</small>`;
        historyList.appendChild(card);
    });
}

function addCropDetails(crop) {
    const cropDetails = document.querySelector('.crop-details');
    if (!cropDetails) return;
    
    let detailsDiv = document.getElementById('extended-crop-details');
    if (!detailsDiv) {
        detailsDiv = document.createElement('div');
        detailsDiv.id = 'extended-crop-details';
        detailsDiv.className = 'extended-crop-details';
        cropDetails.appendChild(detailsDiv);
    }
    
    const soilTypes = crop.soil_types.join(', ');
    const states = crop.states ? crop.states.join(', ') : 'Various states';
    
    detailsDiv.innerHTML = `
        <h5>🌾 Detailed Analysis for ${formatCropName(crop.crop)}:</h5>
        <p><strong>📊 Confidence:</strong> ${crop.confidence}%</p>
        <p><strong>📅 Growing Season:</strong> ${crop.growing_season}</p>
        <p><strong>💧 Water Requirement:</strong> ${crop.water_requirement}</p>
        <p><strong>⏰ Crop Duration:</strong> ${crop.duration}</p>
        <p><strong>🌱 Suitable Soil Types:</strong> ${soilTypes}</p>
        <p><strong>📍 Major Growing States:</strong> ${states}</p>
        <p><strong>🌡️ Optimal Temperature:</strong> ${Math.round(crop.avg_temperature - 5)}-${Math.round(crop.avg_temperature + 5)}°C</p>
        <p><strong>💧 Optimal Rainfall:</strong> ${Math.round(crop.avg_rainfall - 50)}-${Math.round(crop.avg_rainfall + 50)}mm</p>
        <p><strong>🧪 Optimal pH:</strong> ${(crop.avg_ph - 0.5).toFixed(1)}-${(crop.avg_ph + 0.5).toFixed(1)}</p>
    `;
}

function formatCropName(cropName) {
    return cropName.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

function resetForm() {
    setDefaultFormValues();
    
    const resultContainer = document.getElementById('result');
    const weatherDisplay = document.getElementById('weather-display');
    
    if (resultContainer) resultContainer.classList.add('hidden');
    if (weatherDisplay) weatherDisplay.classList.add('hidden');
    
    const weatherIcon = document.getElementById('weather-icon');
    if (weatherIcon) weatherIcon.remove();
    
    showNotification('✅ Form reset to default values', 'info');
}

// Crop Data Functions
async function loadCropsData() {
    const container = document.getElementById('crops-container');
    if (!container) return;
    
    container.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading crop database...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/crops`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.crops && data.crops.length > 0) {
            displayCropsData(data.crops);
        } else {
            showNotification('No crop data available', 'error');
        }
    } catch (error) {
        console.error('Error loading crops:', error);
        container.innerHTML = '<div class="error-message">Failed to load crop data</div>';
    }
}

async function displayCropsData(crops) {
    const container = document.getElementById('crops-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Display first 12 crops
    const displayCrops = crops.slice(0, 12);
    
    for (const cropName of displayCrops) {
        try {
            const response = await fetch(`${API_BASE_URL}/crop-info/${encodeURIComponent(cropName.toLowerCase())}`);
            if (response.ok) {
                const data = await response.json();
                const card = createCropCard(cropName, data);
                container.appendChild(card);
            }
        } catch (error) {
            console.error(`Error loading details for ${cropName}:`, error);
        }
    }
}

function createCropCard(cropName, cropInfo) {
    const card = document.createElement('div');
    card.className = 'crop-data-card';
    card.setAttribute('data-crop-name', cropName.toLowerCase());
    
    const name = cropInfo.name || formatCropName(cropName);
    const icon = cropInfo.icon || 'fa-seedling';
    const season = cropInfo.growing_season || 'Variable';
    const soilTypes = cropInfo.soil_types ? cropInfo.soil_types.join(', ') : 'Loamy Soil';
    const tempRange = cropInfo.avg_temperature ? 
        `${Math.round(cropInfo.avg_temperature - 5)}-${Math.round(cropInfo.avg_temperature + 5)}°C` : 
        '20-30°C';
    const rainfallRange = cropInfo.avg_rainfall ? 
        `${Math.round(cropInfo.avg_rainfall - 50)}-${Math.round(cropInfo.avg_rainfall + 50)}mm` : 
        '500-800mm';
    const phRange = cropInfo.avg_ph ? 
        `${(cropInfo.avg_ph - 0.5).toFixed(1)}-${(cropInfo.avg_ph + 0.5).toFixed(1)}` : 
        '6.0-7.0';
    const waterReq = cropInfo.water_requirement || 'Medium';
    const duration = cropInfo.duration || '90-120 days';
    
    card.innerHTML = `
        <div class="crop-data-header">
            <i class="fas ${icon}"></i>
            <h3>${name}</h3>
        </div>
        <div class="crop-data-body">
            <div class="data-item">
                <span class="data-label"><i class="fas fa-calendar"></i> Season:</span>
                <span class="data-value">${season}</span>
            </div>
            <div class="data-item">
                <span class="data-label"><i class="fas fa-temperature-half"></i> Temperature:</span>
                <span class="data-value">${tempRange}</span>
            </div>
            <div class="data-item">
                <span class="data-label"><i class="fas fa-cloud-rain"></i> Rainfall:</span>
                <span class="data-value">${rainfallRange}</span>
            </div>
            <div class="data-item">
                <span class="data-label"><i class="fas fa-flask"></i> Soil pH:</span>
                <span class="data-value">${phRange}</span>
            </div>
            <div class="data-item">
                <span class="data-label"><i class="fas fa-mountain"></i> Soil Types:</span>
                <span class="data-value">${soilTypes}</span>
            </div>
            <div class="data-item">
                <span class="data-label"><i class="fas fa-tint"></i> Water Need:</span>
                <span class="data-value">${waterReq}</span>
            </div>
            <div class="data-item">
                <span class="data-label"><i class="fas fa-clock"></i> Duration:</span>
                <span class="data-value">${duration}</span>
            </div>
        </div>
    `;
    
    return card;
}

function initCropSearch() {
    const cropSearch = document.getElementById('crop-search');
    const seasonFilter = document.getElementById('season-filter');
    const soilFilter = document.getElementById('soil-filter');
    
    if (cropSearch) {
        cropSearch.addEventListener('input', filterCrops);
    }
    
    if (seasonFilter) {
        seasonFilter.addEventListener('change', filterCrops);
    }
    
    if (soilFilter) {
        soilFilter.addEventListener('change', filterCrops);
    }
}

function filterCrops() {
    const searchTerm = document.getElementById('crop-search')?.value.toLowerCase() || '';
    const seasonFilter = document.getElementById('season-filter')?.value.toLowerCase() || '';
    const soilFilter = document.getElementById('soil-filter')?.value.toLowerCase() || '';
    
    const cropCards = document.querySelectorAll('.crop-data-card');
    let visibleCount = 0;
    
    cropCards.forEach(card => {
        const cropName = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const season = card.querySelector('.data-item:nth-child(1) .data-value')?.textContent.toLowerCase() || '';
        const soil = card.querySelector('.data-item:nth-child(5) .data-value')?.textContent.toLowerCase() || '';
        
        const nameMatch = !searchTerm || cropName.includes(searchTerm);
        const seasonMatch = !seasonFilter || season.includes(seasonFilter);
        const soilMatch = !soilFilter || soil.includes(soilFilter);
        
        const shouldShow = nameMatch && seasonMatch && soilMatch;
        card.style.display = shouldShow ? 'block' : 'none';
        if (shouldShow) visibleCount++;
    });
    
    const container = document.getElementById('crops-container');
    const noResults = container?.querySelector('.no-results');
    
    if (visibleCount === 0 && container && !noResults) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = '<i class="fas fa-search"></i> No crops match your filters';
        noResultsDiv.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 40px; color: #666;';
        container.appendChild(noResultsDiv);
    } else if (noResults && visibleCount > 0) {
        noResults.remove();
    }
}

function initCropSuitabilityChart() {
    const canvas = document.getElementById('crop-chart');
    if (!canvas || !window.Chart) return;
    
    const ctx = canvas.getContext('2d');
    
    cropChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Chickpea'],
            datasets: [{
                label: 'Suitability Score (%)',
                data: [85, 82, 78, 75, 72, 70],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(255, 193, 7, 0.8)'
                ],
                borderColor: 'rgba(46, 125, 50, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Suitability Score (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Suitability: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .notification.success { background: linear-gradient(135deg, #4CAF50, #45a049); }
    .notification.error { background: linear-gradient(135deg, #f44336, #d32f2f); }
    .notification.info { background: linear-gradient(135deg, #2196F3, #1976D2); }
    .notification i { font-size: 20px; }
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: auto;
    }
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        to { opacity: 0; transform: translateX(100%); }
    }
    .loading-spinner {
        grid-column: 1/-1;
        text-align: center;
        padding: 50px;
        color: #666;
    }
    .fa-spinner { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .weather-advice {
        margin-top: 15px;
        padding: 12px;
        background: rgba(255,255,255,0.2);
        border-radius: 6px;
        border-left: 3px solid #ffd700;
    }
    .soil-interpretation {
        margin-top: 20px;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 8px;
        border-left: 4px solid #4caf50;
    }
    .extended-crop-details {
        margin-top: 15px;
        padding: 15px;
        background: #e8f5e9;
        border-radius: 6px;
    }
    .hidden { display: none !important; }
`;
document.head.appendChild(style);