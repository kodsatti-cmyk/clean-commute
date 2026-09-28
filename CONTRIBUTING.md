# Contributing to Clean Commute Challenge

Thank you for your interest in contributing to the Clean Commute Challenge tracker! This guide will help you get started.

## Getting Started

1. **Fork and clone** the repository
2. **Set up your environment** following the README
3. **Create a branch** for your changes
4. **Make your changes** and test them
5. **Submit a pull request**

## Development Workflow

### 1. Setting Up Your Environment

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/clean-commute-challenge.git
cd clean-commute-challenge

# Install dependencies
npm install

# Create .env.local for local development
cp .env.local.example .env.local
```

### 2. Making Changes

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# ... edit files ...

# Test locally
npm run dev
```

### 3. Code Style

- Use TypeScript for all new code
- Follow existing code formatting (we use ESLint)
- Write meaningful commit messages
- Keep components small and focused
- Use Tailwind CSS for styling (no custom CSS unless necessary)

### 4. Testing Your Changes

Before submitting:

- [ ] Test on mobile (Chrome DevTools responsive mode)
- [ ] Test the QR code flow end-to-end
- [ ] Verify form validation works
- [ ] Check dashboard displays correctly with and without data
- [ ] Run `npm run build` to ensure it builds successfully

### 5. Submitting a Pull Request

```bash
# Commit your changes
git add .
git commit -m "feat: add feature description"

# Push to your fork
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub with:
- A clear title describing what you changed
- Description of the changes and why they're needed
- Screenshots (if UI changes)
- Testing notes

## Commit Message Convention

We use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add email notifications for milestones
fix: correct QR code encoding for special characters
docs: update deployment instructions
```

## Areas Where We Need Help

### High Priority
- [ ] Add unit tests
- [ ] Add integration tests for API routes
- [ ] Improve mobile responsiveness
- [ ] Add loading states to dashboard
- [ ] Error boundary components

### Medium Priority
- [ ] Dark mode support
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Offline support with service worker
- [ ] Print-optimized dashboard view
- [ ] Admin authentication

### Nice to Have
- [ ] Gamification features (badges, leaderboards)
- [ ] Push notifications
- [ ] Weekly email summaries
- [ ] CO₂ savings calculator
- [ ] Integration with corporate calendars

## Code Review Process

1. A maintainer will review your PR within 2-3 days
2. Address any feedback
3. Once approved, a maintainer will merge your PR
4. Your changes will be deployed to production

## Questions?

- Open an issue for bugs or feature requests
- Tag issues with appropriate labels
- Be respectful and constructive in all interactions

## Code of Conduct

- Be kind and respectful
- Welcome newcomers
- Provide constructive feedback
- Focus on the goal: helping people track sustainable commutes

Thank you for contributing to a more sustainable future! 🌱
