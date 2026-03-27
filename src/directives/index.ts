import type { App } from 'vue'
import { vKeyboardNavigation } from './keyboardNavigation'

/**
 * 注册全局自定义指令
 */
export function setupDirectives(app: App) {
  app.directive('keyboard-navigation', vKeyboardNavigation)
}

export { vKeyboardNavigation }
