import { h } from './h'
import render from './render'

const elementVNode = h(
  'div',
  {
    style: {
      height: '100px',
      width: '100px',
      background: 'red'
    }
  },
  h('div', {
    style: {
      height: '50px',
      width: '50px',
      background: 'green'
    }
  })
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
render(svgVNode, document.getElementById('app'))
