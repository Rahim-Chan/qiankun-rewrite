import CardWrap from '../Result'
import React from 'react';

let doms
const check = () => {
  if (doms) {
    console.log({doms})
    doms.forEach(dom => {
      console.log({
        parentNode: dom.parentNode,
        dom
      })
      document.body.removeChild(dom)
    })
  }
  doms = Array.from(new Array(10), (_,index) => {
    const a = document.createElement('div');
    a.className = 'eleAppendChild'
    a.numIndex = index
    return a
  })
  doms.forEach(d => {
    document.body.appendChild(d)
  })
  console.log({doms});
  console.log(document.body.querySelectorAll('.eleAppendChild'),"document.body.querySelectorAll('.eleAppendChild')");
  return document.body.querySelectorAll('.eleAppendChild').length === 10
}
function Test() {


  return (
    <CardWrap title="document.body.appendChild" check={check} />

  );
}

export default Test;
