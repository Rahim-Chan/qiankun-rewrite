import React, { useState } from 'react';
import { Button, Card, Modal } from 'antd';

export default function ModalTest() {
  const [visible, setVisible] = useState(false);
  return (
    <Card title="document.body.appendChild" size="small">
      <Button onClick={() => setVisible(true)}>CLICK ME</Button>
      <Modal open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)} title="qiankun" destroyOnClose>
        Probably the most complete micro-frontends solution you ever met
      </Modal>
    </Card>
  );
}
