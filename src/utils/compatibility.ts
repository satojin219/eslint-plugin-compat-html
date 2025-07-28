import type { CompatData, SupportStatement } from '@mdn/browser-compat-data';
import type { BrowserTarget } from './browserslist';

const bcd = require('@mdn/browser-compat-data') as CompatData;

export interface CompatibilityResult {
  isSupported: boolean;
  unsupportedBrowsers: string[];
  feature: string;
  mdnUrl?: string;
}

export interface DeprecationResult {
  isDeprecated: boolean;
  deprecationNote?: string;
  feature: string;
  mdnUrl?: string;
}

function generateMdnUrl(feature: string): string {
  const baseUrl = 'https://developer.mozilla.org/en-US/docs/Web/';
  
  if (feature.startsWith('html.elements.')) {
    const element = feature.replace('html.elements.', '');
    if (element.includes('.')) {
      const [elementName, attribute] = element.split('.');
      return `${baseUrl}HTML/Element/${elementName}#${attribute}`;
    }
    return `${baseUrl}HTML/Element/${element}`;
  }
  
  if (feature.startsWith('html.global_attributes.')) {
    const attribute = feature.replace('html.global_attributes.', '');
    return `${baseUrl}HTML/Global_attributes/${attribute}`;
  }
  
  return `${baseUrl}HTML`;
}

function getBrowserName(browserKey: string): string {
  const browserMap: Record<string, string> = {
    'chrome': 'chrome',
    'firefox': 'firefox', 
    'safari': 'safari',
    'edge': 'edge',
    'ie': 'ie',
    'opera': 'opera',
    'ios_saf': 'safari_ios',
    'and_chr': 'chrome_android',
    'and_ff': 'firefox_android',
    'and_qq': 'qq_android',
    'and_uc': 'uc_android',
    'android': 'webview_android',
    'baidu': 'baidu',
    'ie_mob': 'ie',
    'op_mini': 'opera_mini',
    'op_mob': 'opera_android',
    'samsung': 'samsunginternet_android',
    'kaios': 'kaios'
  };
  return browserMap[browserKey] || browserKey;
}

function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);
  
  const maxLength = Math.max(v1Parts.length, v2Parts.length);
  
  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    
    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }
  
  return 0;
}

function isVersionSupported(
  supportInfo: SupportStatement | null | undefined,
  targetVersion: string
): boolean {
  if (!supportInfo) return false;
  
  if (Array.isArray(supportInfo)) {
    return supportInfo.some(info => isVersionSupported(info, targetVersion));
  }
  
  if (typeof supportInfo === 'object') {
    const versionAdded = supportInfo.version_added;
    
    if (versionAdded === true) return true;
    if (versionAdded === false || versionAdded === null) return false;
    
    if (typeof versionAdded === 'string') {
      const cleanVersion = versionAdded.replace(/[^\d.]/g, '');
      return compareVersions(targetVersion, cleanVersion) >= 0;
    }
  }
  
  return false;
}

export function checkHtmlElementCompatibility(
  element: string,
  targetBrowsers: BrowserTarget[]
): CompatibilityResult {
  const feature = `html.elements.${element}`;
  const elementData = bcd.html?.elements?.[element];
  
  if (!elementData || !elementData.__compat) {
    return {
      isSupported: true,
      unsupportedBrowsers: [],
      feature
    };
  }
  
  const support = elementData.__compat.support;
  const unsupportedBrowsers: string[] = [];
  
  for (const target of targetBrowsers) {
    const browserName = getBrowserName(target.browser);
    const browserSupport = support[browserName as keyof typeof support];
    
    if (browserSupport && !isVersionSupported(browserSupport, target.version)) {
      unsupportedBrowsers.push(`${target.browser} ${target.version}`);
    }
  }
  
  return {
    isSupported: unsupportedBrowsers.length === 0,
    unsupportedBrowsers,
    feature,
    mdnUrl: generateMdnUrl(feature)
  };
}

export function checkHtmlElementDeprecation(element: string): DeprecationResult {
  const feature = `html.elements.${element}`;
  const elementData = bcd.html?.elements?.[element];
  
  if (!elementData || !elementData.__compat) {
    return {
      isDeprecated: false,
      feature,
      mdnUrl: generateMdnUrl(feature)
    };
  }
  
  const status = elementData.__compat.status;
  
  if (status?.deprecated) {
    return {
      isDeprecated: true,
      deprecationNote: status.deprecated === true ? undefined : String(status.deprecated),
      feature,
      mdnUrl: generateMdnUrl(feature)
    };
  }
  
  return {
    isDeprecated: false,
    feature,
    mdnUrl: generateMdnUrl(feature)
  };
}

export function checkHtmlAttributeDeprecation(
  element: string, 
  attribute: string
): DeprecationResult {
  const feature = `html.elements.${element}.${attribute}`;
  const elementData = bcd.html?.elements?.[element];
  
  if (!elementData) {
    return {
      isDeprecated: false,
      feature
    };
  }
  
  const attributeData = elementData[attribute];
  if (!attributeData || !attributeData.__compat) {
    const globalAttribute = bcd.html?.global_attributes?.[attribute];
    if (!globalAttribute || !globalAttribute.__compat) {
      return {
        isDeprecated: false,
        feature
      };
    }
    
    const status = globalAttribute.__compat.status;
    if (status?.deprecated) {
      return {
        isDeprecated: true,
        deprecationNote: status.deprecated === true ? undefined : String(status.deprecated),
        feature: `html.global_attributes.${attribute}`
      };
    }
    
    return {
      isDeprecated: false,
      feature: `html.global_attributes.${attribute}`
    };
  }
  
  const status = attributeData.__compat.status;
  if (status?.deprecated) {
    return {
      isDeprecated: true,
      deprecationNote: status.deprecated === true ? undefined : String(status.deprecated),
      feature
    };
  }
  
  return {
    isDeprecated: false,
    feature
  };
}

export function checkHtmlAttributeCompatibility(
  element: string,
  attribute: string,
  targetBrowsers: BrowserTarget[]
): CompatibilityResult {
  const feature = `html.elements.${element}.${attribute}`;
  const elementData = bcd.html?.elements?.[element];
  
  if (!elementData) {
    return {
      isSupported: true,
      unsupportedBrowsers: [],
      feature
    };
  }
  
  const attributeData = elementData[attribute];
  if (!attributeData || !attributeData.__compat) {
    const globalAttribute = bcd.html?.global_attributes?.[attribute];
    if (!globalAttribute || !globalAttribute.__compat) {
      return {
        isSupported: true,
        unsupportedBrowsers: [],
        feature
      };
    }
    
    const support = globalAttribute.__compat.support;
    const unsupportedBrowsers: string[] = [];
    
    for (const target of targetBrowsers) {
      const browserName = getBrowserName(target.browser);
      const browserSupport = support[browserName as keyof typeof support];
      
      if (browserSupport && !isVersionSupported(browserSupport, target.version)) {
        unsupportedBrowsers.push(`${target.browser} ${target.version}`);
      }
    }
    
    return {
      isSupported: unsupportedBrowsers.length === 0,
      unsupportedBrowsers,
      feature: `html.global_attributes.${attribute}`
    };
  }
  
  const support = attributeData.__compat.support;
  const unsupportedBrowsers: string[] = [];
  
  for (const target of targetBrowsers) {
    const browserName = getBrowserName(target.browser);
    const browserSupport = support[browserName as keyof typeof support];
    
    if (browserSupport && !isVersionSupported(browserSupport, target.version)) {
      unsupportedBrowsers.push(`${target.browser} ${target.version}`);
    }
  }
  
  return {
    isSupported: unsupportedBrowsers.length === 0,
    unsupportedBrowsers,
    feature,
    mdnUrl: generateMdnUrl(feature)
  };
}
