// eslint-disable-next-line no-unused-vars
import { h } from './h'
import render from './render'

const prevVNode = (
  <ol className="old">
    <li key="a">old-1</li>
    <li key="b">old-2</li>
    <li key="c">old-3</li>
    <li key="d">old-4</li>
    <li key="f">old-5</li>
    <li key="h">old-6</li>
    <li key="e">old-7</li>
  </ol>
)

const nextVNode = (
  <ol className="new">
    <li key="a">new-1</li>
    <li key="c">new-3</li>
    <li key="d">new-4</li>
    <li key="b">new-2</li>
    <li key="g">new-7</li>
    <li key="e">new-5</li>
  </ol>
)

render(prevVNode, document.getElementById('app'))

setTimeout(() => {
  render(nextVNode, document.getElementById('app'))
}, 1000)
