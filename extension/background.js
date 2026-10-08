/**
 * Nano ADB Shield Engine - Background Service Worker
 * Handles Proxy Configuration & Dynamic Proxy Authentication for Chromium Profiles
 */

// Import generated profile configuration (injected per profile)
try {
  importScripts('profile_config.js');
} catch (e) {
  console.log('[Nano ADB Shield] Notice: profile_config.js not loaded:', e.message);
}

const config = (typeof self !== 'undefined' && self.__NANOLANCERS_CONFIG__) ? self.__NANOLANCERS_CONFIG__ : {};
const proxyConfig = config.proxy || {};

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Nano ADB Shield] Extension background service initialized');
});

// Configure chrome.proxy API if custom or github_cloud proxy details are set
if ((proxyConfig.type === 'custom' || proxyConfig.type === 'github_cloud') && proxyConfig.host && proxyConfig.port) {
  const scheme = (proxyConfig.protocol || 'socks5').toLowerCase();
  
  const proxyRules = {
    mode: 'fixed_servers',
    rules: {
      singleProxy: {
        scheme: scheme === 'socks5' ? 'socks5' : (scheme === 'https' ? 'https' : 'http'),
        host: proxyConfig.host,
        port: parseInt(proxyConfig.port, 10)
      },
      bypassList: ["<-loopback>"]
    }
  };

  if (chrome.proxy && chrome.proxy.settings) {
    chrome.proxy.settings.set(
      { value: proxyRules, scope: 'regular' },
      () => {
        if (chrome.runtime.lastError) {
          console.error('[Nano ADB Proxy Error]', chrome.runtime.lastError);
        } else {
          console.log(`[Nano ADB Proxy] Active extension proxy (${proxyConfig.type}): ${scheme}://${proxyConfig.host}:${proxyConfig.port}`);
        }
      }
    );
  }
}

// Dynamic Proxy Username/Password Authentication Listener
if (chrome.webRequest && chrome.webRequest.onAuthRequired) {
  chrome.webRequest.onAuthRequired.addListener(
    (details, asyncCallback) => {
      const u = proxyConfig.username || proxyConfig.user || '';
      const p = proxyConfig.password || proxyConfig.pass || '';
      console.log('[Nano ADB Proxy Auth] Challenge received for:', details.url, 'Proxy Host:', details.challenger?.host, 'User:', u);
      if (u || p) {
        const authResult = {
          authCredentials: {
            username: u,
            password: p
          }
        };
        if (typeof asyncCallback === 'function') {
          try { asyncCallback(authResult); } catch (e) {}
        }
        return authResult;
      }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
}

