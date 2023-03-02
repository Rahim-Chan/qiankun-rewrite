import './App.css';
import { Card, Button, Row, Col } from 'antd'
import { loadMicroApp, MicroApp } from '../../../src';
import { useState } from 'react';


function App() {
  const [app1, setApp1] = useState<MicroApp | null>()
  const [app2, setApp2] = useState<MicroApp | null>()
  const loadA = async () => {
    if (app1) {
      await app1.unmount()
      setApp1(null)
    } else {
      setApp1(loadMicroApp(
        { name: 'react16', entry: '//localhost:10086', container: '#react16' },
        {
          sandbox: {
            experimentalStyleIsolation: true
          }
        }

      ))
    }
  }
  const loadB = async () => {
    if (app2) {
      await app2.unmount()
      setApp2(null);
    } else {
      setApp2(loadMicroApp(
        { name: 'react20', entry: '//localhost:10086', container: '#react20' },
        {
          sandbox: {
            experimentalStyleIsolation: true
          }
        }
      ))
    }
  }

  return (
    <div className="App">
      <Button type='primary' onClick={loadA}>{app1 ? 'unLoadA' : 'loadA'}</Button>
      <Button type='primary' onClick={loadB}>{app2 ? 'unLoadB' : 'loadB'}</Button>
      <Button size='large' onClick={() => {
        document.querySelectorAll('.qiankunCheck').forEach(i  => (i as HTMLElement).click())
      }}>Test MicroApp
      </Button>
      <Row gutter={24}>
        <Col span={12}>
          <Card >
              <div id="react16" />
          </Card>
        </Col>
        <Col span={12}>
          <Card >
            <div id="react20" />
          </Card>
        </Col>
      </Row>
     
    
    </div>
  );
}

export default App;
