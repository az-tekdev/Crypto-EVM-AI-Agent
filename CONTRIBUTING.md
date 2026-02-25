# Contributing to Crypto-EVM-AI-Agent

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Workflow

### Setting Up

```bash
npm install
cd shared && npm run build && cd ..
```

### Running Tests

```bash
# All tests
npm test

# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Code Style

- Use TypeScript for all new code
- Follow existing code style and patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and small

### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add support for Arbitrum chain
fix: Resolve gas estimation error
docs: Update README with new features
refactor: Simplify token swap logic
```

## Areas for Contribution

### High Priority

- [ ] Complete contract bytecode compilation setup
- [ ] Add more DEX aggregators (0x, Paraswap)
- [ ] Implement IPFS integration for NFT metadata
- [ ] Add transaction batching support
- [ ] Improve error handling and user feedback

### Features

- [ ] Support for more EVM chains (Arbitrum, Optimism, Avalanche)
- [ ] Advanced AI strategies (market analysis, timing optimization)
- [ ] Gas optimization strategies
- [ ] Multi-wallet support in backend
- [ ] Real-time WebSocket updates
- [ ] Mobile app support

### Testing

- [ ] Add more unit tests
- [ ] Add integration tests
- [ ] Add E2E tests
- [ ] Improve test coverage

### Documentation

- [ ] Add API documentation
- [ ] Add code examples
- [ ] Improve setup guides
- [ ] Add architecture diagrams

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add tests for new features
4. Ensure code follows style guidelines
5. Request review from maintainers

## Questions?

Open an issue for questions or discussions about contributions.

Thank you for contributing! 🎉
