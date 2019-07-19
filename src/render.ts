import { VNodeFlags, ChildrenFlags } from './flags'
import { createTextVNode } from './h'
import { patchData } from './patchData'

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

// region mount
function mount(vnode, container, isSVG = false, refNode = null) {
  const { flags } = vnode
  if (flags & VNodeFlags.ELEMENT) {
    mountElement(vnode, container, isSVG, refNode)
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

function mountElement(vnode, container, isSVG, refNode) {
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG

  const el = isSVG
    ? document.createElementNS(SVG_NAMESPACE, vnode.tag)
    : document.createElement(vnode.tag)

  vnode.el = el

  const data = vnode.data
  if (data) {
    Object.keys(data).forEach(key => {
      patchData(el, key, null, data[key])
    })
  }

  const childFlags = vnode.childFlags
  const children = vnode.children
  if (childFlags !== ChildrenFlags.NO_CHILDREN) {
    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
      mount(children, el, isSVG)
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for (let i = 0; i < children.length; i++) {
        mount(children[i], el, isSVG)
      }
    }
  }

  refNode ? container.insertBefore(el, refNode) : container.appendChild(el)
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
      break
    case ChildrenFlags.NO_CHILDREN:
      {
        const placeholder = createTextVNode('')
        mountText(placeholder, container)
      }
      break
    default:
      for (let i = 0; i < children.length; i++) {
        mount(children[i], container, isSVG)
      }
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

function mountComponent(vnode, container, isSVG) {
  if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
    mountStatefulComponent(vnode, container, isSVG)
  } else {
    mountFunctionalComponent(vnode, container, isSVG)
  }
}

function mountStatefulComponent(vnode, container, isSVG) {
  const instance = (vnode.children = new vnode.tag())
  instance.$props = vnode.data

  instance._update = function() {
    if (instance._mounted) {
      const prevVNode = instance.$vnode
      const nextVNode = (instance.$vnode = instance.render())
      patch(prevVNode, nextVNode, prevVNode.el.parentNode)
      instance.$el = vnode.el = instance.$vnode.el
    } else {
      instance.$vnode = instance.render()
      mount(instance.$vnode, container, isSVG)
      instance._mounted = true
      instance.$el = vnode.el = instance.$vnode.el
      instance.mounted && instance.mounted()
    }
  }
  instance._update()
}

function mountFunctionalComponent(vnode, container, isSVG) {
  vnode.handle = {
    prev: null,
    next: vnode,
    container,
    update: () => {
      if (vnode.handle.prev) {
        const prevVNode = vnode.handle.prev
        const nextVNode = vnode.handle.next
        const prevTree = prevVNode.children
        const props = nextVNode.data
        const nextTree = (nextVNode.children = nextVNode.tag(props))
        patch(prevTree, nextTree, vnode.handle.container)
      } else {
        const props = vnode.data
        const $vnode = (vnode.children = vnode.tag(props))
        mount($vnode, container, isSVG)
        vnode.el = $vnode.el
      }
    }
  }

  vnode.handle.update()
}

// endregion

// region patch
function patch(prevVNode, nextVNode, container) {
  const nextFlags = nextVNode.flags
  const prevFlags = prevVNode.flags

  if (prevFlags !== nextFlags) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode)
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode)
  }
}

function replaceVNode(prevVNode, nextVNode, container) {
  container.removeChild(prevVNode.el)
  if (prevVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    const instance = prevVNode.children
    instance.unmounted && instance.unmounted()
  }
  mount(nextVNode, container)
}

function patchElement(prevVNode, nextVNode, container) {
  if (prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return
  }

  const el = (nextVNode.el = prevVNode.el)
  const prevData = prevVNode.data
  const nextData = nextVNode.data

  if (nextData) {
    Object.keys(nextData).forEach(key => {
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      patchData(el, key, prevValue, nextValue)
    })
  }
  if (prevData) {
    Object.keys(prevData).forEach(key => {
      const prevValue = prevData[key]
      if (
        prevValue &&
        nextData &&
        !Object.keys(nextData).some(nextDataKey => key === nextDataKey)
      ) {
        patchData(el, key, prevValue, null)
      }
    })
  }

  patchChildren(
    prevVNode.childFlags,
    nextVNode.childFlags,
    prevVNode.children,
    nextVNode.children,
    el
  )
}

function patchChildren(
  prevChildFlags,
  nextChildFlags,
  prevChildren,
  nextChildren,
  container
) {
  switch (prevChildFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          patch(prevChildren, nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          container.removeChild(prevChildren.el)
          break
        default:
          container.removeChild(prevChildren.el)
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
    case ChildrenFlags.NO_CHILDREN:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          // Do nothing
          break
        default:
          for (let i = 0; i < nextChildren.length; i++) {
            mount(nextChildren[i], container)
          }
          break
      }
      break
    default:
      switch (nextChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          mount(nextChildren, container)
          break
        case ChildrenFlags.NO_CHILDREN:
          for (let i = 0; i < prevChildren.length; i++) {
            container.removeChild(prevChildren[i].el)
          }
          break
        default:
          {
            let j = 0
            let prevVNode = prevChildren[j]
            let nextVNode = nextChildren[j]
            let prevEnd = prevChildren.length - 1
            let nextEnd = nextChildren.length - 1

            outer: {
              while (prevVNode.key === nextVNode.key) {
                patch(prevVNode, nextVNode, container)
                j++
                if (j > prevEnd || j > nextEnd) {
                  break outer
                }
                prevVNode = prevChildren[j]
                nextVNode = nextChildren[j]
              }

              prevVNode = prevChildren[prevEnd]
              nextVNode = nextChildren[nextEnd]
              while (prevVNode.key === nextVNode.key) {
                patch(prevVNode, nextVNode, container)
                prevEnd--
                nextEnd--
                if (j > prevEnd || j > nextEnd) {
                  break outer
                }
                prevVNode = prevChildren[prevEnd]
                nextVNode = nextChildren[nextEnd]
              }
            }

            if (j > prevEnd && j <= nextEnd) {
              const nextPos = nextEnd + 1
              const refNode =
                nextPos < nextChildren.length ? nextChildren[nextPos].el : null
              while (j <= nextEnd) {
                mount(nextChildren[j++], container, false, refNode)
              }
            } else if (j > nextEnd) {
              while (j <= prevEnd) {
                container.removeChild(prevChildren[j++].el)
              }
            } else {
              const nextLeft = nextEnd - j + 1
              const source = []
              for (let i = 0; i < nextLeft; i++) {
                source.push(-1)
              }

              const prevStart = j
              const nextStart = j
              let moved = false
              let pos = 0

              const keyIndex = {}
              for (let i = nextStart; i <= nextEnd; i++) {
                keyIndex[nextChildren[i].key] = i
              }
              let patched = 0
              for (let i = prevStart; i <= prevEnd; i++) {
                prevVNode = prevChildren[i]

                if (patched < nextLeft) {
                  const k = keyIndex[prevVNode.key]
                  if (typeof k !== 'undefined') {
                    nextVNode = nextChildren[k]
                    patch(prevVNode, nextVNode, container)
                    patched++
                    source[k - nextStart] = i
                    if (k < pos) {
                      moved = true
                    } else {
                      pos = k
                    }
                  } else {
                    container.removeChild(prevVNode.el)
                  }
                } else {
                  container.removeChild(prevVNode.el)
                }
              }

              if (moved) {
                const seq = lis(source)
                let j = seq.length - 1
                for (let i = nextLeft; i >= 0; i--) {
                  if (source[i] === -1) {
                    const pos = i + nextStart
                    const nextVNode = nextChildren[pos]
                    const nextPos = pos + 1

                    mount(
                      nextVNode,
                      container,
                      false,
                      nextPos < nextChildren.length
                        ? nextChildren[nextPos].el
                        : null
                    )
                  } else if (i !== seq[j]) {
                    const pos = i + nextStart
                    const nextVNode = nextChildren[pos]
                    const nextPos = pos + 1

                    container.insertBefore(
                      nextVNode.el,
                      nextPos < nextChildren.length
                        ? nextChildren[nextPos].el
                        : null
                    )
                  } else {
                    j--
                  }
                }
              }
            }
          }
          break
      }
      break
  }
}

function patchText(prevVNode, nextVNode) {
  const el = (nextVNode.el = prevVNode.el)
  if (nextVNode.children !== prevVNode.children) {
    el.nodeValue = nextVNode.children
  }
}

function patchFragment(prevVNode, nextVNode, container) {
  patchChildren(
    prevVNode.childFlags,
    nextVNode.childFlags,
    prevVNode.children,
    nextVNode.children,
    container
  )

  switch (nextVNode.childFlags) {
    case ChildrenFlags.SINGLE_VNODE:
      nextVNode.el = nextVNode.children.el
      break
    case ChildrenFlags.NO_CHILDREN:
      nextVNode.el = prevVNode.el
      break
    default:
      nextVNode.el = nextVNode.children[0].el
      break
  }
}

function patchPortal(prevVNode, nextVNode) {
  patchChildren(
    prevVNode.childFlags,
    nextVNode.childFlags,
    prevVNode.children,
    nextVNode.children,
    prevVNode.tag
  )

  nextVNode.el = prevVNode.el

  if (nextVNode.tag !== prevVNode.tag) {
    const container =
      typeof nextVNode.tag === 'string'
        ? document.querySelector(nextVNode.tag)
        : nextVNode.tag

    switch (nextVNode.childFlags) {
      case ChildrenFlags.SINGLE_VNODE:
        container.appendChild(nextVNode.children.el)
        break
      case ChildrenFlags.NO_CHILDREN:
        // Do nothing
        break
      default:
        for (let i = 0; i < nextVNode.children.length; i++) {
          container.appendChild(nextVNode.children[i].el)
        }
        break
    }
  }
}

function patchComponent(prevVNode, nextVNode, container) {
  if (nextVNode.tag !== prevVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
    const instance = (nextVNode.children = prevVNode.children)
    instance.$props = nextVNode.data
    instance._update()
  } else {
    const handle = (nextVNode.handle = prevVNode.handle)
    handle.prev = prevVNode
    handle.next = nextVNode
    handle.container = container

    handle.update()
  }
}

// endregion

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function lis(arr) {
  const p = arr.slice()
  const result = [0]
  let i
  let j
  let u
  let v
  let c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = ((u + v) / 2) | 0
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
