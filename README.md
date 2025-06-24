# Dependency Upgrade Analyzer

[![E2E Tests](https://github.com/EtaySchur/ts-diff/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/EtaySchur/ts-diff/actions/workflows/e2e-tests.yml)

A comprehensive tool for analyzing dependency upgrades and detecting breaking changes in JavaScript/TypeScript projects. Features real-world examples of deprecated APIs, migration patterns, and breaking change demonstrations.

## 🎯 Purpose

This tool helps developers:
- **Analyze breaking changes** before upgrading dependencies
- **Test deprecated APIs** in controlled environments
- **Understand migration patterns** with real-world examples
- **Detect compatibility issues** across different package versions

## 🚀 Features

### Real-World Breaking Change Examples
- **Express 3.x → 4.x**: Demonstrates removed internal APIs (`utils.accepts`, `utils.pathRegexp`, etc.)
- **AG Grid 28.x → 31.x**: Shows deprecated chart and selection APIs
- **React Hook Form 6.x → 7.x**: Migration patterns for form validation
- **Formik Legacy APIs**: Examples of deprecated patterns and modern alternatives

### Interactive Dashboard
- Financial data grid with deprecated AG Grid APIs
- Form validation examples using legacy patterns
- Real-time API testing with breaking change detection
- Content negotiation middleware using removed Express utilities

### Analysis Tools
- Package usage finder with AST analysis
- Symbol usage tracking across codebases
- Import pattern detection (ES6, CommonJS, AMD, UMD)
- Breaking change impact assessment

## 🛠 Installation

```bash
git clone <repository-url>
cd dependency-upgrade-analyzer
npm install
```

## 🏃‍♂️ Quick Start

### Start the Development Server
```bash
npm start
```
Opens the React dashboard at http://localhost:8080

### Start the API Server
```bash
npm run server
```
Starts the Express server at http://localhost:3001

### Run Both Simultaneously
```bash
npm run dev
```

## 📊 API Endpoints

### Breaking Change Demonstrations
- `GET /api/health` - Server health with deprecated API status
- `GET /api/deprecated-apis-demo` - Comprehensive breaking change examples
- `GET /api/stocks` - Financial data using deprecated AG Grid patterns

### Real-World Data
- `GET /api/stocks?count=50&sector=Technology` - Stock market data
- `GET /api/users` - User management examples
- `GET /api/analytics` - Dashboard analytics data

## 🔧 Analysis Tools

### Find Package Usage
```bash
npm run find-package-usage -- <package-name> [output-file] [search-path]
```

**Examples:**
```bash
# Analyze React usage
npm run find-package-usage -- react

# Find Express patterns with output
npm run find-package-usage -- express analysis.json ./server

# Scan Formik usage in components
npm run find-package-usage -- formik formik-usage.json ./src/components
```

### Symbol Usage Analysis
```bash
npm run find-symbol-usage -- <symbol-name> [output-file]
```

### Import Pattern Analysis
```bash
npm run analyze-imports -- [directory]
```

## 💥 Breaking Change Examples

### Express 3.21.2 → 4.21.0
**Removed APIs:**
- `utils.accepts()` - Content negotiation
- `utils.acceptsArray()` - Multiple content types
- `utils.pathRegexp()` - Route pattern matching
- `utils.parseParams()` - Parameter parsing
- `express.mime` - MIME type handling

**Impact:** Server crashes with `TypeError: utils.accepts is not a function`

### AG Grid 28.2.1 → 31.3.4
**Deprecated APIs:**
- `AddRangeSelectionParams` - Range selection configuration
- `AgAngleSelect` - Chart rotation controls
- `AgAreaSeriesOptions` - Chart series configuration
- `AgAxisLabelOptions` - Axis label formatting

**Impact:** Chart features break, selection APIs fail

## 🧪 Testing Breaking Changes

1. **Install old version** of dependency
2. **Run the examples** to see working functionality
3. **Upgrade to new version**
4. **Observe the crashes** and breaking changes
5. **Use migration guides** to fix issues

## 🔄 CI/CD & E2E Testing

### End-to-End Tests
This project includes comprehensive E2E tests using Playwright that validate:
- AG Grid functionality and data display
- Range selection button interactions
- Row selection and validation
- Real API data integration

```bash
# Run E2E tests locally
npm run test:e2e

# Run with UI (for debugging)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

### GitHub Actions
Automated testing runs on every pull request to `main`:
- **Triggers**: Pull requests and pushes to main branch
- **Environment**: Ubuntu latest with Node.js 18
- **Browsers**: Chromium with full dependencies
- **Servers**: Automatically starts Express (port 3001) and React (port 3000)
- **Artifacts**: Test reports and failure videos uploaded for 30 days
- **Timeout**: 60 minutes maximum

The workflow:
1. Installs dependencies and Playwright browsers
2. Starts both servers in background
3. Waits for health checks on both ports
4. Runs all E2E tests
5. Uploads test results and videos
6. Cleans up background processes

### Test Coverage
Current E2E tests validate:
- ✅ Grid loads with 20 rows (pagination)
- ✅ First 10 rows have exact expected data (AAPL, AAPL2, etc.)
- ✅ Column headers are present and visible
- ✅ Individual row checkbox selection
- ✅ Range selection buttons (5×3, 3×6, 10×6 cells)
- ✅ Selection clearing between different range buttons
- ✅ Data formatting (prices, percentages, volumes)
- ✅ Static data validation (symbols, company names)

## 📁 Project Structure

```
dependency-upgrade-analyzer/
├── src/
│   ├── components/          # React components with deprecated APIs
│   ├── utils/              # Analysis and utility tools
│   └── examples/           # Import pattern examples
├── server/
│   ├── app.js              # Express server with deprecated APIs
│   └── start.js            # Server startup script
├── *.json                  # Breaking change analysis files
└── package.json            # Dependency configurations
```

## 🔍 Analysis Files

The project includes detailed JSON files documenting breaking changes:
- `express_3.21.2_to_4.21.0.json` - Express upgrade analysis
- `ag-grid-community_28.2.1_to_31.3.4.json` - AG Grid changes
- `react-hook-form_6.15.8_to_7.0.0.json` - Form library updates
- `zod_3.17.5_to_3.22.3.json` - Schema validation changes

## 🎓 Learning Outcomes

After using this tool, you'll understand:
- **How breaking changes manifest** in real applications
- **Why IDEs don't catch all issues** (internal APIs, runtime-only changes)
- **Migration strategies** for major version upgrades
- **Testing approaches** for dependency updates
- **Impact assessment** techniques for breaking changes

## 🤝 Contributing

This tool is designed for educational and testing purposes. Feel free to:
- Add more breaking change examples
- Include additional package migrations
- Improve analysis accuracy
- Enhance documentation

## 📝 License

ISC License - See LICENSE file for details.

---

**⚠️ Important:** This tool intentionally uses deprecated and removed APIs to demonstrate breaking changes. Do not use these patterns in production code! 