# Contributing to Cloud-Init-PXE

First off, thank you for considering contributing to Cloud-Init-PXE! It's people like you that make this project such a great tool. 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your changes
4. **Make your changes** and test them
5. **Push to your fork** and submit a pull request

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment details (OS, Docker version, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Use cases and examples
- Mockups or wireframes for UI changes

### 📝 Improving Documentation

Documentation improvements are always welcome! This includes:

- Fixing typos or clarifying existing docs
- Adding examples and tutorials
- Translating documentation
- Creating video tutorials or GIFs

### 🔧 Contributing Code

#### Areas We Need Help With:

1. **UI/UX Improvements**: Making the interface even more intuitive
2. **Cloud-Init Templates**: Adding more pre-built templates
3. **Testing**: Adding unit and integration tests
4. **API Features**: Expanding the HTTP API
5. **Security**: Implementing authentication options
6. **Performance**: Optimizing for larger deployments

## Development Setup

### Prerequisites

- Docker 20.10+ and Docker Compose v3.8+
- Node.js 18+ (for local development)
- Git
- A text editor with YAML and JavaScript support

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/cloud-init-pxe.git
cd cloud-init-pxe

# Install dependencies
npm install

# Run in development mode
docker-compose -f docker-compose-cloud-init.yml up --build

# For frontend development with hot reload
npm run dev

# Access the application
# Main interface: http://localhost:3000
# Assets: http://localhost:8080
```

### Testing Your Changes

```bash
# Build the Docker image
./build-cloud-init.sh

# Run the container
docker-compose -f docker-compose-cloud-init.yml up

# Test the following:
# 1. Web interface loads correctly
# 2. Cloud-init configs can be created/edited/deleted
# 3. TFTP server responds to requests
# 4. HTTP endpoints serve configs correctly
```

## Pull Request Process

1. **Update Documentation**: Update README.md with details of changes if needed
2. **Update CHANGELOG.md**: Add your changes under the "Unreleased" section
3. **Test Thoroughly**: Ensure all features work on both amd64 and arm64
4. **Follow Style Guidelines**: Use the existing code style
5. **Write Clear Commit Messages**: Use conventional commits format
6. **Create PR**: Provide a clear description of changes

### PR Title Format

```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
Scope: ui, api, cloud-init, docker, docs
```

Examples:
- `feat(ui): add configuration import/export`
- `fix(cloud-init): resolve yaml parsing error`
- `docs: update deployment instructions`

## Style Guidelines

### JavaScript

- Use ES6+ features
- Async/await for asynchronous code
- Meaningful variable names
- Comment complex logic
- Use JSDoc for functions

```javascript
/**
 * Saves cloud-init configuration
 * @param {string} name - Configuration name
 * @param {object} config - Configuration object
 * @returns {Promise<void>}
 */
async function saveConfig(name, config) {
    // Implementation
}
```

### CSS

- Use the existing color scheme
- Mobile-first responsive design
- Use CSS variables for theming
- Follow BEM naming convention for new components

### YAML

- Use 2 spaces for indentation
- Always validate cloud-init syntax
- Include comments for complex configurations

## Project Structure

```
├── cloud-init/           # Cloud-init logic and handlers
├── public/              # Frontend assets and views
├── config/              # Configuration files
├── root/                # Container runtime files
├── docker-*.yml         # Docker configurations
└── *.md                 # Documentation files
```

## Release Process

We use semantic versioning (MAJOR.MINOR.PATCH):

- MAJOR: Breaking changes
- MINOR: New features (backwards compatible)
- PATCH: Bug fixes

Releases are automated via GitHub Actions when a tag is pushed.

## Community

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Discord**: Join our community server (link in README)

## Recognition

Contributors will be recognized in:
- The CHANGELOG.md file
- GitHub releases
- Project documentation

Thank you for making Cloud-Init-PXE better! 🚀