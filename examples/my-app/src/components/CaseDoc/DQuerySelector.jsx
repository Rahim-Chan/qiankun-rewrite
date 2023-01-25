import React, { useRef } from 'react';
import CaseWrap from '../Result';

function Test() {
  const ref = useRef()
  const classRef = useRef()

  return (
    <>
      <CaseWrap
        title="document.querySelector"
        subTitle="document.querySelector('#xxx')"
        check={() => {
          return document.querySelector('#documentQuerySelector') === ref.current
      }}>
        <div ref={ref} id="documentQuerySelector" />
      </CaseWrap>
      <CaseWrap
        title="document.querySelector"
        subTitle="document.querySelector('.xxx')"
        check={() => {
          return document.querySelector('.documentQuerySelectorCheckClass') ===  classRef.current
      }}>
        <div className="documentQuerySelectorCheckClass" ref={classRef} />
      </CaseWrap>
    </>
  );
}

export default Test;
