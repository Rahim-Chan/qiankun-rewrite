import CardWrap from '../Result'
import React from 'react';

let doms
const check = () => {
  if (doms) {
    doms.forEach(dom => {
      console.log({
        parentNode: dom.parentNode,
        dom
      })
      document.body.removeChild(dom)
    })
  }
  const t = document.createElement('div');
  t.id = 'insertBefore'
  document.body.append(t);
  doms = Array.from(new Array(10), (_,index) => {
    const a = document.createElement('div');
    a.className = 'eleInsertBefore'
    a.numIndex = index
    return a
  })
  doms.forEach(d => {
    document.body.insertBefore(d,t)
  })
  console.log({doms});
  console.log(document.querySelectorAll('.eleInsertBefore'),"document.body.querySelectorAll('.eleInsertBefore')");
  return document.querySelectorAll('.eleInsertBefore').length === 10
}
function Test() {


  return (
    <CardWrap title="document.body.insertBefore" check={check} />

  );
}

export default Test;
