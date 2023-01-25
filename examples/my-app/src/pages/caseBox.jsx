
import React from 'react'
import  DocGetElementById from '../components/CaseDoc/DGetElementById'
import  DocQuerySelector from '../components/CaseDoc/DQuerySelector'
import  DQuerySelectorAll from '../components/CaseDoc/DQuerySelectorAll'
import  DQueryByClassName from '../components/CaseDoc/DQueryByClassName'
import  DQueryByName from '../components/CaseDoc/DQueryByName'
//
import  ElementAppendChild from '../components/CaseElement/ElementAppendChild'
import  ElementAppend from '../components/CaseElement/ElementAppend'
import  ElementPrePend from '../components/CaseElement/ElementPrePend'
import  ElementInsertBefore from '../components/CaseElement/ElementInsertBefore'
import  ElementReplaceChild from '../components/CaseElement/ElementReplaceChild'
import  ElementGetElementsByName from '../components/CaseElement/ElementGetElementsByName'
import  ElementQuerySelector from '../components/CaseElement/ElementQuerySelector'
import  ElementQuerySelectorAll from '../components/CaseElement/ElementQuerySelectorAll'
import  ElementGetElementsByClassName from '../components/CaseElement/ElementGetElementsByClassName'
import  ElementCloneNode from '../components/CaseElement/ElementCloneNode'
import HelloModal from '../components/HelloModal';
import { Card, Col, Row } from 'antd'



function Test() {
  return (
    <div className="site-card-wrapper">
      <HelloModal />
      <Card title="Document" >
        <Row gutter={16}>
          <Col span={8}>
            <DocGetElementById />
          </Col>
          <Col span={8}>
            <DocQuerySelector />
          </Col>
          <Col span={8}>
            <DQuerySelectorAll />
          </Col>
          <Col span={8}>
            <DQueryByClassName />
            </Col>
          <Col span={8}>
            <DQueryByName />
          </Col>

        </Row>
      </Card>

     <Card title="Element" >
      <Row gutter={16}>
        <Col span={8}>
          <ElementAppendChild/>
        </Col>
        <Col span={8}>
          <ElementAppend/>
        </Col>
        <Col span={8}>
          <ElementPrePend/>
        </Col>
        <Col span={8}>
          <ElementInsertBefore/>
        </Col>
        <Col span={8}>
          <ElementReplaceChild/>
        </Col>

        <Col span={8}>
          <ElementQuerySelector/>
        </Col>
        <Col span={8}>
          <ElementQuerySelectorAll/>
        </Col>
        <Col span={8}>
          <ElementGetElementsByName />
        </Col>
        <Col span={8}>
          <ElementGetElementsByClassName />
        </Col>

        <Col span={8}>
          <ElementCloneNode />
        </Col>
        </Row>
     </Card>
    </div>
  );
}

export default Test;
