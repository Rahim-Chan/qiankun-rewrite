import { qiankunBodyTagName, qiankunHeadTagName } from '../../../utils';
import { appInstanceMap, getCurrentRunningApp } from '../../common';

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
    if (container) {
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
  const eleQuerySelectorBeforeOverwrite = eleMethodsPatchedMap.get(Element.prototype.querySelector);
  const rawElementQuerySelector = Element.prototype.querySelector;

  if (!eleQuerySelectorBeforeOverwrite) {
    Element.prototype.querySelector = function querySelector(selectors: string): Node | null {
      return rawElementQuerySelector.call(getQueryTarget(this) || this, selectors);
    };
    eleMethodsPatchedMap.set(Element.prototype.querySelector, rawElementQuerySelector);
  }
  return function unPatch() {
    if (eleQuerySelectorBeforeOverwrite) {
      Element.prototype.querySelector = eleQuerySelectorBeforeOverwrite;
    }
  };
}

function patchElementQuerySelectorAll() {
  const eleQuerySelectorBeforeOverwrite = eleMethodsPatchedMap.get(Element.prototype.querySelectorAll);
  const rawElementQuerySelectorAll = Element.prototype.querySelectorAll;

  if (!eleQuerySelectorBeforeOverwrite) {
    Element.prototype.querySelectorAll = function querySelectorAll(selectors: string): NodeListOf<Node> {
      return rawElementQuerySelectorAll.call(getQueryTarget(this) || this, selectors);
    };
    eleMethodsPatchedMap.set(Element.prototype.querySelectorAll, rawElementQuerySelectorAll);
  }
  return function unPatch() {
    if (eleQuerySelectorBeforeOverwrite) {
      Element.prototype.querySelectorAll = eleQuerySelectorBeforeOverwrite;
    }
  };
}

function patchElementAppendChild() {
  const rawElementAppendChild = Element.prototype.appendChild;
  const eleAppendChildBeforeOverwrite = eleMethodsPatchedMap.get(Element.prototype.appendChild);
  if (!eleAppendChildBeforeOverwrite) {
    Element.prototype.appendChild = function appendChild<T extends Node>(newChild: T): T {
      return rawElementAppendChild.call(getQueryTarget(this) || this, newChild) as T;
    };
    eleMethodsPatchedMap.set(Element.prototype.appendChild, rawElementAppendChild);
  }
  return function unPatch() {
    if (eleAppendChildBeforeOverwrite) {
      Element.prototype.appendChild = eleAppendChildBeforeOverwrite;
    }
  };
}

function patchElementAppend() {
  const rawElementAppend = Element.prototype.append;
  const eleAppendChildBeforeOverwrite = eleMethodsPatchedMap.get(Element.prototype.append);
  if (!eleAppendChildBeforeOverwrite) {
    Element.prototype.append = function append(...nodes: Array<Node | string>): void {
      rawElementAppend.call(getQueryTarget(this) || this, ...nodes);
    };
    eleMethodsPatchedMap.set(Element.prototype.append, rawElementAppend);
  }
  return function unPatch() {
    if (eleAppendChildBeforeOverwrite) {
      Element.prototype.append = eleAppendChildBeforeOverwrite;
    }
  };
}

function patchElementPrePend() {
  const rawElementPrepend = Element.prototype.prepend;
  const elePrePendBeforeOverwrite = eleMethodsPatchedMap.get(Element.prototype.prepend);

  if (!elePrePendBeforeOverwrite) {
    Element.prototype.prepend = function prepend(...nodes: Array<Node | string>): void {
      rawElementPrepend.call(getQueryTarget(this) || this, ...nodes);
    };
    eleMethodsPatchedMap.set(Element.prototype.prepend, rawElementPrepend);
  }
  return function unPatch() {
    if (elePrePendBeforeOverwrite) {
      Element.prototype.prepend = elePrePendBeforeOverwrite;
    }
  };
}

function patchElementInsertBefore() {
  const rawElementInsertBefore = Element.prototype.insertBefore;
  const eleInsertBeforeBeforeOverwrite = eleMethodsPatchedMap.get(Element.prototype.insertBefore);

  if (!eleInsertBeforeBeforeOverwrite) {
    Element.prototype.insertBefore = function insertBefore<T extends Node>(node: T, child: Node | null): T {
      return rawElementInsertBefore.call(getQueryTarget(this) || this, node, child) as T;
    };
    eleMethodsPatchedMap.set(Element.prototype.insertBefore, rawElementInsertBefore);
  }
  return function unPatch() {
    if (eleInsertBeforeBeforeOverwrite) {
      Element.prototype.insertBefore = eleInsertBeforeBeforeOverwrite;
    }
  };
}

function patchElementReplaceChild() {
  const rawElementReplaceChild = Element.prototype.replaceChild;
  const eleReplaceChildBeforeOverwrite = eleMethodsPatchedMap.get(Element.prototype.replaceChild);

  if (!eleReplaceChildBeforeOverwrite) {
    Element.prototype.replaceChild = function replaceChild<T extends Node>(node: Node, child: T): T {
      return rawElementReplaceChild.call(getQueryTarget(this) || this, node, child) as T;
    };
    eleMethodsPatchedMap.set(Element.prototype.replaceChild, rawElementReplaceChild);
  }
  return function unPatch() {
    if (eleReplaceChildBeforeOverwrite) {
      Element.prototype.replaceChild = eleReplaceChildBeforeOverwrite;
    }
  };
}

function patchElementClone() {
  const eleCloneBeforeOverwrite = eleMethodsPatchedMap.get(Element.prototype.cloneNode);
  const rawElementClone = Element.prototype.cloneNode;
  if (!eleCloneBeforeOverwrite) {
    Element.prototype.cloneNode = function cloneNode(deep?: boolean): Node {
      const clonedNode = rawElementClone.call(this, deep);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.__QIANKUN_APP_NAME__ && (clonedNode.__QIANKUN_APP_NAME__ = this.__QIANKUN_APP_NAME__);
      return clonedNode;
    };
    eleMethodsPatchedMap.set(Element.prototype.cloneNode, rawElementClone);
  }
  return function unPatch() {
    if (eleCloneBeforeOverwrite) {
      Element.prototype.cloneNode = eleCloneBeforeOverwrite;
    }
  };
}
/**
 * @description: prototype methods of delete element👇
 * @return {*}
 */
function patchElementRemoveChild() {
  const eleRemoveChildBeforeOverwrite = eleMethodsPatchedMap.get(Element.prototype.removeChild);
  const rawElementRemoveChild = Element.prototype.removeChild;

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
    eleMethodsPatchedMap.set(Element.prototype.removeChild, rawElementRemoveChild);
  }
  return function unPatch() {
    if (eleRemoveChildBeforeOverwrite) {
      Element.prototype.removeChild = eleRemoveChildBeforeOverwrite;
    }
  };
}

export function patchElementPrototypeMethods() {
  const unPatchElementQuerySelector = patchElementQuerySelector();
  const unPatchElementQuerySelectorAll = patchElementQuerySelectorAll();

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

    unPatchElementAppendChild();
    unPatchElementAppend();
    unPatchElementPrePend();

    unPatchElementInsertBefore();
    unPatchElementReplaceChild();
    unPatchElementRemoveChild();
    unPatchElementClone();
  };
}
