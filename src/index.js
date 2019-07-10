import { h, Fragment, Portal } from './h'
import { Component } from './component'

const elementVNode = h('div', null, h('span'))
console.log(elementVNode)

const elementWithTextVNode = h('div', null, '我是文本')
console.log(elementWithTextVNode)

const fragmentVNode = h(Fragment, null, [h('td'), h('td')])
console.log(fragmentVNode)

const protalVNode = h(
  Portal,
  {
    target: '#box'
  },
  h('h1')
)
console.log(protalVNode)

function MyFunctionalComponent() {}

const functionalComponentVNode = h(MyFunctionalComponent, null, h('div'))
console.log(functionalComponentVNode)

class MyStatefulComponent extends Component {}

const statefulComponentVNode = h(MyStatefulComponent, null, h('div'))
console.log(statefulComponentVNode)
