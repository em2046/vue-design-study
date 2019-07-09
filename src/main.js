const VNodeFlags = {
  ELEMENT_HTML: 1,
  ELEMENT_SVG: 1 << 1,

  COMPONENT_STATEFUL_NORMAL: 1 << 2,
  COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
  COMPONENT_STATEFUL_KEPT_ALIVE: 1 << 4,
  COMPONENT_FUNCTIONAL: 1 << 5,

  TEXT: 1 << 6,
  FRAGMENT: 1 << 7,
  PORTAL: 1 << 8
}

VNodeFlags.ELEMENT = VNodeFlags.ELEMENT_HTML | VNodeFlags.ELEMENT_SVG

VNodeFlags.COMPONENT_STATEFUL =
  VNodeFlags.COMPONENT_STATEFUL_NORMAL |
  VNodeFlags.COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE |
  VNodeFlags.COMPONENT_STATEFUL_KEPT_ALIVE

VNodeFlags.COMPONENT =
  VNodeFlags.COMPONENT_STATEFUL | VNodeFlags.COMPONENT_FUNCTIONAL

const ChildrenFlags = {
  UNKNOWN_CHILDREN: 0,
  NO_CHILDREN: 1,
  SINGLE_VNODE: 1 << 1,

  KEYED_VNODE: 1 << 2,
  NONE_KEYED_VNODE: 1 << 3
}

ChildrenFlags.MULTIPLE_VNODES =
  ChildrenFlags.KEYED_VNODE | ChildrenFlags.NONE_KEYED_VNODE

const htmlVNode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: 'div',
  data: null,
  children: null,
  childrenFlags: ChildrenFlags.NO_CHILDREN
}

const textVNode = {
  tag: null,
  data: null,
  children: '我是文本',
  childrenFlags: ChildrenFlags.NO_CHILDREN
}

const svgVNode = {
  flags: VNodeFlags.ELEMENT_SVG,
  tag: 'svg',
  data: null
}

const elementVNode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: 'ul',
  data: null,
  childrenFlags: ChildrenFlags.KEYED_VNODE,
  children: [
    {
      tag: 'li',
      data: null,
      key: 0
    },
    {
      tag: 'li',
      data: null,
      key: 1
    }
  ]
}

const functionalComponentVNode = {
  flags: VNodeFlags.COMPONENT_FUNCTIONAL,
  tag: MyFunctionalComponent
}

const normalComponentVNode = {
  flags: VNodeFlags.COMPONENT_STATEFUL_NORMAL,
  tag: MyStatefulComponent
}

const fragmentVNode = {
  flags: VNodeFlags.FRAGMENT,
  tag: null,
  data: null,
  childrenFlags: ChildrenFlags.SINGLE_VNODE,
  children: {
    tag: 'p',
    data: null
  }
}

const portalVNode = {
  flags: VNodeFlags.PORTAL,
  tag: '#target'
}

class MyStatefulComponent {
  render() {
    return {
      tag: 'div'
    }
  }
}

function MyFunctionalComponent() {}
