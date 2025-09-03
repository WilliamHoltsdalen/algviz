# Contributing to AlgViz

Thanks for your interest in contributing!

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
```bash
git clone https://github.com/WilliamHoltsdalen/algviz.git
cd algviz
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Pull requests
- Keep PRs focused and small when possible.
- Include a clear description and screenshots for UI changes.
- Ensure `npm run build` succeeds and lints are clean.

## Issues
- For bugs, please include steps to reproduce, expected vs actual behavior, and screenshots.
- For features, describe the problem and the desired outcome.

## Commit messages
We prefer [Conventional Commits](https://www.conventionalcommits.org/) for clear history and better automation.

- Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `style`, `revert`
- Format: `type(scope): short imperative summary`
- Keep the subject concise. Use the body to explain the why when necessary.

Examples:
- `feat(visualizer): add restart button`
- `fix(tester): handle empty input without crash`
- `docs: add contributing guide`
- `chore: bump dependencies`

## Code of Conduct
Be respectful and constructive :) 
