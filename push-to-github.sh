#!/bin/bash

# Clean Commute Challenge - GitHub Push Helper
# This script helps you push the code to GitHub

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Clean Commute Challenge - GitHub Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    echo "   cd /Users/kodsatti/Desktop/clean-commute-challenge"
    echo "   ./push-to-github.sh"
    exit 1
fi

echo "📋 Current Status:"
echo "   ✅ Git repository initialized"
echo "   ✅ $(git log --oneline | wc -l | tr -d ' ') commits ready"
echo ""

# Check if Git is configured
GIT_NAME=$(git config user.name)
GIT_EMAIL=$(git config user.email)

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
    echo "⚙️  Git Configuration Needed"
    echo ""
    echo "Let's set up your Git identity:"
    echo ""
    
    read -p "Enter your name (e.g., 'John Doe'): " USER_NAME
    read -p "Enter your email (e.g., 'john@example.com'): " USER_EMAIL
    
    git config user.name "$USER_NAME"
    git config user.email "$USER_EMAIL"
    
    echo ""
    echo "✅ Git configured:"
    echo "   Name: $USER_NAME"
    echo "   Email: $USER_EMAIL"
    echo ""
else
    echo "✅ Git already configured:"
    echo "   Name: $GIT_NAME"
    echo "   Email: $GIT_EMAIL"
    echo ""
fi

# Check if remote exists
REMOTE=$(git remote get-url origin 2>/dev/null)

if [ -z "$REMOTE" ]; then
    echo "📦 Repository Setup"
    echo ""
    echo "Have you created a GitHub repository yet?"
    echo ""
    echo "If NO, do this first:"
    echo "  1. Go to https://github.com/new"
    echo "  2. Name: clean-commute-challenge"
    echo "  3. Click 'Create repository'"
    echo "  4. Come back here"
    echo ""
    read -p "Press Enter when you've created the repository..."
    echo ""
    
    read -p "Enter your GitHub username: " GITHUB_USER
    
    echo ""
    echo "Choose authentication method:"
    echo "  1) HTTPS (easier, uses token)"
    echo "  2) SSH (more secure, requires key setup)"
    echo ""
    read -p "Choose (1 or 2): " AUTH_METHOD
    
    if [ "$AUTH_METHOD" = "1" ]; then
        REPO_URL="https://github.com/$GITHUB_USER/clean-commute-challenge.git"
    else
        REPO_URL="git@github.com:$GITHUB_USER/clean-commute-challenge.git"
    fi
    
    git remote add origin "$REPO_URL"
    echo ""
    echo "✅ Remote added: $REPO_URL"
    echo ""
else
    echo "✅ Remote already configured:"
    echo "   $REMOTE"
    echo ""
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" = "master" ]; then
    echo "🔄 Renaming branch from 'master' to 'main'..."
    git branch -M main
    CURRENT_BRANCH="main"
    echo "✅ Branch renamed to 'main'"
    echo ""
fi

echo "🚀 Ready to push!"
echo ""
echo "The following will be pushed:"
echo "  • Branch: $CURRENT_BRANCH"
echo "  • Remote: $(git remote get-url origin)"
echo "  • Commits: $(git log --oneline | wc -l | tr -d ' ')"
echo ""

read -p "Push to GitHub now? (y/n): " CONFIRM

if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
    echo ""
    echo "🔄 Pushing to GitHub..."
    echo ""
    
    git push -u origin $CURRENT_BRANCH
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "  ✅ SUCCESS! Code pushed to GitHub"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "🌐 View your repository at:"
        echo "   $(git remote get-url origin | sed 's/\.git$//')"
        echo ""
        echo "📝 Next Steps:"
        echo "   1. Visit https://vercel.com"
        echo "   2. Import your GitHub repository"
        echo "   3. Follow DEPLOYMENT.md for setup"
        echo ""
        echo "🎉 You're ready to deploy!"
        echo ""
    else
        echo ""
        echo "❌ Push failed. Common issues:"
        echo ""
        echo "If authentication failed:"
        echo "  • HTTPS: Use a Personal Access Token as password"
        echo "    Get one at: https://github.com/settings/tokens"
        echo ""
        echo "  • SSH: Set up SSH key"
        echo "    See: GITHUB_SETUP.md"
        echo ""
        echo "Need help? Check GITHUB_SETUP.md for details"
        echo ""
    fi
else
    echo ""
    echo "ℹ️  Push cancelled. Run this script again when ready."
    echo ""
fi
