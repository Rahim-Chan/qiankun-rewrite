import CardWrap from '../Result'
import React from 'react';

let dom
const check = () => {
  if (dom) {
    document.body.removeChild(dom)
  }
  const old = document.createElement('div');
  old.className = 'oldReplaceChild'
  document.body.appendChild(old);
  const newChild = document.createElement('div');
  newChild.className = 'newChildReplaceChild'
  dom = newChild
  document.body.replaceChild(newChild, old)
  return document.body.querySelector('.newChildReplaceChild') === newChild
}
function Test() {


  return (
    <CardWrap title="document.body.replaceChild" check={check} />

  );
}

export default Test;
