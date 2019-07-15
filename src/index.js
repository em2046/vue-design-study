import { h } from './h'
import render from './render'

function MyFunctionalComp(props) {
  return h('div', null, props.text)
}

class ParentComponent {
  constructor() {
    this.localState = 'one'
  }

  mounted() {
    setTimeout(() => {
      this.localState = 'two'
      this._update()
    }, 2000)
  }

  render() {
    return h(MyFunctionalComp, {
      text: this.localState
    })
  }
}

const compVNode = h(ParentComponent)
render(compVNode, document.getElementById('app'))
