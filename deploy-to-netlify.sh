#!/bin/bash

# AskNyumbani Admin Dashboard - Netlify Deployment Script
# Developed by Codzure Solutions Limited
# This script helps you quickly deploy to Netlify

set -e

echo "🚀 AskNyumbani Admin Dashboard - Netlify Deployment"
echo "   Developed by Codzure Solutions Limited"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20.x or higher."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Node.js version should be 18 or higher. Current: $(node -v)"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Netlify CLI not found. Installing..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI installed successfully"
fi

echo ""
echo "Select deployment option:"
echo "1) Login to Netlify (first time setup)"
echo "2) Initialize new Netlify site"
echo "3) Deploy to Netlify (production)"
echo "4) Deploy to Netlify (draft/preview)"
echo "5) Check deployment status"
echo "6) Open Netlify dashboard"
echo "7) Run local build test"
echo ""
read -p "Enter option (1-7): " option

case $option in
    1)
        echo "🔐 Logging into Netlify..."
        netlify login
        echo "✅ Logged in successfully"
        ;;
    2)
        echo "🏗️  Initializing Netlify site..."
        echo ""
        echo "Note: You'll be asked to:"
        echo "  - Create new site or link existing"
        echo "  - Choose team"
        echo "  - Set site name (e.g., asknyumbani-admin)"
        echo ""
        netlify init
        echo ""
        echo "✅ Site initialized!"
        echo "Next steps:"
        echo "  1. Go to Netlify dashboard"
        echo "  2. Set environment variables (see DEPLOYMENT.md)"
        echo "  3. Run option 3 to deploy"
        ;;
    3)
        echo "🚀 Deploying to production..."
        echo ""

        # Check if .env.local exists
        if [ ! -f .env.local ]; then
            echo "⚠️  Warning: .env.local not found"
            echo "Make sure environment variables are set in Netlify dashboard"
            read -p "Continue deployment? (y/n) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi

        # Run build
        echo "📦 Building application..."
        npm run build

        # Deploy
        echo "🚀 Deploying to production..."
        netlify deploy --prod

        echo ""
        echo "✅ Deployment complete!"
        echo "Check your site at: $(netlify status --json | grep -o '"url":"[^"]*' | cut -d'"' -f4)"
        ;;
    4)
        echo "🧪 Deploying draft/preview..."
        npm run build
        netlify deploy
        echo ""
        echo "✅ Draft deployed!"
        echo "Check preview URL above to test before production deploy"
        ;;
    5)
        echo "📊 Checking deployment status..."
        netlify status
        ;;
    6)
        echo "🌐 Opening Netlify dashboard..."
        netlify open
        ;;
    7)
        echo "🔨 Running local build test..."
        echo ""

        # Clean previous builds
        echo "🧹 Cleaning previous builds..."
        rm -rf .next

        # Install dependencies
        echo "📦 Installing dependencies..."
        npm install

        # Run build
        echo "🔨 Building..."
        npm run build

        # Check build success
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Build successful!"
            echo "Your app is ready for deployment"

            # Show build size
            if [ -d ".next" ]; then
                echo ""
                echo "📊 Build size:"
                du -sh .next
            fi
        else
            echo ""
            echo "❌ Build failed"
            echo "Please check the errors above and fix them before deploying"
            exit 1
        fi
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "=================================================="
echo "For more information, see DEPLOYMENT.md"
echo "© 2024 Codzure Solutions Limited"
echo "=================================================="
