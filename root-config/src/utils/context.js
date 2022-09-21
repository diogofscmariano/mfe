export const getContextPathFromScriptURL = () => {
  /*
       Since the application uses browserRouting, the initial path may not correspond to the application context path.
       We use the location of the main script (index.js) to decide what is the context-path.
     */
  const script = document.querySelector('script[src*="index.js"]');
  if (script) {
    const path = new URL(script.src).pathname;
    return path.substr(0, path.length - "index.js".length);
  }
  return "/";
};

export const contextPath = getContextPathFromScriptURL();
