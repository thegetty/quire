/**
 * Determine if the process is running on Windows operating system
 */
export const IS_WINDOWS =
  process.platform === 'win32' || /^(cygwin|msys)$/.test(process.env.OSTYPE)
