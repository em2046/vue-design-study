import { Fragment, h } from './h'
import render from './render'

function handler() {
  console.log('click me')
}

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
  h(Fragment, null, [h('div', null, '我是标题1'), h('div', null, '我是标题2')])
)

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

const inputVNode = h('input', {
  class: 'cls-a',
  type: 'checkbox',
  checked: true,
  'data-custom': '42',
  innerHTML: 'text'
})

render(elementVNode, document.getElementById('app'))
