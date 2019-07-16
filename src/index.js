import { h } from './h'
import render from './render'

let oldVNode = h('ol', null, [
  h('li', { key: 'a' }, 'old-1'),
  h('li', { key: 'b' }, 'old-2'),
  h('li', { key: 'c' }, 'old-3')
])
render(oldVNode, document.getElementById('app'))

let newVNode = h('ol', null, [
  h('li', { key: 'a' }, 'new-1'),
  h('li', { key: 'c' }, 'new-3')
])
setTimeout(() => {
  render(newVNode, document.getElementById('app'))
}, 1000)
