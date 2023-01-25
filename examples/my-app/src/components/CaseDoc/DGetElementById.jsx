import CardWrap from '../Result'
import React, { useRef } from 'react';

function Test() {
  const ref = useRef()
  return (
    <CardWrap title="document.getElementById" check={() => document.getElementById('portal') === ref.current}>
      <div ref={ref} id="portal" />
    </CardWrap>
  );
}

export default Test;
