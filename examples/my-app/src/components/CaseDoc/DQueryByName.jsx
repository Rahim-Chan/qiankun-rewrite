import React, { useRef } from 'react';
import CaseWrap from '../Result';


function Test() {
  const ref = useRef()
  return (
    <>
      <CaseWrap
        title="document.getElementsByName"
        subTitle="document.getElementsByName('xxx')"
        check={() => {
          const single = document.getElementsByName('getElementsByName')[0] === ref.current
          const num = document.getElementsByName('getElementsByName1').length

          return single && num == 3
      }}>
        <div ref={ref}  name='getElementsByName' />
        <div name='getElementsByName1' />
        <div name='getElementsByName1' />
        <div name='getElementsByName1' />

      </CaseWrap>
    </>
  );
}

export default Test;
