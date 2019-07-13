import { h } from './h'
import render from './render'

class ChildComponent1 {
  render() {
    return h('div', null, '子组件1')
  }
}

class ChildComponent2 {
  render() {
    return h('div', null, '子组件2')
  }
}

class ParentComponent {
  constructor() {
    this.isTrue = true
  }

  mounted() {
    setTimeout(() => {
      this.isTrue = false
      this._update()
    }, 2000)
  }

  render() {
    return this.isTrue ? h(ChildComponent1) : h(ChildComponent2)
  }
}

const compVNode = h(ParentComponent)

render(compVNode, document.getElementById('app'))
