import React, { useState } from 'react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="glass-card" style={{ width: '260px', margin: '20px', padding: '20px' }}>
        <h1 className="gradient-text" style={{ fontSize: '24px', marginBottom: '40px' }}>Jordan Agents</h1>
        <nav>
          <div onClick={() => setActiveTab('dashboard')} style={{ padding: '12px', cursor: 'pointer', opacity: activeTab === 'dashboard' ? 1 : 0.6 }}>Dashboard</div>
          <div onClick={() => setActiveTab('workspaces')} style={{ padding: '12px', cursor: 'pointer', opacity: activeTab === 'workspaces' ? 1 : 0.6 }}>Workspaces</div>
          <div onClick={() => setActiveTab('agents')} style={{ padding: '12px', cursor: 'pointer', opacity: activeTab === 'agents' ? 1 : 0.6 }}>Agent Builder</div>
          <div onClick={() => setActiveTab('settings')} style={{ padding: '12px', cursor: 'pointer', opacity: activeTab === 'settings' ? 1 : 0.6 }}>Settings</div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          <button className="btn-primary">+ New Task</button>
        </header>

        <div className="glass-card" style={{ padding: '30px', minHeight: '400px' }}>
          {activeTab === 'dashboard' && (
            <div>
              <h3>System Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
                <div style={{ padding: '20px', border: '1px solid #ffffff10', borderRadius: '12px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Active Agents</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>12</div>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ffffff10', borderRadius: '12px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Workspaces</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>5</div>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ffffff10', borderRadius: '12px' }}>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Documents</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>128</div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'agents' && (
            <div>
              <h3>Natural Language Agent Builder</h3>
              <textarea 
                placeholder="E.g. Create a researcher agent that analyzes market trends..."
                style={{ width: '100%', height: '100px', background: '#ffffff05', border: '1px solid #ffffff20', borderRadius: '8px', color: 'white', padding: '15px', marginTop: '20px' }}
              />
              <button className="btn-primary" style={{ marginTop: '20px' }}>Build Agent</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
