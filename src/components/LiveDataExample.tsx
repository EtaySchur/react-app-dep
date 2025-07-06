import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Stock {
  id: number;
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  dividend: number;
  beta: number;
  sector: string;
  lastUpdated: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

interface Analytics {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{ path: string; views: number }>;
  timestamp: string;
  contentType: string;
}

const LiveDataExample: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<string>('Unknown');
  const [selectedSector, setSelectedSector] = useState<string>('');

  const API_BASE_URL = 'http://localhost:3001/api';

  // Check server health
  const checkServerHealth = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      setServerStatus(`✅ Healthy (Express ${response.data.expressVersion})`);
      setError(null);
    } catch (err) {
      setServerStatus('❌ Server not running');
      setError('Server is not running. Please start with: npm run server');
    }
  }, []);

  // Fetch stocks data
  const fetchStocks = useCallback(async (sector: string = '', count: number = 20) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('count', count.toString());
      if (sector) params.append('sector', sector);
      params.append('sortBy', 'changePercent');
      params.append('order', 'desc');

      const response = await axios.get(`${API_BASE_URL}/stocks?${params.toString()}`);
      setStocks(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stocks data from Express server');
      console.error('Error fetching stocks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users?active=true`);
      setUsers(response.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, []);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics`);
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  }, []);

  // Create new user
  const createUser = useCallback(async () => {
    const names = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const email = `${randomName.toLowerCase().replace(' ', '.')}@example.com`;

    try {
      await axios.post(`${API_BASE_URL}/users`, {
        name: randomName,
        email: email,
        role: 'user',
        active: true
      });
      
      // Refresh users list
      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
    }
  }, [fetchUsers]);

  // Initial data load
  useEffect(() => {
    checkServerHealth();
    fetchStocks();
    fetchUsers();
    fetchAnalytics();
  }, [checkServerHealth, fetchStocks, fetchUsers, fetchAnalytics]);

  // Handle sector filter change
  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
    fetchStocks(sector);
  };

  const refreshAllData = () => {
    checkServerHealth();
    fetchStocks(selectedSector);
    fetchUsers();
    fetchAnalytics();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#1976d2', marginBottom: '10px' }}>
          Live Data from Express 3.21.2 Server
        </h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          This component consumes real API endpoints from the Express server using deprecated acceptParams API.
          After Express upgrade, the content negotiation middleware will break.
        </p>
        
        <div style={{ 
          padding: '10px', 
          backgroundColor: serverStatus.includes('✅') ? '#e8f5e8' : '#ffe8e8', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <strong>Server Status:</strong> {serverStatus}
        </div>

        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#ffe8e8', 
            borderRadius: '4px',
            marginBottom: '15px',
            color: '#d32f2f'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center'
      }}>
        <button 
          onClick={refreshAllData}
          disabled={loading}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Refresh All Data'}
        </button>

        <select
          value={selectedSector}
          onChange={(e) => handleSectorChange(e.target.value)}
          style={{ 
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">All Sectors</option>
          <option value="Technology">Technology</option>
          <option value="Financial">Financial</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Consumer">Consumer</option>
          <option value="Automotive">Automotive</option>
          <option value="Entertainment">Entertainment</option>
        </select>

        <button 
          onClick={createUser}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Random User
        </button>

        <button 
          onClick={checkServerHealth}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Check Server Health
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Analytics Panel */}
        {analytics && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px',
            border: '1px solid #1976d2'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>Analytics Dashboard</h3>
            <div style={{ fontSize: '14px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Page Views:</strong> {analytics.pageViews.toLocaleString()}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Unique Visitors:</strong> {analytics.uniqueVisitors.toLocaleString()}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Bounce Rate:</strong> {(analytics.bounceRate * 100).toFixed(1)}%
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Avg Session:</strong> {Math.floor(analytics.avgSessionDuration / 60)}m {analytics.avgSessionDuration % 60}s
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                Content-Type: {analytics.contentType}
              </div>
            </div>
          </div>
        )}

        {/* Users Panel */}
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f3e5f5', 
          borderRadius: '8px',
          border: '1px solid #9c27b0'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#9c27b0' }}>Active Users ({users.length})</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {users.slice(0, 8).map(user => (
              <div key={user.id} style={{ 
                padding: '8px', 
                marginBottom: '5px', 
                backgroundColor: 'white', 
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                <div style={{ color: '#666', fontSize: '12px' }}>
                  {user.email} • {user.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Stocks Panel */}
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fff3e0', 
          borderRadius: '8px',
          border: '1px solid #ff9800'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#f57c00' }}>
            Top Performers {selectedSector && `(${selectedSector})`}
          </h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {stocks.slice(0, 6).map(stock => (
              <div key={stock.id} style={{ 
                padding: '8px', 
                marginBottom: '5px', 
                backgroundColor: 'white', 
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#1976d2' }}>{stock.symbol}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{stock.sector}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>${stock.price.toFixed(2)}</div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: stock.change >= 0 ? '#4caf50' : '#f44336' 
                    }}>
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Express API Info */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#ffebee', 
        borderRadius: '8px',
        border: '1px solid #f44336'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#d32f2f' }}>Express 3.21.2 API Integration</h4>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <div><strong>Endpoints Used:</strong></div>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            <li><code>GET /api/stocks</code> - Financial data with sector filtering</li>
            <li><code>GET /api/users</code> - User management data</li>
            <li><code>POST /api/users</code> - Create new users</li>
            <li><code>GET /api/analytics</code> - Dashboard analytics</li>
            <li><code>GET /api/health</code> - Server health check</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiveDataExample; 