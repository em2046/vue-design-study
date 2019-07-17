import { VNodeFlags, ChildrenFlags } from './flags'

export const Fragment = Symbol()
export const Portal = Symbol()

export function h(tag, data = null, ...children) {
  if (children.length === 1) {
    children = children[0]
  }

  let flags = null
  if (typeof tag === 'string') {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
    if (data && data.className) {
      data.className = normalizeClass(data.className)
    }
  } else if (tag === Fragment) {
    flags = VNodeFlags.FRAGMENT
  } else if (tag === Portal) {
    flags = VNodeFlags.PORTAL
    tag = data && data.target
  } else {
    if (tag !== null && typeof tag === 'object') {
      flags = tag.functional
        ? VNodeFlags.COMPONENT_FUNCTIONAL
        : VNodeFlags.COMPONENT_STATEFUL_NORMAL
    } else if (typeof tag === 'function') {
      flags =
        tag.prototype && tag.prototype.render
          ? VNodeFlags.COMPONENT_STATEFUL_NORMAL
          : VNodeFlags.COMPONENT_FUNCTIONAL
    }
  }

  let childFlags = null
  if (Array.isArray(children)) {
    const { length } = children
    if (length === 0) {
      childFlags = ChildrenFlags.NO_CHILDREN
    } else if (length === 1) {
      childFlags = ChildrenFlags.SINGLE_VNODE
      children = children[0]
    } else {
      childFlags = ChildrenFlags.KEYED_VNODES
      children = normalizeVNodes(children)
    }
  } else if (children == null) {
    childFlags = ChildrenFlags.NO_CHILDREN
  } else if (children._isVNode) {
    childFlags = ChildrenFlags.SINGLE_VNODE
  } else {
    childFlags = ChildrenFlags.SINGLE_VNODE
    children = createTextVNode(children + '')
  }

  return {
    _isVNode: true,
    flags,
    tag,
    data,
    key: data && data.key ? data.key : null,
    children,
    childFlags,
    el: null
  }
}

function normalizeVNodes(children) {
  const newChildren = []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.key == null) {
      child.key = '|' + i
    }
    newChildren.push(child)
  }
  return newChildren
}

function normalizeClass(classValue) {
  let ret = []
  if (typeof classValue === 'string') {
    ret.push(classValue)
  } else if (Array.isArray(classValue)) {
    classValue.forEach(name => {
      ret.push(normalizeClass(name))
    })
  } else if (typeof classValue === 'object') {
    Object.keys(classValue).forEach(name => {
      if (classValue[name]) {
        ret.push(name)
      }
    })
  }
  return ret.join(' ')
}

export function createTextVNode(text) {
  return {
    _isVNode: true,
    flags: VNodeFlags.TEXT,
    tag: null,
    data: null,
    children: text,
    childFlags: ChildrenFlags.NO_CHILDREN
  }
}
