// eslint-disable-next-line no-unused-vars
import Meow from './main'

const prevVNode = (
  <ol className="prev">
    <li key="a">prev-1</li>
    <li key="b">prev-2</li>
    <li key="c">prev-3</li>
    <li key="d">prev-4</li>
    <li key="f">prev-5</li>
    <li key="h">prev-6</li>
    <li key="e">prev-7</li>
  </ol>
)

const nextVNode = (
  <ol className="next">
    <li key="a">next-1</li>
    <li key="c">next-3</li>
    <li key="d">next-4</li>
    <li key="b">next-2</li>
    <li key="g">next-7</li>
    <li key="e">next-5</li>
  </ol>
)

Meow.render(prevVNode, document.getElementById('root'))

setTimeout(() => {
  Meow.render(nextVNode, document.getElementById('root'))
}, 1000)
