#!/bin/bash

# AeroGenAI - GitHub Push Script
# This script helps you push the project to your GitHub repository

echo "🚀 AeroGenAI - GitHub Push Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized"
    exit 1
fi

echo "📋 Current Git Status:"
git status
echo ""

# Ask user for confirmation
read -p "Do you want to push to GitHub? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Push cancelled"
    exit 0
fi

# Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote 'origin' already configured"
    git remote -v
else
    echo "⚙️  Configuring remote repository..."
    git remote add origin https://github.com/JnanashreeA/aerogenai.git
    echo "✅ Remote added: https://github.com/JnanashreeA/aerogenai.git"
fi

echo ""
echo "📤 Pushing to GitHub..."

# Try to push
if git push -u origin feature/aerogenai-complete; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Next steps:"
    echo "1. Visit: https://github.com/JnanashreeA/aerogenai"
    echo "2. Create a Pull Request to merge into main branch"
    echo "3. Add topics: aerodynamics, ai, machine-learning, react, typescript"
    echo "4. Enable GitHub Pages for deployment (optional)"
    echo ""
else
    echo ""
    echo "❌ Push failed. This might be because:"
    echo "1. The repository doesn't exist yet on GitHub"
    echo "2. You don't have push permissions"
    echo "3. Authentication failed"
    echo ""
    echo "📖 Please follow the manual instructions in GITHUB_SETUP.md"
    echo ""
    exit 1
fi
