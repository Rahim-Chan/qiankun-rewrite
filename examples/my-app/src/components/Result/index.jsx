import { Card } from 'antd';
import React, { useMemo, useState } from 'react';
import { ApiOutlined, CheckCircleTwoTone, BugFilled } from '@ant-design/icons'

function CaseWrap(props) {
  const [status, setStatus] = useState()

  const text = useMemo(() => {
    if (status === false) {
      return <BugFilled style={{color:"red"}} />;
    } else if (status === true) {
      return <CheckCircleTwoTone twoToneColor="#52c41a" />
    } else {
      return <ApiOutlined />
    }
  }, [status])
  return (
    <Card title={`API: ${props.title}`} size="small">
      <p>{props.subTitle}</p>
      {props.children}
      <div>
        <button className='qiankunCheck' onClick={() => {
          console.log('onClick');
          const status = props.check()
          setStatus(status)
        }}>Check</button> &nbsp;&nbsp;
        Result:{text}
      </div>
    </Card>
  );
}

export default CaseWrap;
