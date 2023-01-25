import CardWrap from '../Result'
import React, { useRef } from 'react';

function Test() {
  const ref = useRef()
  const ref1 = useRef()
  return (
    <CardWrap title="document.body.querySelector" check={() => {
      return document.body.querySelector('#documentBodyQuerySelector') === ref.current &&
      document.body.querySelector('#documentBodyQuerySelector1') === ref1.current
    }}>
      <div ref={ref} id="documentBodyQuerySelector"/>
      <div ref={ref1} id='documentBodyQuerySelector1'/>
    </CardWrap>
  );
}

export default Test;
