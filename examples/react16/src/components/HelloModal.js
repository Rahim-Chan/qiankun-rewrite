import React, { useState } from 'react';
import { Button, Modal } from 'antd';

export default function() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>CLICK ME</Button>
      <Modal open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)} title="qiankun">
        Probably the most complete micro-frontends solution you ever met
      </Modal>
    </>
  );
}
