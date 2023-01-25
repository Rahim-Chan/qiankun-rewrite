import { getCurrentRunningApp } from '../../common';

const rawDocumentQuerySelector = Document.prototype.querySelector;
const rawDocumentQuerySelectorAll = Document.prototype.querySelectorAll;

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
  const container = ins.elementGetter() as HTMLElement;
  if (container) {
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
  const container = ins.elementGetter() as HTMLElement;
  return container?.querySelectorAll(selectors) ?? [];
}

const docPatchedMap = new WeakMap<any, any>(); //TODO 类型

function patchQuerySelector() {
  const docQuerySelectorFnBeforeOverwrite = docPatchedMap.get(Document.prototype.querySelector);
  const rawQuerySelectorElement = Document.prototype.querySelector;
  if (!docQuerySelectorFnBeforeOverwrite) {
    Document.prototype.querySelector = querySelector;
    docPatchedMap.set(Document.prototype.querySelector, rawQuerySelectorElement);
  }

  return function unPatch() {
    if (docQuerySelectorFnBeforeOverwrite) {
      Document.prototype.querySelector = rawQuerySelectorElement;
    }
  };
}

function patchQuerySelectorAll() {
  const docQuerySelectorAllFnBeforeOverwrite = docPatchedMap.get(Document.prototype.querySelectorAll);
  const rawQuerySelectorAllElement = Document.prototype.querySelectorAll;
  if (!docQuerySelectorAllFnBeforeOverwrite) {
    Document.prototype.querySelectorAll = querySelectorAll;
    docPatchedMap.set(Document.prototype.querySelectorAll, rawQuerySelectorAllElement);
  }

  return function unPatch() {
    if (docQuerySelectorAllFnBeforeOverwrite) {
      Document.prototype.querySelectorAll = rawQuerySelectorAllElement;
    }
  };
}

function patchCreateElement() {
  const docCreateElementFnBeforeOverwrite = docPatchedMap.get(document.createElement);
  const rawDocumentCreateElement = document.createElement;
  if (!docCreateElementFnBeforeOverwrite) {
    Document.prototype.createElement = function createElement(
      tagName: string,
      options?: ElementCreationOptions,
    ): HTMLElement {
      const element = rawDocumentCreateElement.call(this, tagName, options);
      return markElement(element);
    };
    docPatchedMap.set(Document.prototype.createElement, rawDocumentCreateElement);
  }
  const docCreateElementNSFnBeforeOverwrite = docPatchedMap.get(document.createElementNS);
  const rawDocumentCreateElementNS = document.createElementNS;
  if (!docCreateElementNSFnBeforeOverwrite) {
    Document.prototype.createElementNS = function createElementNs(
      namespaceURI: string,
      name: string,
      options?: string | ElementCreationOptions,
    ): any {
      const element = rawDocumentCreateElementNS.call(this, namespaceURI, name, options);
      return markElement(element);
    };
    docPatchedMap.set(Document.prototype.createElementNS, rawDocumentCreateElementNS);
  }
  const docCreateDocumentFragmentFnBeforeOverwrite = docPatchedMap.get(document.createDocumentFragment);
  const rawDocumentCreateDocumentFragment = document.createDocumentFragment;
  if (!docCreateDocumentFragmentFnBeforeOverwrite) {
    Document.prototype.createDocumentFragment = function createDocumentFragment(): DocumentFragment {
      const element = rawDocumentCreateDocumentFragment.call(this);
      return markElement(element);
    };
    docPatchedMap.set(Document.prototype.createDocumentFragment, rawDocumentCreateDocumentFragment);
  }

  return function unPatch() {
    if (docCreateElementFnBeforeOverwrite) {
      Document.prototype.createElement = rawDocumentCreateElement;
      document.createElement = rawDocumentCreateElement;
    }
    if (docCreateElementNSFnBeforeOverwrite) {
      Document.prototype.createElementNS = rawDocumentCreateElementNS;
      document.createElementNS = rawDocumentCreateElementNS;
    }
    if (docCreateDocumentFragmentFnBeforeOverwrite) {
      Document.prototype.createDocumentFragment = rawDocumentCreateDocumentFragment;
      document.createDocumentFragment = rawDocumentCreateDocumentFragment;
    }
  };
}
/**
 * @description: patch document.getElementsByTagName
 * @return {*}
 */
function patchGetElementsByTagName() {
  const docGetElementsByTagNameFnBeforeOverwrite = docPatchedMap.get(document.getElementsByTagName);
  const rawDocumentGetElementsByTagName = document.getElementsByTagName;
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
    docPatchedMap.set(Document.prototype.getElementsByTagName, rawDocumentGetElementsByTagName);
  }
  return function unPatch() {
    if (docGetElementsByTagNameFnBeforeOverwrite) {
      Document.prototype.getElementsByTagName = docGetElementsByTagNameFnBeforeOverwrite;
      document.getElementsByTagName = docGetElementsByTagNameFnBeforeOverwrite;
    }
  };
}
/**
 * @description: patch document.getElementById
 * @return {*}
 */
function patchGetElementById() {
  const docGetElementByIdFnBeforeOverwrite = docPatchedMap.get(document.getElementById);
  const rawDocumentGetElementById = document.getElementById;
  if (!docGetElementByIdFnBeforeOverwrite) {
    Document.prototype.getElementById = function getElementById(this, key: string): HTMLElement | null {
      const ins = getCurrentRunningApp();
      if (!ins || isInvalidQuerySelectorKey(key)) {
        return rawDocumentGetElementById.call(this, key);
      }
      try {
        return querySelector.call(this, `#${key}`);
      } catch {
        return rawDocumentGetElementById.call(this, key);
      }
    };
    docPatchedMap.set(Document.prototype.getElementById, rawDocumentGetElementById);
  }
  return function unPatch() {
    if (docGetElementByIdFnBeforeOverwrite) {
      Document.prototype.getElementById = docGetElementByIdFnBeforeOverwrite;
      document.getElementById = docGetElementByIdFnBeforeOverwrite;
    }
  };
}

/**
 * @description: patch document.getElementsByName
 * @return {*}
 */
function patchGetElementsByName() {
  const docGetElementsByNameFnBeforeOverwrite = docPatchedMap.get(document.getElementsByName);
  const rawDocumentGetElementsByName = document.getElementsByName;
  if (!docGetElementsByNameFnBeforeOverwrite) {
    Document.prototype.getElementsByName = function getElementsByName(key: string): NodeListOf<HTMLElement> {
      const ins = getCurrentRunningApp();
      if (!ins || isInvalidQuerySelectorKey(key)) {
        return rawDocumentGetElementsByName.call(this, key);
      }
      try {
        return querySelectorAll.call(this, `[name=${key}]`);
      } catch {
        return rawDocumentGetElementsByName.call(this, key);
      }
    };
    docPatchedMap.set(Document.prototype.getElementsByName, rawDocumentGetElementsByName);
  }
  return function unPatch() {
    if (docGetElementsByNameFnBeforeOverwrite) {
      Document.prototype.getElementsByName = docGetElementsByNameFnBeforeOverwrite;
      document.getElementsByName = docGetElementsByNameFnBeforeOverwrite;
    }
  };
}

/**
 * @description: patch document.getElementsByClassName
 * @return {*}
 */
function patchGetElementsByClassName() {
  const docGetElementsByClassNameFnBeforeOverwrite = docPatchedMap.get(document.getElementsByClassName);
  const rawDocumentGetElementsByClassName = document.getElementsByClassName;
  if (!docGetElementsByClassNameFnBeforeOverwrite) {
    Document.prototype.getElementsByClassName = function getElementsByClassName(
      key: string,
    ): HTMLCollectionOf<Element> {
      const ins = getCurrentRunningApp();
      if (!ins || isInvalidQuerySelectorKey(key)) {
        return rawDocumentGetElementsByClassName.call(this, key);
      }
      try {
        return querySelectorAll.call(this, `.${key}`);
      } catch {
        return rawDocumentGetElementsByClassName.call(this, key);
      }
    };
    docPatchedMap.set(Document.prototype.getElementsByClassName, rawDocumentGetElementsByClassName);
  }
  return function unPatch() {
    if (docGetElementsByClassNameFnBeforeOverwrite) {
      Document.prototype.getElementsByClassName = docGetElementsByClassNameFnBeforeOverwrite;
      document.getElementsByClassName = docGetElementsByClassNameFnBeforeOverwrite;
    }
  };
}

export function patchDocument() {
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
