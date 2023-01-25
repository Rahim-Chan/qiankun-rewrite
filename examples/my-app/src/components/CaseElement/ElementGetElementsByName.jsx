import React  from 'react';
import CardWrap from '../Result'

function Test() {
  return (
    <CardWrap title="document.body.getElementsByName" check={() => document.getElementsByName('byName').length === 3}>
        <input type="text" name="byName" />
        <input type="text" name="byName" />
        <input type="text" name="byName" />
    </CardWrap>
  );
}

export default Test;
