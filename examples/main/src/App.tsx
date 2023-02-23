import './App.css';
import { Card, Dropdown, MenuProps } from 'antd'
import TestBox from './Test'
import { loadMicroApp, MicroApp } from '../../../src';
import { useState } from 'react';

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

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

      ))
    }
  }
  const loadB = async () => {
    if (app2) {
      await app2.unmount()
      setApp2(null);
    } else {
      // http://192.168.1.104:3001/app-tem
      setApp2(loadMicroApp(
        { name: 'react20', entry: '//localhost:10086', container: '#react20' },
      ))
    }
  }

  return (
    <div className="App">
      portal
      <button onClick={() => {
        const a = document.createElement('div')
        console.log(document.body.appendChild, 'document.body.appendChild');

        document.body.appendChild(a)
      }}>onClick</button>
      <Dropdown menu={{ items }} trigger={['contextMenu']}>
        <div
          className="site-dropdown-context-menu"
          style={{
            textAlign: 'center',
            height: 200,
            lineHeight: '200px',
          }}
        >
          Right Click on here
        </div>
      </Dropdown>
      <TestBox />
      {/* <Space > */}
      <Card >
        <button onClick={loadA}>{app1 ? 'unLoadA' : 'loadA'}</button>
        <div id="react16">
        </div>
      </Card>
      <Card  >
        <button onClick={loadB}>{app2 ? 'unLoadB' : 'loadB'}</button>
        <div id="react20">

        </div>
      </Card>
      {/* </Space> */}
    </div>
  );
}

export default App;
