import { h } from './h'
import render from './render'

const prevVNode = h('ol', null, [
  h('li', { key: 'a' }, 'old-1'),
  h('li', { key: 'b' }, 'old-2'),
  h('li', { key: 'c' }, 'old-3'),
  h('li', { key: 'd' }, 'old-4'),
  h('li', { key: 'f' }, 'old-6'),
  h('li', { key: 'h' }, 'old-8'),
  h('li', { key: 'e' }, 'old-5')
])

const nextVNode = h('ol', null, [
  h('li', { key: 'a' }, 'new-1'),
  h('li', { key: 'c' }, 'new-3'),
  h('li', { key: 'd' }, 'new-4'),
  h('li', { key: 'b' }, 'new-2'),
  h('li', { key: 'g' }, 'new-7'),
  h('li', { key: 'e' }, 'new-5')
])

render(prevVNode, document.getElementById('app'))

setTimeout(() => {
  render(nextVNode, document.getElementById('app'))
}, 1000)
