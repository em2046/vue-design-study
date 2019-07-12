import { h, Portal } from './h'
import render from './render'
import Component from './component'

function handler() {
  console.log('click me')
}

// region elementVNode
// eslint-disable-next-line no-unused-vars
const elementVNode = h(
  'div',
  {
    style: {
      height: '100px',
      width: '100px',
      background: '#2299ee'
    },
    class: ['class-a', ['class-b', 'class-c']],
    onclick: handler
  },
  h(
    Portal,
    {
      target: '#portal-box'
    },
    [h('div', null, '我是标题1'), h('div', null, '我是标题2')]
  )
)
// endregion

// region svgVNode
// eslint-disable-next-line no-unused-vars
const svgVNode = h(
  'svg',
  {
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    width: '100',
    height: '100'
  },
  [
    h(
      'defs',
      {},
      h(
        'clipPath',
        {
          id: 'b'
        },
        h('rect', {
          width: '100',
          height: '100'
        })
      )
    ),
    h(
      'g',
      {
        id: 'a',
        'clip-path': 'url(#b)'
      },
      [
        h('rect', {
          width: '100',
          height: '100',
          fill: '#fff'
        }),
        h(
          'g',
          {
            transform: 'translate(10 10)',
            fill: '#fff',
            stroke: '#707070',
            'stroke-width': '10'
          },
          [
            h('rect', {
              width: '80',
              height: '80',
              stroke: 'none'
            }),
            h('rect', {
              x: '5',
              y: '5',
              width: '70',
              height: '70',
              fill: 'none'
            })
          ]
        )
      ]
    )
  ]
)
// endregion

// region inputVNode
// eslint-disable-next-line no-unused-vars
const inputVNode = h('input', {
  class: 'cls-a',
  type: 'checkbox',
  checked: true,
  'data-custom': '42',
  innerHTML: 'text'
})
// endregion

// region componentVNode
// eslint-disable-next-line no-unused-vars
class MyStatefulComponent extends Component {
  render() {
    return h(
      'div',
      {
        style: {
          background: '#22ee99'
        }
      },
      [h('div', null, '我是组件的标题1'), h('div', null, '我是组件的标题2')]
    )
  }
}

// eslint-disable-next-line no-unused-vars
function MyFunctionalComponent() {
  return h(
    'div',
    {
      style: {
        background: '#ee9922'
      }
    },
    [h('div', null, '我是组件的标题1'), h('div', null, '我是组件的标题2')]
  )
}

// eslint-disable-next-line no-unused-vars
const compVNode = h(MyStatefulComponent)
// render(compVNode, document.getElementById('app'))
// endregion

const prevVNode = h(
  Portal,
  {
    target: '#old-container'
  },
  h('p', null, '旧的Portal')
)

const nextVNode = h(
  Portal,
  {
    target: '#new-container'
  },
  h('p', null, '新的Portal')
)

render(prevVNode, document.getElementById('app'))

setTimeout(() => {
  render(nextVNode, document.getElementById('app'))
}, 2 * 1000)
