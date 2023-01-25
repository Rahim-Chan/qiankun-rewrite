import { useMemo, useState } from 'react';

function Test() {
  const [status,setStatus] = useState(0);

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
        <input type="text" name="poratlbyName" />
        <input type="text" name="poratlbyName" />
        <input type="text" name="poratlbyName" />
        <p className='title'>
        document.getElementsByName
        </p>
        <button onClick={() => {
          if (document.getElementsByName('poratlbyName').length === 3) {
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
