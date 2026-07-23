// TODO: Logger utility for application logging
export const logInfo = (message, meta = {}) => {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
};

export const logError = (message, error = {}) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};

export default { logInfo, logError };
