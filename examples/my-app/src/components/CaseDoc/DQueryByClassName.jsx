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
        title="document.getElementsByClassName"
        // subTitle="document.getElementsByClassName('xxx')"
        check={() => {
          const res = document.getElementsByClassName('documentGetElementsByClassNameMulti');
          console.log({res})
          const multi = res.length === NUM && [...res].every((dom,index) => allClassRef.current[index].current == dom)
          const single = document.getElementsByClassName('documentGetElementsByClassName')[0] === ref.current
          console.log({multi , single});
          return multi && single
      }}>
        <div ref={ref} className="documentGetElementsByClassName" />
        {
          allClassRef.current.map((itemRef,index) => <span className="documentGetElementsByClassNameMulti" ref={itemRef} key={index} />)
        }
      </CaseWrap>
    </>
  );
}

export default Test;
