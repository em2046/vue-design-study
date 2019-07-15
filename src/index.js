import { h } from './h'
import render from './render'

let oldVNode = h('ol', null, [
  h('li', { key: 'a' }, '节点1'),
  h('li', { key: 'b' }, '节点2'),
  h('li', { key: 'c' }, '节点3')
])
render(oldVNode, document.getElementById('app'))

let newVNode = h('ol', null, [
  h('li', { key: 'd' }, '节点4'),
  h('li', { key: 'a' }, '节点1'),
  h('li', { key: 'b' }, '节点2')
])
setTimeout(() => {
  render(newVNode, document.getElementById('app'))
}, 1000)
