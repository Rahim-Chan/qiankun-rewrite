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
      a.className = 'elementPreAppend'
      a.numIndex = index
      return a
    })
    document.body.prepend(...doms)
    console.log({doms});
    console.log(document.body.querySelectorAll('.elementPreAppend'),"document.body.querySelectorAll('.elementPreAppend')");
    return document.body.querySelectorAll('.elementPreAppend').length === 10
}
function Test() {


  return (
    <CardWrap title="document.body.prepend" check={check} />

  );
}

export default Test;
