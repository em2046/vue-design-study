import { VNodeFlags, ChildrenFlags } from './flags'
import { createTextVNode } from './h'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const domPropsRE = /[^\w-]|^(?:value|checked|selected|muted)$/

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

// eslint-disable-next-line no-unused-vars
function patch(prevVNode, vnode, container) {
  // TODO
}

function mountElement(vnode, container, isSVG) {
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG

  const el = isSVG
    ? document.createElementNS(SVG_NAMESPACE, vnode.tag)
    : document.createElement(vnode.tag)

  vnode.el = el

  const data = vnode.data
  if (data) {
    Object.keys(data).forEach(key => {
      let value = data[key]
      switch (key) {
        case 'style':
          Object.keys(data.style).forEach(k => {
            let style = data.style
            el.style[k] = style[k]
          })
          break
        case 'class':
          if (isSVG) {
            el.setAttribute(key, value)
          } else {
            el.className = value
          }
          break
        default:
          if (key[0] === 'o' && key[1] === 'n') {
            el.addEventListener(key.slice(2), value)
          } else if (domPropsRE.test(key)) {
            el[key] = value
          } else {
            el.setAttribute(key, value)
          }
          break
      }
    })
  }

  const childFlags = vnode.childFlags
  const children = vnode.children
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      mount(children, el, isSVG)
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < children.length; i++) {
        let child = children[i]
        mount(child, el, isSVG)
      }
    }
  }

  container.appendChild(el)
}

function mountComponent(vnode, container, isSVG) {
  if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
    mountStatefulComponent(vnode, container, isSVG)
  } else {
    mountFunctionalComponent(vnode, container, isSVG)
  }
}

function mountStatefulComponent(vnode, container, isSVG) {
  const instance = new vnode.tag()
  instance.$vnode = instance.render()
  mount(instance.$vnode, container, isSVG)
  instance.$el = vnode.el = instance.$vnode.el
}

function mountFunctionalComponent(vnode, container, isSVG) {
  const $vnode = vnode.tag()
  mount($vnode, container, isSVG)
  vnode.el = $vnode.el
}

function mountText(vnode, container) {
  const el = document.createTextNode(vnode.children)
  vnode.el = el
  container.appendChild(el)
}

function mountFragment(vnode, container, isSVG) {
  const { children, childFlags } = vnode
  switch (childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      mount(children, container, isSVG)
      vnode.el = children.el
      break
    case ChildrenFlags.NO_CHILDREN:
      {
        const placeholder = createTextVNode('')
        mountText(placeholder, container)
        vnode.el = placeholder.el
      }
      break
    default:
      for (let i = 0; i < children.length; i++) {
        mount(children[i], container, isSVG)
      }
      vnode.el = children[0].el
  }
}

function mountPortal(vnode, container, isSVG) {
  const { tag, children, childFlags } = vnode

  const target = typeof tag === 'string' ? document.querySelector(tag) : tag

  if (childFlags & ChildrenFlags.SINGLE_VNODE) {
    mount(children, target, isSVG)
  } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
    for (let i = 0; i < children.length; i++) {
      mount(children[0], target, isSVG)
    }
  }

  const placeholder = createTextVNode('')
  mountText(placeholder, container)
  vnode.el = placeholder.el
}
