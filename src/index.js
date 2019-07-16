import { h } from './h'
import render from './render'

let oldVNode = h('ol', null, [
  h('li', { key: 'a' }, 'old-1'),
  h('li', { key: 'b' }, 'old-2'),
  h('li', { key: 'c' }, 'old-3'),
  h('li', { key: 'd' }, 'old-4'),
  h('li', { key: 'f' }, 'old-6'),
  h('li', { key: 'h' }, 'old-8'),
  h('li', { key: 'e' }, 'old-5')
])
render(oldVNode, document.getElementById('app'))

let newVNode = h('ol', null, [
  h('li', { key: 'a' }, 'new-1'),
  h('li', { key: 'c' }, 'new-2'),
  h('li', { key: 'd' }, 'new-3'),
  h('li', { key: 'b' }, 'new-4'),
  h('li', { key: 'g' }, 'new-5'),
  h('li', { key: 'e' }, 'new-6')
])
setTimeout(() => {
  render(newVNode, document.getElementById('app'))
}, 1000)
