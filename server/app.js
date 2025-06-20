const express = require('express');
const utils = require('express/lib/utils');
const app = express();
const PORT = process.env.PORT || 3001;

console.log('🔧 Express 3.x mime support:', express.mime ? 'Available' : 'Not available');

const testAcceptsHeader = (header) => {
  const result = utils.accepts(header);
  console.log('✅ utils.accepts working:', result);
  return result;
};

const testAcceptsArray = (types) => {
  const result = utils.acceptsArray(types);
  console.log('✅ utils.acceptsArray working:', result);
  return result;
};

const createPathRegexp = (path, keys = []) => {
  const regexp = utils.pathRegexp(path, keys, { sensitive: false, strict: false });
  console.log('✅ utils.pathRegexp working for path:', path);
  return { regexp, keys };
};

const applyLocals = (obj) => {
  const result = utils.locals(obj);
  console.log('✅ utils.locals working');
  return result;
};

const parseParameters = (str) => {
  const result = utils.parseParams(str);
  console.log('✅ utils.parseParams working');
  return result;
};

console.log('🚨 Initializing Express 3.x deprecated APIs...');
testAcceptsHeader('text/html,application/json;q=0.9');
testAcceptsArray(['text/html', 'application/json', 'application/xml']);
createPathRegexp('/api/users/:id', []);
applyLocals({ title: 'Express 3.x Demo', version: '3.21.2' });
parseParameters('charset=utf-8; boundary=something');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const advancedContentNegotiation = (req, res, next) => {
  const acceptHeader = req.headers.accept || 'application/json';
  
  const acceptsResult = testAcceptsHeader(acceptHeader);
  
  const supportedTypes = ['application/json', 'text/html', 'application/xml', 'text/plain'];
  const acceptsArrayResult = testAcceptsArray(supportedTypes);
  
  const acceptParts = acceptHeader.split(',');
  let negotiatedType = 'application/json';
  let quality = 1;
  
  for (const part of acceptParts) {
    const cleanPart = part.trim();
    if (cleanPart.includes('application/json')) {
      const params = parseParameters(cleanPart); // THIS WILL CRASH!
      negotiatedType = 'application/json';
      quality = params.q || 1;
      break;
    }
  }
  
  req.negotiatedType = { 
    value: negotiatedType,
    quality: quality,
    acceptsResult: acceptsResult,
    acceptsArrayResult: acceptsArrayResult
  };
  
  console.log(`🔧 Advanced content negotiation using deprecated APIs - Type: ${negotiatedType}`);
  next();
};

const pathMiddleware = (req, res, next) => {
  const keys = [];
  const patterns = [
    '/api/stocks/:symbol',
    '/api/users/:id',
    '/api/analytics/:type?'
  ];
  
  for (const pattern of patterns) {
    const pathResult = createPathRegexp(pattern, keys); // THIS WILL CRASH!
    if (pathResult && pathResult.regexp.test(req.path)) {
      req.pathPattern = pattern;
      req.pathKeys = pathResult.keys;
      console.log(`🎯 Path matched using deprecated pathRegexp: ${pattern}`);
      break;
    }
  }
  
  next();
};

app.use(advancedContentNegotiation);
app.use(pathMiddleware);

// Mock financial data for AG Grid component
const generateFinancialData = (count = 50) => {
  const companies = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive' },
    { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology' },
    { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Entertainment' },
    { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
    { symbol: 'ORCL', name: 'Oracle Corp.', sector: 'Technology' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial' },
    { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial' },
    { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
    { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer' }
  ];

  return Array.from({ length: count }, (_, index) => {
    const company = companies[index % companies.length];
    const basePrice = 50 + Math.random() * 400;
    const volume = Math.floor(500000 + Math.random() * 10000000);
    const change = (Math.random() - 0.5) * 30;
    const changePercent = (change / basePrice) * 100;
    
    return {
      id: index + 1,
      symbol: `${company.symbol}${index > companies.length - 1 ? (Math.floor(index / companies.length) + 1) : ''}`,
      companyName: company.name,
      price: parseFloat(basePrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: volume,
      marketCap: parseFloat((basePrice * (500000 + Math.random() * 50000000)).toFixed(0)),
      pe: parseFloat((8 + Math.random() * 40).toFixed(2)),
      dividend: parseFloat((Math.random() * 6).toFixed(2)),
      beta: parseFloat((0.3 + Math.random() * 2).toFixed(2)),
      sector: company.sector,
      lastUpdated: new Date().toISOString()
    };
  });
};

// Mock user data for forms
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', active: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', active: true },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', active: false },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'manager', active: true }
];

// Mock analytics data
const generateAnalyticsData = () => ({
  pageViews: Math.floor(1000 + Math.random() * 9000),
  uniqueVisitors: Math.floor(500 + Math.random() * 2000),
  bounceRate: parseFloat((0.2 + Math.random() * 0.6).toFixed(2)),
  avgSessionDuration: Math.floor(120 + Math.random() * 300),
  topPages: [
    { path: '/dashboard', views: Math.floor(200 + Math.random() * 800) },
    { path: '/analytics', views: Math.floor(150 + Math.random() * 600) },
    { path: '/users', views: Math.floor(100 + Math.random() * 400) }
  ]
});

// API Routes

// Financial data endpoints for AG Grid
app.get('/api/stocks', (req, res) => {
  const count = parseInt(req.query.count) || 50;
  const sector = req.query.sector;
  
  let data = generateFinancialData(count);
  
  if (sector) {
    data = data.filter(stock => stock.sector.toLowerCase() === sector.toLowerCase());
  }
  
  // Sort by various criteria
  const sortBy = req.query.sortBy || 'symbol';
  const sortOrder = req.query.order === 'desc' ? -1 : 1;
  
  data.sort((a, b) => {
    if (typeof a[sortBy] === 'string') {
      return sortOrder * a[sortBy].localeCompare(b[sortBy]);
    }
    return sortOrder * (a[sortBy] - b[sortBy]);
  });

  console.log(`GET /api/stocks - Content-Type negotiated: ${req.negotiatedType.value}`);
  console.log(`🎯 Path pattern: ${req.pathPattern || 'none'}`);

  res.json({
    data,
    total: data.length,
    timestamp: new Date().toISOString(),
    contentType: req.negotiatedType.value,
    deprecatedAPIsUsed: {
      accepts: !!req.negotiatedType.acceptsResult,
      acceptsArray: !!req.negotiatedType.acceptsArrayResult,
      pathRegexp: !!req.pathPattern
    }
  });
});

// Stock details endpoint
app.get('/api/stocks/:symbol', (req, res) => {
  const symbol = req.params.symbol;
  const stock = generateFinancialData(100).find(s => s.symbol === symbol);
  
  if (!stock) {
    return res.status(404).json({
      error: 'Stock not found',
      symbol: symbol,
      contentType: req.negotiatedType.value
    });
  }

  // Add historical data
  const historicalData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: stock.price + (Math.random() - 0.5) * 20,
    volume: stock.volume + Math.floor((Math.random() - 0.5) * 1000000)
  })).reverse();

  res.json({
    ...stock,
    historical: historicalData,
    contentType: req.negotiatedType.value,
    pathPattern: req.pathPattern
  });
});

// User management endpoints for forms
app.get('/api/users', (req, res) => {
  const active = req.query.active;
  let users = [...mockUsers];
  
  if (active !== undefined) {
    users = users.filter(user => user.active === (active === 'true'));
  }

  console.log(`GET /api/users - Content-Type: ${req.negotiatedType.value}`);

  res.json({
    users,
    total: users.length,
    contentType: req.negotiatedType.value,
    deprecatedAPIsWorking: true
  });
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: mockUsers.length + 1,
    name: req.body.name,
    email: req.body.email,
    role: req.body.role || 'user',
    active: req.body.active !== false
  };

  mockUsers.push(newUser);

  console.log(`POST /api/users - Created user: ${newUser.name}`);

  res.status(201).json({
    user: newUser,
    message: 'User created successfully',
    contentType: req.negotiatedType.value
  });
});

app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found',
      contentType: req.negotiatedType.value
    });
  }

  mockUsers[userIndex] = { ...mockUsers[userIndex], ...req.body };

  res.json({
    user: mockUsers[userIndex],
    message: 'User updated successfully',
    contentType: req.negotiatedType.value,
    pathPattern: req.pathPattern
  });
});

// Analytics endpoint for dashboard
app.get('/api/analytics', (req, res) => {
  const data = generateAnalyticsData();
  
  console.log(`GET /api/analytics - Content-Type: ${req.negotiatedType.value}`);

  res.json({
    ...data,
    timestamp: new Date().toISOString(),
    contentType: req.negotiatedType.value
  });
});

// Form validation endpoint
app.post('/api/validate', (req, res) => {
  const { field, value, rules } = req.body;
  
  const errors = [];
  
  if (rules.required && (!value || value.trim() === '')) {
    errors.push(`${field} is required`);
  }
  
  if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errors.push(`${field} must be a valid email`);
  }
  
  if (rules.minLength && value && value.length < rules.minLength) {
    errors.push(`${field} must be at least ${rules.minLength} characters`);
  }

  res.json({
    valid: errors.length === 0,
    errors,
    field,
    contentType: req.negotiatedType.value
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    contentType: req.negotiatedType.value,
  });
});

app.get('/api/express-apis', (req, res) => {
  const results = {};
  
  results.accepts = testAcceptsHeader(req.headers.accept || 'application/json');
  results.acceptsArray = testAcceptsArray(['text/html', 'application/json']);
  results.pathRegexp = createPathRegexp('/api/test/:id', []);
  results.locals = applyLocals({ demo: true, timestamp: Date.now() });
  results.parseParams = parseParameters('q=0.8; charset=utf-8');
  
  const parseAcceptResult = utils.parseAccept(req.headers.accept || 'application/json');
  
  res.json({
    message: 'Express API Analysis',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    contentType: req.negotiatedType?.value || 'application/json'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method,
    contentType: req.negotiatedType?.value || 'application/json'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Express 4.21.0 Server running on port ${PORT}`);
  console.log(`📊 Financial API: http://localhost:${PORT}/api/stocks`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`📈 Analytics API: http://localhost:${PORT}/api/analytics`);
  console.log(`🔧 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app; 