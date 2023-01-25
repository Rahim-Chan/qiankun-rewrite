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
      a.className = 'elementAppend'
      a.numIndex = index
      return a
    })
    document.body.append(...doms)
    console.log({doms});
    console.log(document.body.querySelectorAll('.elementAppend'),"document.body.querySelectorAll('.elementAppend')");
    return document.body.querySelectorAll('.elementAppend').length === 10
}
function Test() {


  return (
    <CardWrap title="document.body.append" check={check} />

  );
}

export default Test;
