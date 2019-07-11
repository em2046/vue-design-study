import { VNodeFlags, ChildrenFlags } from './flags'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
export default function render(vnode, container) {
  const prevVNode = container.vnode
  if (prevVNode == null) {
    if (vnode) {
      mount(vnode, container)
      container.vnode = vnode
    }
  } else {
    if (vnode) {
      patch(prevVNode, vnode, container)
      container.vnode = vnode
    } else {
      container.removeChild(prevVNode.el)
      container.vnode = null
    }
  }
}

function mount(vnode, container, isSVG) {
  const { flags } = vnode
  if (flags & VNodeFlags.ELEMENT) {
    mountElement(vnode, container, isSVG)
  } else if (flags & VNodeFlags.COMPONENT) {
    mountComponent(vnode, container, isSVG)
  } else if (flags & VNodeFlags.TEXT) {
    mountText(vnode, container)
  } else if (flags & VNodeFlags.FRAGMENT) {
    mountFragment(vnode, container, isSVG)
  } else if (flags & VNodeFlags.PORTAL) {
    mountPortal(vnode, container, isSVG)
  }
}

function patch(prevVNode, vnode, container) {}

function mountElement(vnode, container, isSVG) {
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG

  const el = isSVG
    ? document.createElementNS(SVG_NAMESPACE, vnode.tag)
    : document.createElement(vnode.tag)

  vnode.el = el

  const data = vnode.data
  if (data) {
    for (let key in data) {
      if (!data.hasOwnProperty(key)) {
        continue
      }
      let value = data[key]
      switch (key) {
        case 'style':
          for (let k in data.style) {
            if (!data.style.hasOwnProperty(k)) {
              continue
            }
            el.style[k] = data.style[k]
          }
          break
        case 'class':
          if (isSVG) {
            el.setAttribute(key, value)
          } else {
            el.className = value
          }
          break
        default:
          if (isSVG) {
            el.setAttribute(key, value)
          }
          break
      }
    }
  }

  const childrenFlags = vnode.childFlags
  const children = vnode.children
  if (childrenFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childrenFlags & ChildrenFlags.SINGLE_VNODE) {
      mount(children, el, isSVG)
    } else if (childrenFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < children.length; i++) {
        let child = children[i]
        mount(child, el, isSVG)
      }
    }
  }

  container.appendChild(el)
}

function mountComponent(vnode, container, isSVG) {}

function mountText(vnode, container) {}

function mountFragment(vnode, container, isSVG) {}

function mountPortal(vnode, container, isSVG) {}
