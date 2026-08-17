const listeners = new Set()
let toasts = []
let idCounter = 0
const timers = new Map()

const defaultTitles = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
  loading: 'Loading',
}

function emit() {
  listeners.forEach((listener) => listener(toasts))
}

function scheduleRemoval(id, delay = 180) {
  window.setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== id)
    emit()
  }, delay)
}

function dismiss(id) {
  if (!id) {
    timers.forEach((timer) => window.clearTimeout(timer))
    timers.clear()
    toasts = []
    emit()
    return
  }

  const target = toasts.find((toast) => toast.id === id)
  if (!target || target.closing) return

  const timer = timers.get(id)
  if (timer) {
    window.clearTimeout(timer)
    timers.delete(id)
  }

  toasts = toasts.map((toast) => (toast.id === id ? { ...toast, closing: true } : toast))
  emit()
  scheduleRemoval(id)
}

function createToast(type, message, options = {}) {
  const id = `toast-${++idCounter}`
  const duration = options.duration ?? (type === 'loading' ? Infinity : 3000)
  const toast = {
    id,
    type,
    title: options.title || defaultTitles[type] || 'Notice',
    message: String(message || ''),
    duration,
    closing: false,
    createdAt: Date.now(),
  }

  toasts = [toast, ...toasts].slice(0, 6)
  emit()

  if (duration !== Infinity) {
    const timer = window.setTimeout(() => dismiss(id), duration)
    timers.set(id, timer)
  }

  return id
}

function update(id, patch = {}) {
  toasts = toasts.map((toast) => (toast.id === id ? { ...toast, ...patch } : toast))
  emit()
}

function subscribe(listener) {
  listeners.add(listener)
  listener(toasts)

  return () => {
    listeners.delete(listener)
  }
}

const toast = {
  success(message, options) {
    return createToast('success', message, options)
  },
  error(message, options) {
    return createToast('error', message, options)
  },
  warning(message, options) {
    return createToast('warning', message, options)
  },
  info(message, options) {
    return createToast('info', message, options)
  },
  loading(message, options) {
    return createToast('loading', message, options)
  },
  dismiss,
  update,
}

export { subscribe }
export default toast
