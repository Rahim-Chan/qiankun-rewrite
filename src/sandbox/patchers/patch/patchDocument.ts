import { appInstanceMap, getCurrentRunningApp } from '../../common';
import { isTargetNode } from './util';

const rawDocumentQuerySelector = Document.prototype.querySelector;
const rawDocumentQuerySelectorAll = Document.prototype.querySelectorAll;
const rawDocument = {
  querySelector: Document.prototype.querySelector,
  querySelectorAll: Document.prototype.querySelectorAll,
  getElementById: Document.prototype.getElementById,
  getElementsByClassName: Document.prototype.getElementsByClassName,
  getElementsByName: Document.prototype.getElementsByName,
  getElementsByTagName: Document.prototype.getElementsByTagName,
  createElement: Document.prototype.createElement,
  createElementNS: Document.prototype.createElementNS,
  createDocumentFragment: Document.prototype.createDocumentFragment,
};
// const rawDocumentGetElementById = Document.prototype.getElementById;

// unique element
function isInvalidQuerySelectorKey(key: string): boolean {
  return !key || /(^\d)|([^\w\d-_\u4e00-\u9fa5])/gi.test(key);
}
function isUniqueElement(key: string): boolean {
  return /^body$/i.test(key) || /^head$/i.test(key) || /^html$/i.test(key) || /^title$/i.test(key);
}
/**
 * Mark the newly created element in the micro application
 * @param element new element
 */
function markElement<T>(element: T): T {
  const ins = getCurrentRunningApp();
  if (ins) (element as any).__QIANKUN_APP_NAME__ = ins.name;
  return element;
}

function querySelector(this: Document, selectors: string): any {
  const ins = getCurrentRunningApp();
  if (!ins || !selectors || isUniqueElement(selectors)) {
    return rawDocumentQuerySelector.call(this, selectors);
  }
  const { elementGetter } = appInstanceMap.get(ins.name)!;
  const container = elementGetter() as HTMLElement;
  if (container && isTargetNode.call(this)) {
    return container?.querySelector(selectors) ?? null;
  } else {
    return rawDocumentQuerySelector.call(this, selectors);
  }
}

function querySelectorAll(this: Document, selectors: string): any {
  const ins = getCurrentRunningApp();
  if (!ins || !selectors || isUniqueElement(selectors)) {
    return rawDocumentQuerySelectorAll.call(this, selectors);
  }
  const { elementGetter } = appInstanceMap.get(ins.name)!;
  const container = elementGetter() as HTMLElement;
  if (container && isTargetNode.call(this)) {
    return container?.querySelectorAll(selectors) ?? [];
  } else {
    return rawDocumentQuerySelectorAll.call(this, selectors);
  }
}

const docPatchedMap = new WeakMap<any, any>(); //TODO 类型

function patchQuerySelector() {
  const docQuerySelectorFnBeforeOverwrite = docPatchedMap.get(rawDocument.querySelector);
  const rawQuerySelectorElement = rawDocument.querySelector;
  if (!docQuerySelectorFnBeforeOverwrite) {
    Document.prototype.querySelector = querySelector;
    docPatchedMap.set(rawDocument.querySelector, rawQuerySelectorElement);
  }

  return function unPatch() {
    Document.prototype.querySelector = rawQuerySelectorElement;
    docPatchedMap.delete(rawDocument.querySelector);
  };
}

function patchQuerySelectorAll() {
  const docQuerySelectorAllFnBeforeOverwrite = docPatchedMap.get(rawDocument.querySelectorAll);
  const rawQuerySelectorAllElement = rawDocument.querySelectorAll;
  if (!docQuerySelectorAllFnBeforeOverwrite) {
    Document.prototype.querySelectorAll = querySelectorAll;
    docPatchedMap.set(rawDocument.querySelectorAll, rawQuerySelectorAllElement);
  }

  return function unPatch() {
    Document.prototype.querySelectorAll = rawQuerySelectorAllElement;
    docPatchedMap.delete(rawDocument.querySelectorAll);
  };
}

function patchCreateElement() {
  const docCreateElementFnBeforeOverwrite = docPatchedMap.get(rawDocument.createElement);
  const rawDocumentCreateElement = rawDocument.createElement;
  if (!docCreateElementFnBeforeOverwrite) {
    Document.prototype.createElement = function createElement(
      tagName: string,
      options?: ElementCreationOptions,
    ): HTMLElement {
      const element = rawDocumentCreateElement.call(this, tagName, options);
      return isTargetNode.call(this) ? markElement(element) : element;
    };
    docPatchedMap.set(rawDocument.createElement, rawDocumentCreateElement);
  }
  const docCreateElementNSFnBeforeOverwrite = docPatchedMap.get(rawDocument.createElementNS);
  const rawDocumentCreateElementNS = rawDocument.createElementNS;
  if (!docCreateElementNSFnBeforeOverwrite) {
    Document.prototype.createElementNS = function createElementNs(
      namespaceURI: string,
      name: string,
      options?: string | ElementCreationOptions,
    ): any {
      const element = rawDocumentCreateElementNS.call(this, namespaceURI, name, options);
      return isTargetNode.call(this) ? markElement(element) : element;
    };
    docPatchedMap.set(rawDocument.createElementNS, rawDocumentCreateElementNS);
  }
  const docCreateDocumentFragmentFnBeforeOverwrite = docPatchedMap.get(rawDocument.createDocumentFragment);
  const rawDocumentCreateDocumentFragment = rawDocument.createDocumentFragment;
  if (!docCreateDocumentFragmentFnBeforeOverwrite) {
    Document.prototype.createDocumentFragment = function createDocumentFragment(): DocumentFragment {
      const element = rawDocumentCreateDocumentFragment.call(this);
      return isTargetNode.call(this) ? markElement(element) : element;
    };
    docPatchedMap.set(rawDocument.createDocumentFragment, rawDocumentCreateDocumentFragment);
  }

  return function unPatch() {
    Document.prototype.createElement = rawDocumentCreateElement;
    docPatchedMap.delete(rawDocument.createElement);
    Document.prototype.createElementNS = rawDocumentCreateElementNS;
    docPatchedMap.delete(rawDocument.createElementNS);
    Document.prototype.createDocumentFragment = rawDocumentCreateDocumentFragment;
    docPatchedMap.delete(rawDocument.createDocumentFragment);
  };
}
/**
 * @description: patch document.getElementsByTagName
 * @return {*}
 */
function patchGetElementsByTagName() {
  const docGetElementsByTagNameFnBeforeOverwrite = docPatchedMap.get(rawDocument.getElementsByTagName);
  const rawDocumentGetElementsByTagName = rawDocument.getElementsByTagName;
  if (!docGetElementsByTagNameFnBeforeOverwrite) {
    Document.prototype.getElementsByTagName = function getElementsByTagName(
      this,
      key: string,
    ): HTMLCollectionOf<Element> {
      const ins = getCurrentRunningApp();
      if (!ins || isUniqueElement(key) || isInvalidQuerySelectorKey(key)) {
        return rawDocumentGetElementsByTagName.call(this, key);
      }
      try {
        return querySelectorAll.call(this, key) as any;
      } catch {
        return rawDocumentGetElementsByTagName.call(this, key);
      }
    };
    docPatchedMap.set(rawDocument.getElementsByTagName, rawDocumentGetElementsByTagName);
  }
  return function unPatch() {
    Document.prototype.getElementsByTagName = rawDocumentGetElementsByTagName;
    docPatchedMap.delete(rawDocument.getElementsByTagName);
  };
}
/**
 * @description: patch document.getElementById
 * @return {*}
 */
function patchGetElementById() {
  const docGetElementByIdFnBeforeOverwrite = docPatchedMap.get(rawDocument.getElementById);
  const rawDocumentGetElementById = rawDocument.getElementById;

  if (!docGetElementByIdFnBeforeOverwrite) {
    Document.prototype.getElementById = function getElementById(this, key: string): HTMLElement | null {
      const ins = getCurrentRunningApp();

      if (!ins || isInvalidQuerySelectorKey(key) || !isTargetNode.call(this)) {
        return rawDocumentGetElementById.call(this, key);
      }

      try {
        return querySelector.call(this, `#${key}`);
      } catch (e) {
        return rawDocumentGetElementById.call(this, key);
      }
    };
    docPatchedMap.set(rawDocument.getElementById, rawDocumentGetElementById);
  }
  return function unPatch() {
    Document.prototype.getElementById = rawDocumentGetElementById;
    docPatchedMap.delete(rawDocument.getElementById);
  };
}

/**
 * @description: patch document.getElementsByName
 * @return {*}
 */
function patchGetElementsByName() {
  const docGetElementsByNameFnBeforeOverwrite = docPatchedMap.get(rawDocument.getElementsByName);
  const rawDocumentGetElementsByName = rawDocument.getElementsByName;
  if (!docGetElementsByNameFnBeforeOverwrite) {
    Document.prototype.getElementsByName = function getElementsByName(key: string): NodeListOf<HTMLElement> {
      const ins = getCurrentRunningApp();
      if (!ins || isInvalidQuerySelectorKey(key) || !isTargetNode.call(this)) {
        return rawDocumentGetElementsByName.call(this, key);
      }
      try {
        return querySelectorAll.call(this, `[name=${key}]`);
      } catch {
        return rawDocumentGetElementsByName.call(this, key);
      }
    };
    docPatchedMap.set(rawDocument.getElementsByName, rawDocumentGetElementsByName);
  }
  return function unPatch() {
    docPatchedMap.delete(rawDocument.getElementsByName);
    Document.prototype.getElementsByName = rawDocumentGetElementsByName;
  };
}

/**
 * @description: patch document.getElementsByClassName
 * @return {*}
 */
function patchGetElementsByClassName() {
  const docGetElementsByClassNameFnBeforeOverwrite = docPatchedMap.get(rawDocument.getElementsByClassName);
  const rawDocumentGetElementsByClassName = rawDocument.getElementsByClassName;
  if (!docGetElementsByClassNameFnBeforeOverwrite) {
    Document.prototype.getElementsByClassName = function getElementsByClassName(
      key: string,
    ): HTMLCollectionOf<Element> {
      const ins = getCurrentRunningApp();
      if (!ins || isInvalidQuerySelectorKey(key) || !isTargetNode.call(this)) {
        return rawDocumentGetElementsByClassName.call(this, key);
      }
      try {
        return querySelectorAll.call(this, `.${key}`);
      } catch {
        return rawDocumentGetElementsByClassName.call(this, key);
      }
    };
    docPatchedMap.set(rawDocument.getElementsByClassName, rawDocumentGetElementsByClassName);
  }
  return function unPatch() {
    docPatchedMap.delete(rawDocument.getElementsByClassName);
    Document.prototype.getElementsByClassName = rawDocumentGetElementsByClassName;
  };
}

export function patchDocumentPrototypeMethods() {
  const unPatchCreateElement = patchCreateElement();
  const unPatchQuerySelector = patchQuerySelector();
  const unPatchQuerySelectorAll = patchQuerySelectorAll();
  const unPatchGetElementsByTagName = patchGetElementsByTagName();
  const unPatchGetElementById = patchGetElementById();
  const unPatchGetElementsByName = patchGetElementsByName();
  const unPatchGetElementsByClassName = patchGetElementsByClassName();
  return function unPatch() {
    unPatchCreateElement();
    unPatchQuerySelector();
    unPatchQuerySelectorAll();
    unPatchGetElementsByTagName();
    unPatchGetElementById();
    unPatchGetElementsByName();
    unPatchGetElementsByClassName();
  };
}
