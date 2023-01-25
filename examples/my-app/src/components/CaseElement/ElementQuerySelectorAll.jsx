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
        title="element.querySelectorAll"
        // subTitle="element.querySelectorAll('#xxx')"
        check={() => {
          return document.body.querySelectorAll('#elementQuerySelectorAll')[0] === ref.current
      }}>
        <div ref={ref} id="elementQuerySelectorAll" />
      </CaseWrap>
      <CaseWrap
        title="element.querySelectorAll"
        // subTitle="element.querySelectorAll('.xxx')"
        check={() => {
          const res = document.body.querySelectorAll('.elementQuerySelectorAllCheckClass');
          return res.length === NUM && [...res].every((dom,index) => allClassRef.current[index].current == dom)
      }}>
        {
          allClassRef.current.map((itemRef,index) => <span className="elementQuerySelectorAllCheckClass" ref={itemRef} key={index}/>)
        }

      </CaseWrap>
    </>
  );
}

export default Test;
