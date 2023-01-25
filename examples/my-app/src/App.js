import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { Card, Divider } from 'antd';
import TestBox from './pages/caseBox';


import './App.css';


import Home from './pages/Home';
const About = lazy(() => import('./pages/About'));
const RouteExample = () => {
  return (
    <Router basename={window.__POWERED_BY_QIANKUN__ ? '/react16' : '/'}>
      <nav>
        <Link to="/">Home</Link>
        <Divider type="vertical" />
        <Link to="/about">About</Link>
      </nav>
      <Suspense fallback={null}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default function App() {
  return (
    <div className="app-main">
      <Card title="Sub" size="small">
        <TestBox/>
        <RouteExample />
      </Card>
    </div>
  );
}
