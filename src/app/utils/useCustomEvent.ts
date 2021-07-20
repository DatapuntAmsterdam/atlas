import { useEffect } from 'react'

function useCustomEvent<K extends keyof WindowEventMap>(
  target: Window,
  type: K,
  listener: (this: Element, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void
function useCustomEvent<K extends keyof ElementEventMap>(
  target: Element,
  type: K,
  listener: (this: Element, ev: ElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void
function useCustomEvent<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: K,
  listener: (this: Element, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void
function useCustomEvent(
  target: HTMLElement | Element | Window | null,
  type: string,
  listener: (this: Element, ev: Event) => any,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    if (!target) {
      return undefined
    }
    target.addEventListener(type, listener, options)

    return () => {
      target.removeEventListener(type, listener, options)
    }
    //  We need the location dependency, as we are using non-react event listeners
  }, [listener, target, type, options])
}

export default useCustomEvent
