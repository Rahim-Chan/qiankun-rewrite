import CardWrap from '../Result'
import React, { useRef } from 'react';

function Test() {
  const ref = useRef()
  return (
    <CardWrap title="document.getElementById" check={() => {
      console.log(document.getElementById,'document.getElementById')
      return document.getElementById('portal') === ref.current
    }}>
      portalportal
      <div ref={ref} id="portal" />
    </CardWrap>
  );
}

export default Test;
