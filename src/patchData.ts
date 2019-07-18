const domPropsRE = /[^\w-]|^(?:value|checked|selected|muted)$/

export function patchData(el, key, prevValue, nextValue) {
  switch (key) {
    case 'style':
      if (nextValue) {
        Object.keys(nextValue).forEach(k => {
          el.style[k] = nextValue[k]
        })
      }
      if (prevValue) {
        Object.keys(prevValue).forEach(k => {
          if (
            nextValue &&
            !Object.keys(nextValue).some(nextValueK => k === nextValueK)
          ) {
            el.style[k] = ''
          }
        })
      }
      break
    case 'className':
      el.className = nextValue
      break
    default:
      if (key[0] === 'o' && key[1] === 'n') {
        if (prevValue) {
          el.removeEventListener(key.slice(2), prevValue)
        }

        if (nextValue) {
          el.addEventListener(key.slice(2), nextValue)
        }
      } else if (domPropsRE.test(key)) {
        el[key] = nextValue
      } else {
        el.setAttribute(key, nextValue)
      }
      break
  }
}
