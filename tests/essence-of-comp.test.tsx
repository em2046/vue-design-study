import Meow from '../src/main'

const { h, render } = Meow

describe('essence of comp', () => {
  it('virtual dom', () => {
    document.body.innerHTML = `<div id="root"></div>`

    const MyComponent = props => {
      return h('h1', null, props.title)
    }

    const prevVNode = MyComponent({ title: 'prev' })
    const nextVNode = (<h1>next</h1>)

    let $root = document.getElementById('root')
    render(prevVNode, $root)

    expect($root.innerHTML).toMatchSnapshot()
    expect(prevVNode).toMatchSnapshot()

    render(nextVNode, $root)

    expect($root.innerHTML).toMatchSnapshot()
    expect(prevVNode).toMatchSnapshot()
  })
})
