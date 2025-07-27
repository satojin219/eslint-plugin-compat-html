import browserslist from 'browserslist';

export interface BrowserTarget {
  browser: string;
  version: string;
}

export function getSupportedBrowsers(config?: string | string[]): BrowserTarget[] {
  const browsers = browserslist(config);
  
  return browsers.map(browser => {
    const [name, version] = browser.split(' ');
    return {
      browser: name,
      version: version
    };
  });
}

export function parseBrowserslistConfig(projectPath?: string): BrowserTarget[] {
  try {
    const browsers = browserslist(undefined, { path: projectPath });
    return getSupportedBrowsers(browsers);
  } catch (error) {
    console.warn('Failed to load browserslist config, using defaults');
    return getSupportedBrowsers(['> 1%', 'last 2 versions', 'not dead']);
  }
}