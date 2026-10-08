/**
 * Anti-Detect Studio Pro - Core Anti-Fingerprint Injection Engine
 * Protects browser profile sessions against CreepJS, AmIUnique, Whoer.net & FingerprintJS.
 */
(function(window) {
  'use strict';

  window.AntiDetectEngine = {
    // Available device profile fingerprints
    deviceFingerprints: {
      'win-chrome-152': {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
        platform: 'Win32',
        vendor: 'Google Inc.',
        hardwareConcurrency: 16,
        deviceMemory: 16,
        maxTouchPoints: 0,
        webglVendor: 'Google Inc. (NVIDIA)',
        webglRenderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)',
        screenWidth: 1920,
        screenHeight: 1080
      },
      'iphone-safari-18': {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1',
        platform: 'iPhone',
        vendor: 'Apple Computer, Inc.',
        hardwareConcurrency: 6,
        deviceMemory: 8,
        maxTouchPoints: 5,
        webglVendor: 'Apple Inc.',
        webglRenderer: 'Apple GPU (A18 Pro)',
        screenWidth: 393,
        screenHeight: 852
      },
      'mac-safari-17': {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
        platform: 'MacIntel',
        vendor: 'Apple Computer, Inc.',
        hardwareConcurrency: 12,
        deviceMemory: 16,
        maxTouchPoints: 0,
        webglVendor: 'Apple Inc.',
        webglRenderer: 'Apple M3 Pro',
        screenWidth: 2560,
        screenHeight: 1600
      },
      'win-edge-150': {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0',
        platform: 'Win32',
        vendor: 'Google Inc.',
        hardwareConcurrency: 8,
        deviceMemory: 8,
        maxTouchPoints: 0,
        webglVendor: 'Google Inc. (Microsoft)',
        webglRenderer: 'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)',
        screenWidth: 1920,
        screenHeight: 1080
      },
      'android-chrome-131': {
        userAgent: 'Mozilla/5.0 (Linux; Android 15; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.135 Mobile Safari/537.36',
        platform: 'Linux armv8l',
        vendor: 'Google Inc.',
        hardwareConcurrency: 8,
        deviceMemory: 12,
        maxTouchPoints: 5,
        webglVendor: 'Qualcomm',
        webglRenderer: 'Adreno (TM) 750',
        screenWidth: 412,
        screenHeight: 915
      }
    },

    // Apply fingerprint spoofing rules to a window context
    applyFingerprint: function(targetWindow, profile) {
      if (!targetWindow) targetWindow = window;
      const deviceKey = profile.device || 'win-chrome-152';
      const fp = this.deviceFingerprints[deviceKey] || this.deviceFingerprints['win-chrome-152'];
      const timezone = profile.timezone || 'America/New_York';

      console.log(`[AntiDetect Engine] Applying profile "${profile.name}" fingerprint:`, fp.userAgent, `Timezone: ${timezone}`);

      try {
        // 1. Spoof Navigator Properties
        const nav = targetWindow.navigator;
        Object.defineProperties(nav, {
          userAgent: { get: () => fp.userAgent },
          platform: { get: () => fp.platform },
          vendor: { get: () => fp.vendor },
          hardwareConcurrency: { get: () => fp.hardwareConcurrency },
          deviceMemory: { get: () => fp.deviceMemory },
          maxTouchPoints: { get: () => fp.maxTouchPoints },
          languages: { get: () => ['en-US', 'en'] }
        });

        // 2. WebGL Vendor & Renderer Spoofing
        const getParameter = targetWindow.WebGLRenderingContext.prototype.getParameter;
        targetWindow.WebGLRenderingContext.prototype.getParameter = function(parameter) {
          // 0x9245 = UNMASKED_VENDOR_WEBGL, 0x9246 = UNMASKED_RENDERER_WEBGL
          if (parameter === 0x9245) return fp.webglVendor;
          if (parameter === 0x9246) return fp.webglRenderer;
          return getParameter.apply(this, arguments);
        };

        if (targetWindow.WebGL2RenderingContext) {
          const getParameter2 = targetWindow.WebGL2RenderingContext.prototype.getParameter;
          targetWindow.WebGL2RenderingContext.prototype.getParameter = function(parameter) {
            if (parameter === 0x9245) return fp.webglVendor;
            if (parameter === 0x9246) return fp.webglRenderer;
            return getParameter2.apply(this, arguments);
          };
        }

        // 3. Canvas Fingerprint Noise Protection
        const originalToDataURL = targetWindow.HTMLCanvasElement.prototype.toDataURL;
        targetWindow.HTMLCanvasElement.prototype.toDataURL = function(type) {
          if (this.width > 0 && this.height > 0) {
            const ctx = this.getContext('2d');
            if (ctx) {
              const imgData = ctx.getImageData(0, 0, this.width, this.height);
              // Add imperceptible noise to pixel values
              for (let i = 0; i < imgData.data.length; i += 64) {
                imgData.data[i] = Math.min(255, imgData.data[i] ^ 1);
              }
              ctx.putImageData(imgData, 0, 0);
            }
          }
          return originalToDataURL.apply(this, arguments);
        };

        // 4. AudioContext Noise Injection
        if (targetWindow.AudioContext || targetWindow.webkitAudioContext) {
          const AudioContextClass = targetWindow.AudioContext || targetWindow.webkitAudioContext;
          const originalCreateAnalyser = AudioContextClass.prototype.createAnalyser;
          if (originalCreateAnalyser) {
            AudioContextClass.prototype.createAnalyser = function() {
              const analyser = originalCreateAnalyser.apply(this, arguments);
              const originalGetFloatFrequencyData = analyser.getFloatFrequencyData;
              analyser.getFloatFrequencyData = function(array) {
                originalGetFloatFrequencyData.apply(this, arguments);
                for (let i = 0; i < array.length; i += 10) {
                  array[i] += (Math.random() * 0.0001 - 0.00005);
                }
              };
              return analyser;
            };
          }
        }

        // 5. Timezone & Intl DateTimeFormat Spoofing
        const timezoneOffsets = {
          'America/New_York': 300, // EDT (5 hours behind UTC)
          'America/Los_Angeles': 420,
          'Europe/London': 0,
          'Europe/Paris': -120,
          'Asia/Tokyo': -540,
          'Asia/Kolkata': -330
        };

        const targetOffset = timezoneOffsets[timezone] !== undefined ? timezoneOffsets[timezone] : 300;
        targetWindow.Date.prototype.getTimezoneOffset = function() {
          return targetOffset;
        };

        const originalResolvedOptions = targetWindow.Intl.DateTimeFormat.prototype.resolvedOptions;
        targetWindow.Intl.DateTimeFormat.prototype.resolvedOptions = function() {
          const res = originalResolvedOptions.apply(this, arguments);
          res.timeZone = timezone;
          return res;
        };

        // 6. WebRTC Leak Guard (Block real IP leaks via candidate gathering)
        if (targetWindow.RTCPeerConnection) {
          const originalCreateOffer = targetWindow.RTCPeerConnection.prototype.createOffer;
          targetWindow.RTCPeerConnection.prototype.createOffer = function() {
            return originalCreateOffer.apply(this, arguments).then(offer => {
              // Strip local candidate IP lines if present
              if (offer && offer.sdp) {
                offer.sdp = offer.sdp.replace(/a=candidate:.+\r\n/g, '');
              }
              return offer;
            });
          };
        }

        return true;
      } catch (err) {
        console.error('[AntiDetect Engine] Error applying fingerprint:', err);
        return false;
      }
    }
  };

})(window);
