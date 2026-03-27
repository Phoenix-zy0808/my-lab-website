import type { Directive, DirectiveBinding } from 'vue'

interface KeyboardNavigationOptions {
  /** 可选的选择器，用于查找可聚焦元素 */
  selector?: string
  /** 是否循环导航 */
  loop?: boolean
  /** 回调函数 */
  onEnter?: (element: HTMLElement) => void
  onArrowUp?: (element: HTMLElement) => void
  onArrowDown?: (element: HTMLElement) => void
  onArrowLeft?: (element: HTMLElement) => void
  onArrowRight?: (element: HTMLElement) => void
  onEscape?: () => void
}

/**
 * 键盘导航指令
 * 支持方向键、Enter、Escape 等键盘操作
 * 
 * @example
 * ```vue
 * <div v-keyboard-navigation="{ selector: 'button', onEnter: handleClick }">
 *   <button>按钮 1</button>
 *   <button>按钮 2</button>
 * </div>
 * ```
 */
export const vKeyboardNavigation: Directive<HTMLElement, KeyboardNavigationOptions> = {
  mounted(el, binding) {
    const options = binding.value || {}
    const {
      selector = '[tabindex]:not([tabindex="-1"]), button, a, input, select, textarea',
      loop = true,
    } = options

    /**
     * 获取所有可聚焦元素
     */
    const getFocusableElements = () => {
      const elements = el.querySelectorAll<HTMLElement>(selector)
      return Array.from(elements).filter(
        (item) => !item.hasAttribute('disabled') && !item.getAttribute('aria-hidden'),
      )
    }

    /**
     * 处理键盘事件
     */
    const handleKeydown = (event: KeyboardEvent) => {
      const focusableElements = getFocusableElements()
      const currentIndex = focusableElements.findIndex(el => el === document.activeElement)

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault()
          if (options.onArrowDown || options.onArrowRight) {
            const currentElement = focusableElements[currentIndex]
            if (currentElement) {
              (options.onArrowDown || options.onArrowRight)?.(currentElement)
            }
          }
          else {
            const nextIndex = currentIndex + 1
            if (nextIndex < focusableElements.length) {
              focusableElements[nextIndex].focus()
            }
            else if (loop) {
              focusableElements[0]?.focus()
            }
          }
          break

        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault()
          if (options.onArrowUp || options.onArrowLeft) {
            const currentElement = focusableElements[currentIndex]
            if (currentElement) {
              (options.onArrowUp || options.onArrowLeft)?.(currentElement)
            }
          }
          else {
            const prevIndex = currentIndex - 1
            if (prevIndex >= 0) {
              focusableElements[prevIndex].focus()
            }
            else if (loop) {
              focusableElements[focusableElements.length - 1]?.focus()
            }
          }
          break

        case 'Enter':
        case ' ':
          if (currentIndex >= 0) {
            event.preventDefault()
            const currentElement = focusableElements[currentIndex]
            if (options.onEnter) {
              options.onEnter(currentElement)
            }
            else {
              currentElement.click()
            }
          }
          break

        case 'Escape':
          if (options.onEscape) {
            event.preventDefault()
            options.onEscape()
          }
          break
      }
    }

    // 存储处理函数以便卸载
    ;(el as any)._keyboardNavigationHandler = handleKeydown
    el.addEventListener('keydown', handleKeydown)
  },

  unmounted(el) {
    if ((el as any)._keyboardNavigationHandler) {
      el.removeEventListener('keydown', (el as any)._keyboardNavigationHandler)
      delete (el as any)._keyboardNavigationHandler
    }
  },
}
