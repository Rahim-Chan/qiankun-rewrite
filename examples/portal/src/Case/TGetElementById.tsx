import { useMemo, useRef, useState } from 'react';

function Test() {
  const ref = useRef<any>()
  const [status,setStatus] = useState(0)
  const text = useMemo(() => {
    if (status === 0) {
      return 'waiting'
    } else if (status === 1) {
      return 'success'
    } else {
      return 'fail'
    }
  },[status])
  return (
    <div className='box'>
        <div ref={ref} id="portal">ID Target!!!!</div>
        <p className='title'>
        document.getElementById
        </p>
        <button onClick={() => {
          if (document.getElementById('portal') === ref.current) {
            setStatus(1)
          } else {
            setStatus(2)
          }
        }}>test</button>
        <p>Result:{text}</p>
      </div>
  );
}

export default Test;
