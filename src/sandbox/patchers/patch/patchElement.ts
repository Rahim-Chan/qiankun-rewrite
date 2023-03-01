import { qiankunBodyTagName, qiankunHeadTagName } from '../../../utils';
import { appInstanceMap, getCurrentRunningApp } from '../../common';
import { isTargetNode } from './util';

const rawElement = {
  querySelector: Element.prototype.querySelector,
  querySelectorAll: Element.prototype.querySelectorAll,
  getElementsByClassName: Element.prototype.getElementsByClassName,
  getElementsByTagName: Element.prototype.getElementsByTagName,
  appendChild: Element.prototype.appendChild,
  append: Element.prototype.append,
  prepend: Element.prototype.prepend,
  removeChild: Element.prototype.removeChild,
  cloneNode: Element.prototype.cloneNode,
  replaceChild: Element.prototype.replaceChild,
  insertBefore: Element.prototype.insertBefore,
};
function getHijackParent(node: Node, appName: string): HTMLElement | null | undefined {
  const { elementGetter } = appInstanceMap.get(appName)!;
  if (node === document.head) {
    return elementGetter()?.querySelector<HTMLElement>(qiankunHeadTagName);
  }
  if (node === document.body) {
    return elementGetter()?.querySelector<HTMLElement>(qiankunBodyTagName);
  }
  return null;
}

function getQueryTarget(node: Node): Node | null {
  const ins = getCurrentRunningApp();
  if ((node === document.body || node === document.head) && ins) {
    const { elementGetter } = appInstanceMap.get(ins.name)!;
    const container = elementGetter?.();
    if (container && isTargetNode.call(node)) {
      if (node === document.body) {
        return container.querySelector(qiankunBodyTagName);
      } else if (node === document.head) {
        return container.querySelector(qiankunHeadTagName);
      }
    }
  }
  return null;
}

const eleMethodsPatchedMap = new WeakMap<any, any>(); //TODO 类型

function patchElementQuerySelector() {
  const eleQuerySelectorBeforeOverwrite = eleMethodsPatchedMap.get(rawElement.querySelector);
  const rawElementQuerySelector = rawElement.querySelector;

  if (!eleQuerySelectorBeforeOverwrite) {
    Element.prototype.querySelector = function querySelector(selectors: string): Node | null {
      return rawElementQuerySelector.call(getQueryTarget(this) || this, selectors);
    };
    eleMethodsPatchedMap.set(rawElement.querySelector, rawElementQuerySelector);
  }
  return function unPatch() {
    Element.prototype.querySelector = rawElementQuerySelector;
    eleMethodsPatchedMap.delete(rawElement.querySelector);
  };
}

function patchElementQuerySelectorAll() {
  const eleQuerySelectorBeforeOverwrite = eleMethodsPatchedMap.get(rawElement.querySelectorAll);
  const rawElementMethod = rawElement.querySelectorAll;

  if (!eleQuerySelectorBeforeOverwrite) {
    Element.prototype.querySelectorAll = function querySelectorAll(selectors: string): NodeListOf<Node> {
      return rawElementMethod.call(getQueryTarget(this) || this, selectors);
    };
    eleMethodsPatchedMap.set(rawElement.querySelectorAll, rawElementMethod);
  }
  return function unPatch() {
    Element.prototype.querySelectorAll = rawElementMethod;
    eleMethodsPatchedMap.delete(rawElement.querySelectorAll);
  };
}

function patchGetElementsByClassName() {
  const getElementsByClassNamebeforeOverwrite = eleMethodsPatchedMap.get(rawElement.getElementsByClassName);
  const rawElementGetElementsByClassName = rawElement.getElementsByClassName;
  if (!getElementsByClassNamebeforeOverwrite) {
    Element.prototype.getElementsByClassName = function appendChild(classNames: string): HTMLCollectionOf<Element> {
      return rawElementGetElementsByClassName.call(getQueryTarget(this) || this, classNames);
    };
    eleMethodsPatchedMap.set(rawElement.getElementsByClassName, rawElementGetElementsByClassName);
  }
  return function unPatch() {
    Element.prototype.getElementsByClassName = rawElementGetElementsByClassName;
    eleMethodsPatchedMap.delete(rawElement.getElementsByClassName);
  };
}

function patchGetElementsByTagName() {
  const getElementysByTagNameBeforeOverwrite = eleMethodsPatchedMap.get(rawElement.getElementsByTagName);
  const rawElementGetElementsByTagName = rawElement.getElementsByTagName;
  if (!getElementysByTagNameBeforeOverwrite) {
    Element.prototype.getElementsByTagName = function appendChild(qualifiedName: string): HTMLCollectionOf<Element> {
      return rawElementGetElementsByTagName.call(getQueryTarget(this) || this, qualifiedName);
    };
    eleMethodsPatchedMap.set(rawElement.getElementsByTagName, rawElementGetElementsByTagName);
  }
  return function unPatch() {
    Element.prototype.getElementsByTagName = rawElementGetElementsByTagName;
    eleMethodsPatchedMap.delete(rawElement.getElementsByTagName);
  };
}

function patchElementAppendChild() {
  const eleAppendChildBeforeOverwrite = eleMethodsPatchedMap.get(rawElement.appendChild);
  const rawElementAppendChild = rawElement.appendChild;
  if (!eleAppendChildBeforeOverwrite) {
    Element.prototype.appendChild = function appendChild<T extends Node>(newChild: T): T {
      return rawElementAppendChild.call(getQueryTarget(this) || this, newChild) as T;
    };
    eleMethodsPatchedMap.set(rawElement.appendChild, rawElementAppendChild);
  }
  return function unPatch() {
    Element.prototype.appendChild = eleAppendChildBeforeOverwrite;
    eleMethodsPatchedMap.delete(rawElement.appendChild);
  };
}

function patchElementAppend() {
  const rawElementAppend = rawElement.append;
  const eleAppendChildBeforeOverwrite = eleMethodsPatchedMap.get(rawElement.append);
  if (!eleAppendChildBeforeOverwrite) {
    Element.prototype.append = function append(...nodes: Array<Node | string>): void {
      rawElementAppend.call(getQueryTarget(this) || this, ...nodes);
    };
    eleMethodsPatchedMap.set(Element.prototype.append, rawElementAppend);
  }
  return function unPatch() {
    Element.prototype.append = eleAppendChildBeforeOverwrite;
    eleMethodsPatchedMap.delete(rawElement.append);
  };
}

function patchElementPrePend() {
  const elePrePendBeforeOverwrite = eleMethodsPatchedMap.get(rawElement.prepend);
  const rawElementPrepend = rawElement.prepend;

  if (!elePrePendBeforeOverwrite) {
    Element.prototype.prepend = function prepend(...nodes: Array<Node | string>): void {
      rawElementPrepend.call(getQueryTarget(this) || this, ...nodes);
    };
    eleMethodsPatchedMap.set(Element.prototype.prepend, rawElementPrepend);
  }
  return function unPatch() {
    Element.prototype.prepend = rawElementPrepend;
    eleMethodsPatchedMap.delete(rawElement.prepend);
  };
}

function patchElementInsertBefore() {
  const eleInsertBeforeBeforeOverwrite = eleMethodsPatchedMap.get(rawElement.insertBefore);
  const rawElementInsertBefore = rawElement.insertBefore;

  if (!eleInsertBeforeBeforeOverwrite) {
    Element.prototype.insertBefore = function insertBefore<T extends Node>(node: T, child: Node | null): T {
      return rawElementInsertBefore.call(getQueryTarget(this) || this, node, child) as T;
    };
    eleMethodsPatchedMap.set(rawElement.insertBefore, rawElementInsertBefore);
  }
  return function unPatch() {
    Element.prototype.insertBefore = eleInsertBeforeBeforeOverwrite;
    eleMethodsPatchedMap.delete(rawElement.insertBefore);
  };
}

function patchElementReplaceChild() {
  const eleReplaceChildBeforeOverwrite = eleMethodsPatchedMap.get(rawElement.replaceChild);
  const rawElementReplaceChild = rawElement.replaceChild;

  if (!eleReplaceChildBeforeOverwrite) {
    Element.prototype.replaceChild = function replaceChild<T extends Node>(node: Node, child: T): T {
      return rawElementReplaceChild.call(getQueryTarget(this) || this, node, child) as T;
    };
    eleMethodsPatchedMap.set(rawElement.replaceChild, rawElementReplaceChild);
  }
  return function unPatch() {
    Element.prototype.replaceChild = rawElementReplaceChild;
    eleMethodsPatchedMap.delete(rawElement.replaceChild);
  };
}

function patchElementClone() {
  const eleCloneBeforeOverwrite = eleMethodsPatchedMap.get(rawElement.cloneNode);
  const rawElementClone = rawElement.cloneNode;
  if (!eleCloneBeforeOverwrite) {
    Element.prototype.cloneNode = function cloneNode(deep?: boolean): Node {
      const clonedNode = rawElementClone.call(this, deep);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.__QIANKUN_APP_NAME__ && (clonedNode.__QIANKUN_APP_NAME__ = this.__QIANKUN_APP_NAME__);
      return clonedNode;
    };
    eleMethodsPatchedMap.set(rawElement.cloneNode, rawElementClone);
  }
  return function unPatch() {
    Element.prototype.cloneNode = rawElementClone;
    eleMethodsPatchedMap.delete(rawElement.cloneNode);
  };
}
/**
 * @description: prototype methods of delete element👇
 * @return {*}
 */
function patchElementRemoveChild() {
  const eleRemoveChildBeforeOverwrite = eleMethodsPatchedMap.get(rawElement.removeChild);
  const rawElementRemoveChild = rawElement.removeChild;

  if (!eleRemoveChildBeforeOverwrite) {
    Element.prototype.removeChild = function removeChild<T extends Node>(oldChild: T): T {
      if (oldChild?.__QIANKUN_APP_NAME__) {
        const app = appInstanceMap.get(oldChild.__QIANKUN_APP_NAME__);
        if (app) {
          const hijackParent = getHijackParent(this, app.name);
          if (!hijackParent?.contains(oldChild)) {
            if (this.contains(oldChild)) {
              return rawElementRemoveChild.call(this, oldChild) as T;
            }
            return oldChild;
          } else {
            return rawElementRemoveChild.call(hijackParent, oldChild) as T;
          }
        }
        try {
          return rawElementRemoveChild.call(this, oldChild) as T;
        } catch {
          return (oldChild?.parentNode && rawElementRemoveChild.call(oldChild.parentNode, oldChild)) as T;
        }
      }
      return rawElementRemoveChild.call(this, oldChild) as T;
    };
    eleMethodsPatchedMap.set(rawElement.removeChild, rawElementRemoveChild);
  }
  return function unPatch() {
    Element.prototype.removeChild = rawElementRemoveChild;
    eleMethodsPatchedMap.delete(rawElement.removeChild);
  };
}

export function patchElementPrototypeMethods() {
  const unPatchElementQuerySelector = patchElementQuerySelector();
  const unPatchElementQuerySelectorAll = patchElementQuerySelectorAll();
  const unPatchElementGetElementsByClassName = patchGetElementsByClassName();
  const unPatchGetElementsByTagName = patchGetElementsByTagName();
  const unPatchElementAppendChild = patchElementAppendChild();
  const unPatchElementAppend = patchElementAppend();
  const unPatchElementPrePend = patchElementPrePend();

  const unPatchElementInsertBefore = patchElementInsertBefore();
  const unPatchElementReplaceChild = patchElementReplaceChild();
  const unPatchElementRemoveChild = patchElementRemoveChild();
  const unPatchElementClone = patchElementClone();

  return function unPatch() {
    unPatchElementQuerySelector();
    unPatchElementQuerySelectorAll();

    unPatchElementGetElementsByClassName();
    unPatchGetElementsByTagName();

    unPatchElementAppendChild();
    unPatchElementAppend();
    unPatchElementPrePend();

    unPatchElementInsertBefore();
    unPatchElementReplaceChild();
    unPatchElementRemoveChild();
    unPatchElementClone();
  };
}
