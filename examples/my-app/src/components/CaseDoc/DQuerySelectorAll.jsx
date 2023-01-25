import React, { useRef } from 'react';
import CaseWrap from '../Result';
// map(i => )
const NUM = 10
const domArray = Array.from(new Array(NUM), () =>  React.createRef());

function Test() {
  const ref = useRef()
  const allClassRef = useRef(domArray)
  return (
    <>
      <CaseWrap
        title="document.querySelectorAll"
        subTitle="document.querySelectorAll('#xxx')"
        check={() => {
          return document.querySelectorAll('#documentQuerySelectorAll')[0] === ref.current
      }}>
        <div ref={ref} id="documentQuerySelectorAll" />
      </CaseWrap>
      <CaseWrap
        title="document.querySelectorAll"
        subTitle="document.querySelectorAll('.xxx')"
        check={() => {
          const res = document.querySelectorAll('.documentQuerySelectorAllCheckClass');
          return res.length === NUM && [...res].every((dom,index) => allClassRef.current[index].current == dom)
      }}>
        {
          allClassRef.current.map((itemRef,index) => <span className="documentQuerySelectorAllCheckClass" ref={itemRef} key={index} />)
        }

      </CaseWrap>
    </>
  );
}

export default Test;
