Write-Host "🚀 Starting AI Chatbot Backend..." -ForegroundColor Green

# Go to backend folder
cd backend

# Install dependencies
Write-Host "📦 Installing requirements..." -ForegroundColor Yellow
pip install -r requirements.txt

# Run Flask app
Write-Host "🔥 Running server..." -ForegroundColor Cyan
python app.py

# Keep terminal open
pause