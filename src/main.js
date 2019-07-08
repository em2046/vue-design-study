const elementVnode = {
  tag: 'div'
}

class MyComponent {
  render () {
    return {
      tag: 'div'
    }
  }
}

const componentVnode = {
  tag: MyComponent
}

function render (vnode, container) {
  if (typeof vnode.tag === 'string') {
    mountElement(vnode, container)
  } else {
    mountComponent(vnode, container)
  }

}

function mountComponent (vnode, container) {
  const instance = new vnode.tag()
  instance.$vnode = instance.render()
  mountElement(instance.$vnode, container)
}

function mountElement (vnode, container) {
  const el = document.createElement(vnode.tag)
  container.appendChild(el)
}

render(componentVnode, document.getElementById('app'))
