import type { CompatData, SupportStatement } from '@mdn/browser-compat-data';
import type { BrowserTarget } from './browserslist';

const bcd = require('@mdn/browser-compat-data') as CompatData;

export interface CompatibilityResult {
  isSupported: boolean;
  unsupportedBrowsers: string[];
  feature: string;
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
    'samsung': 'samsunginternet_android'
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
      isSupported: false,
      unsupportedBrowsers: targetBrowsers.map(b => `${b.browser} ${b.version}`),
      feature
    };
  }
  
  const support = elementData.__compat.support;
  const unsupportedBrowsers: string[] = [];
  
  for (const target of targetBrowsers) {
    const browserName = getBrowserName(target.browser);
    const browserSupport = support[browserName as keyof typeof support];
    
    if (!isVersionSupported(browserSupport, target.version)) {
      unsupportedBrowsers.push(`${target.browser} ${target.version}`);
    }
  }
  
  return {
    isSupported: unsupportedBrowsers.length === 0,
    unsupportedBrowsers,
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
      isSupported: false,
      unsupportedBrowsers: targetBrowsers.map(b => `${b.browser} ${b.version}`),
      feature
    };
  }
  
  const attributeData = elementData[attribute];
  if (!attributeData || !attributeData.__compat) {
    const globalAttribute = bcd.html?.global_attributes?.[attribute];
    if (!globalAttribute || !globalAttribute.__compat) {
      return {
        isSupported: false,
        unsupportedBrowsers: targetBrowsers.map(b => `${b.browser} ${b.version}`),
        feature
      };
    }
    
    const support = globalAttribute.__compat.support;
    const unsupportedBrowsers: string[] = [];
    
    for (const target of targetBrowsers) {
      const browserName = getBrowserName(target.browser);
      const browserSupport = support[browserName as keyof typeof support];
      
      if (!isVersionSupported(browserSupport, target.version)) {
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
    
    if (!isVersionSupported(browserSupport, target.version)) {
      unsupportedBrowsers.push(`${target.browser} ${target.version}`);
    }
  }
  
  return {
    isSupported: unsupportedBrowsers.length === 0,
    unsupportedBrowsers,
    feature
  };
}
