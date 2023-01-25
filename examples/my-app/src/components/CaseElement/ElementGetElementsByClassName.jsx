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
      a.className = 'getElementsByClassName'
      a.numIndex = index
      return a
    })
    document.body.append(...doms)
    console.log({doms});
    console.log(document.body.getElementsByClassName('getElementsByClassName'));
    console.log(document.getElementsByClassName('getElementsByClassName'));
    return document.body.getElementsByClassName('getElementsByClassName').length === 10 && document.getElementsByClassName('getElementsByClassName').length === 10
}
function Test() {


  return (
    <CardWrap title="document.body.getElementsByClassName" check={check} />

  );
}

export default Test;
