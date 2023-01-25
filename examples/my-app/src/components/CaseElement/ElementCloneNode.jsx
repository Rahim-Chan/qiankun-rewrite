import CardWrap from '../Result'
import React from 'react';

const check = () => {

  const old = document.createElement('div');
  old.className = 'oldReplaceChild'

  const newChild = old.cloneNode()

  return newChild.__QIANKUN_APP_NAME__ === old.__QIANKUN_APP_NAME__
}
function Test() {


  return (
    <CardWrap title="document.body.cloneNode" check={check} />

  );
}

export default Test;
