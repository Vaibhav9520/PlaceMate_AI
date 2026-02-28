#!/bin/bash

# PlaceMate AI - Quick Start Script
# This script helps you start both server and client

echo "🚀 Starting PlaceMate AI..."
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running!"
    echo "Please start MongoDB first:"
    echo "  - macOS: brew services start mongodb-community"
    echo "  - Linux: sudo systemctl start mongod"
    echo "  - Windows: MongoDB should start automatically"
    exit 1
fi
echo "✅ MongoDB is running"
echo ""

# Start server in background
echo "🔧 Starting backend server..."
cd server
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

npm run dev &
SERVER_PID=$!
echo "✅ Server started (PID: $SERVER_PID)"
echo ""

# Wait a bit for server to start
sleep 3

# Start client
echo "🎨 Starting frontend client..."
cd ../client
if [ ! -d "node_modules" ]; then
    echo "📦 Installing client dependencies..."
    npm install
fi

npm run dev &
CLIENT_PID=$!
echo "✅ Client started (PID: $CLIENT_PID)"
echo ""

echo "🎉 PlaceMate AI is running!"
echo ""
echo "📍 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $SERVER_PID $CLIENT_PID; exit" INT
wait
