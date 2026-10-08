/**
 * Nano ADB Pro Anti-Detect Engine - Core Injection Script
 * Executed at document_start in MAIN world context for native browser profiles.
 */
(function() {
  'use strict';

  // Read profile config from Window dataset or default
  const config = window.__NANOLANCERS_CONFIG__ || {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
    platform: 'Win32',
    vendor: 'Google Inc.',
    hardwareConcurrency: 16,
    deviceMemory: 16,
    maxTouchPoints: 0,
    webglVendor: 'Google Inc. (NVIDIA)',
    webglRenderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    timezone: 'America/New_York'
  };

  try {
    const engine = config.engine || (config.userAgent.includes('Firefox') ? 'gecko' : (config.userAgent.includes('Ladybird') ? 'ladybird' : (config.userAgent.includes('Servo') ? 'servo' : (config.userAgent.includes('Safari') && !config.userAgent.includes('Chrome') ? 'webkit' : 'blink'))));
    const isGecko = engine === 'gecko' || config.userAgent.includes('Firefox');
    const isLadybird = engine === 'ladybird' || config.userAgent.includes('Ladybird');
    const isServo = engine === 'servo' || config.userAgent.includes('Servo');
    const isWebKit = engine === 'webkit' || (config.userAgent.includes('Safari') && !config.userAgent.includes('Chrome'));

    // 1. Remove navigator.webdriver & clean up ChromeDriver CDC variables
    Object.defineProperty(Object.getPrototypeOf(navigator), 'webdriver', {
      get: () => undefined,
      enumerable: false,
      configurable: true
    });

    // Strip CDC and automation artifacts from window
    for (const key in window) {
      if (key.startsWith('cdc_') || key.startsWith('$cdc_') || key.startsWith('__webdriver')) {
        try { delete window[key]; } catch(e) {}
      }
    }

    // 2. Mock or Clean Chrome Runtime based on Engine Signature
    if (isGecko || isLadybird || isServo || isWebKit) {
      if (window.chrome) {
        try { delete window.chrome; } catch(e) {}
      }
    } else {
      if (!window.chrome) window.chrome = {};
      if (!window.chrome.runtime) {
        window.chrome.runtime = {
          id: 'nano-adb-shield-id',
          connect: function() {},
          sendMessage: function() {}
        };
      }
    }

    // 3. Spoof Navigator Properties & Screen Resolution
    const langs = config.languages || ['en-US', 'en'];
    let vendorName = 'Google Inc.';
    if (isGecko) vendorName = '';
    else if (isWebKit) vendorName = 'Apple Computer, Inc.';
    else if (isLadybird) vendorName = 'Ladybird Project';
    else if (isServo) vendorName = 'Servo Project';

    const navProps = {
      userAgent: { get: () => config.userAgent, configurable: true },
      platform: { get: () => config.platform, configurable: true },
      vendor: { get: () => vendorName, configurable: true },
      hardwareConcurrency: { get: () => config.hardwareConcurrency || 16, configurable: true },
      deviceMemory: { get: () => config.deviceMemory || 16, configurable: true },
      maxTouchPoints: { get: () => config.maxTouchPoints || 0, configurable: true },
      languages: { get: () => langs, configurable: true },
      language: { get: () => langs[0] || 'en-US', configurable: true },
      doNotTrack: { get: () => config.doNotTrack || '0', configurable: true }
    };

    if (isGecko) {
      navProps.appName = { get: () => 'Netscape', configurable: true };
      navProps.appCodeName = { get: () => 'Mozilla', configurable: true };
      navProps.oscpu = { get: () => 'Windows NT 10.0; Win64; x64', configurable: true };
    } else if (isLadybird) {
      navProps.appName = { get: () => 'Ladybird Browser Engine', configurable: true };
    } else if (isServo) {
      navProps.appName = { get: () => 'Servo Parallel Engine', configurable: true };
    }

    Object.defineProperties(navigator, navProps);

    if (config.screenWidth && config.screenHeight) {
      const isMob = config.isMobile || (config.maxTouchPoints && config.maxTouchPoints > 0);
      Object.defineProperties(screen, {
        width: { get: () => config.screenWidth, configurable: true },
        height: { get: () => config.screenHeight, configurable: true },
        availWidth: { get: () => config.screenWidth, configurable: true },
        availHeight: { get: () => isMob ? config.screenHeight : Math.max(200, config.screenHeight - 40), configurable: true },
        colorDepth: { get: () => 24, configurable: true },
        pixelDepth: { get: () => 24, configurable: true }
      });
    }

    if (config.isMobile || (config.maxTouchPoints && config.maxTouchPoints > 0)) {
      if (!('ontouchstart' in window)) {
        try {
          window.ontouchstart = null;
          window.ontouchend = null;
          window.ontouchmove = null;
          window.ontouchcancel = null;
        } catch (e) {}
      }
    }

    // 4. WebGL Vendor & Renderer Masking
    if (config.webglNoise !== false) {
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 0x9245) return config.webglVendor;
        if (parameter === 0x9246) return config.webglRenderer;
        return getParameter.apply(this, arguments);
      };

      if (window.WebGL2RenderingContext) {
        const getParameter2 = WebGL2RenderingContext.prototype.getParameter;
        WebGL2RenderingContext.prototype.getParameter = function(parameter) {
          if (parameter === 0x9245) return config.webglVendor;
          if (parameter === 0x9246) return config.webglRenderer;
          return getParameter2.apply(this, arguments);
        };
      }
    }

    // 5. Canvas Anti-Fingerprinting Noise
    if (config.canvasNoise !== false) {
      const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function(type) {
        if (this.width > 0 && this.height > 0) {
          const ctx = this.getContext('2d');
          if (ctx) {
            try {
              const imgData = ctx.getImageData(0, 0, this.width, this.height);
              for (let i = 0; i < imgData.data.length; i += 64) {
                imgData.data[i] = Math.min(255, imgData.data[i] ^ 1);
              }
              ctx.putImageData(imgData, 0, 0);
            } catch(e) {}
          }
        }
        return originalToDataURL.apply(this, arguments);
      };
    }

    // 6. AudioContext Protection
    if (config.audioNoise !== false) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const origCreateAnalyser = AudioCtx.prototype.createAnalyser;
        if (origCreateAnalyser) {
          AudioCtx.prototype.createAnalyser = function() {
            const analyser = origCreateAnalyser.apply(this, arguments);
            const origGetFloatFreq = analyser.getFloatFrequencyData;
            analyser.getFloatFrequencyData = function(array) {
              origGetFloatFreq.apply(this, arguments);
              for (let i = 0; i < array.length; i += 12) {
                array[i] += (Math.random() * 0.0001 - 0.00005);
              }
            };
            return analyser;
          };
        }
      }
    }

    // 7. Timezone Spoofing
    const timezoneOffsets = {
      'America/New_York': 300,
      'America/Chicago': 360,
      'America/Denver': 420,
      'America/Los_Angeles': 480,
      'Europe/London': 0,
      'Europe/Paris': -60,
      'Europe/Berlin': -60,
      'Asia/Dubai': -240,
      'Asia/Singapore': -480,
      'Asia/Tokyo': -540,
      'Asia/Kolkata': -330,
      'UTC': 0
    };
    const targetOffset = timezoneOffsets[config.timezone] !== undefined ? timezoneOffsets[config.timezone] : 300;
    Date.prototype.getTimezoneOffset = function() {
      return targetOffset;
    };

    const origResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
    Intl.DateTimeFormat.prototype.resolvedOptions = function() {
      const res = origResolvedOptions.apply(this, arguments);
      res.timeZone = config.timezone || 'America/New_York';
      return res;
    };

    // 8. WebRTC Candidate Sanitization
    if (window.RTCPeerConnection) {
      const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
      window.RTCPeerConnection.prototype.createOffer = function() {
        return origCreateOffer.apply(this, arguments).then(offer => {
          if (offer && offer.sdp) {
            offer.sdp = offer.sdp.replace(/a=candidate:.+\r\n/g, '');
          }
          return offer;
        });
      };
    }

    // 9. Real-Time Auto-Scroll & Natural Mouse Movement Random Post Clicker
    if (config.autoScroll !== false) {
      let isInitialized = false;

      const initAutoScroll = () => {
        if (isInitialized) return;
        isInitialized = true;
        
        const automationProfile = config.automationProfile || 'Natural Page Visit';
        console.log(`%c[Nano ADB Engine] Automation Active: ${automationProfile}`, 'color: #8b5cf6; font-weight: bold;');

        // Define automation behavior parameters based on selected profile
        const behaviors = {
          'Natural Page Visit': { scrollStep: [50, 150], scrollDelay: [1500, 3500], clickInterval: [8000, 15000], directionChangeProb: 0.1 },
          'Reader Behavior': { scrollStep: [30, 80], scrollDelay: [3000, 6000], clickInterval: [15000, 25000], directionChangeProb: 0.05 },
          'Header-to-Footer': { scrollStep: [100, 300], scrollDelay: [1000, 2000], clickInterval: [12000, 20000], directionChangeProb: 0.0 },
          'Article Exploration': { scrollStep: [200, 500], scrollDelay: [2000, 5000], clickInterval: [10000, 20000], directionChangeProb: 0.15 },
          'Random Reading Pattern': { scrollStep: [400, 900], scrollDelay: [1500, 4000], clickInterval: [12000, 18000], directionChangeProb: 0.3 },
          'Navigation Exploration': { scrollStep: [50, 150], scrollDelay: [1000, 3000], clickInterval: [5000, 10000], directionChangeProb: 0.2 },
          'Slow Visitor': { scrollStep: [20, 50], scrollDelay: [4000, 8000], clickInterval: [20000, 35000], directionChangeProb: 0.1 },
          'Fast Visitor': { scrollStep: [200, 600], scrollDelay: [500, 1500], clickInterval: [4000, 8000], directionChangeProb: 0.2 },
          'Content-Focused': { scrollStep: [100, 250], scrollDelay: [2000, 6000], clickInterval: [15000, 25000], directionChangeProb: 0.1 },
          'Multi-Section Explorer': { scrollStep: [300, 600], scrollDelay: [2500, 5000], clickInterval: [12000, 22000], directionChangeProb: 0.2 },
          'Back-and-Forth Reader': { scrollStep: [50, 200], scrollDelay: [1500, 3500], clickInterval: [15000, 25000], directionChangeProb: 0.4 },
          'Navigation + Content': { scrollStep: [100, 300], scrollDelay: [1500, 4000], clickInterval: [8000, 15000], directionChangeProb: 0.1 },
          'Long Session': { scrollStep: [50, 200], scrollDelay: [3000, 8000], clickInterval: [30000, 60000], directionChangeProb: 0.1 },
          'Short Session': { scrollStep: [100, 400], scrollDelay: [800, 2000], clickInterval: [4000, 10000], directionChangeProb: 0.1 },
          'Footer Explorer': { scrollStep: [200, 500], scrollDelay: [1000, 2000], clickInterval: [15000, 25000], directionChangeProb: 0.05 },
          'Internal-Link Discovery': { scrollStep: [100, 250], scrollDelay: [1500, 3500], clickInterval: [6000, 12000], directionChangeProb: 0.1 },
          'Variable Mouse Movement': { scrollStep: [50, 300], scrollDelay: [1000, 4000], clickInterval: [10000, 20000], directionChangeProb: 0.2 },
          'Variable Scroll Behavior': { scrollStep: [20, 600], scrollDelay: [500, 5000], clickInterval: [10000, 20000], directionChangeProb: 0.3 },
          'Full Browser Profile Session': { scrollStep: [50, 400], scrollDelay: [1500, 4500], clickInterval: [15000, 30000], directionChangeProb: 0.2 },
          'Adaptive Human-Like Session': { scrollStep: [100, 350], scrollDelay: [2000, 5000], clickInterval: [12000, 25000], directionChangeProb: 0.15 }
        };

        const activeBehavior = behaviors[automationProfile] || behaviors['Natural Page Visit'];

        // Create or acquire Virtual Glowing Mouse Pointer Element
        let cursor = document.getElementById('nano-virtual-cursor');
        if (!cursor) {
          cursor = document.createElement('div');
          cursor.id = 'nano-virtual-cursor';
          cursor.style.cssText = `
            position: fixed;
            width: 14px;
            height: 14px;
            background: radial-gradient(circle, #ec4899 0%, #8b5cf6 100%);
            border: 2px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 12px #8b5cf6, 0 0 20px #ec4899;
            pointer-events: none;
            z-index: 2147483647;
            transition: transform 0.05s linear;
            top: 0;
            left: 0;
            opacity: 0.9;
            transform: translate3d(200px, 200px, 0);
          `;
          if (document.body) document.body.appendChild(cursor);
        }

        let currentMouseX = 200;
        let currentMouseY = 200;
        let scrollDirection = 1;
        let isPausing = false;

        function updateCursorPos(x, y) {
          currentMouseX = x;
          currentMouseY = y;
          if (cursor) {
            cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          }
        }

        // Smooth Bezier Curve Mouse Movement Simulation
        function animateMouseTo(targetX, targetY, duration, callback) {
          const startX = currentMouseX;
          const startY = currentMouseY;
          const startTime = performance.now();

          // Random control point for natural curved mouse trajectory
          const controlX = (startX + targetX) / 2 + (Math.random() - 0.5) * 150;
          const controlY = (startY + targetY) / 2 + (Math.random() - 0.5) * 150;

          function step(now) {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);

            // Quadratic Bezier Curve formula
            const curX = Math.round((1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * targetX);
            const curY = Math.round((1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * targetY);

            updateCursorPos(curX, curY);

            // Dispatch realistic mousemove event
            try {
              const elUnder = document.elementFromPoint(curX, curY);
              if (elUnder) {
                elUnder.dispatchEvent(new MouseEvent('mousemove', {
                  bubbles: true,
                  cancelable: true,
                  clientX: curX,
                  clientY: curY
                }));
              }
            } catch (e) {}

            if (t < 1) {
              requestAnimationFrame(step);
            } else {
              if (callback) callback();
            }
          }
          requestAnimationFrame(step);
        }

        // Smooth Real-Time Scroll Loop
        function scrollLoop() {
          if (isPausing) {
            setTimeout(scrollLoop, 1000);
            return;
          }

          const minStep = activeBehavior.scrollStep[0];
          const maxStep = activeBehavior.scrollStep[1];
          const scrollStep = Math.floor(Math.random() * (maxStep - minStep)) + minStep;
          
          const currentY = window.scrollY || window.pageYOffset || 0;
          const maxScrollY = Math.max(
            document.body ? document.body.scrollHeight : 0,
            document.documentElement ? document.documentElement.scrollHeight : 0
          ) - window.innerHeight;

          if (scrollDirection === 1 && currentY >= Math.max(100, maxScrollY - 60)) {
            scrollDirection = -1;
            setTimeout(scrollLoop, Math.floor(Math.random() * 2500) + 1500);
            return;
          } else if (scrollDirection === -1 && currentY <= 40) {
            scrollDirection = 1;
            setTimeout(scrollLoop, Math.floor(Math.random() * 2500) + 1500);
            return;
          }

          // Occasional random direction changes based on profile
          if (Math.random() < activeBehavior.directionChangeProb) {
             scrollDirection *= -1;
          }

          window.scrollBy({
            top: scrollStep * scrollDirection,
            behavior: 'smooth'
          });

          // Occasionally move virtual mouse slightly while scrolling
          const randomTargetX = Math.floor(Math.random() * (window.innerWidth - 100)) + 50;
          const randomTargetY = Math.floor(Math.random() * (window.innerHeight - 100)) + 50;
          animateMouseTo(randomTargetX, randomTargetY, 400);

          const minDelay = activeBehavior.scrollDelay[0];
          const maxDelay = activeBehavior.scrollDelay[1];
          const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
          
          setTimeout(scrollLoop, delay);
        }

        setTimeout(scrollLoop, 1500);

        // Random Post Clicker Loop with Mouse Movement
        function randomPostClickerLoop() {
          const clickInterval = Math.floor(Math.random() * (activeBehavior.clickInterval[1] - activeBehavior.clickInterval[0])) + activeBehavior.clickInterval[0];

          setTimeout(() => {
            try {
              // Collect candidate links across all selectors
              const selectors = [
                'article a[href]',
                '.post a[href]',
                '.entry-title a[href]',
                'h1 a[href]',
                'h2 a[href]',
                'h3 a[href]',
                '[role="article"] a[href]',
                'main a[href]',
                'a[href]'
              ];

              let allLinks = [];
              for (const sel of selectors) {
                const els = Array.from(document.querySelectorAll(sel));
                allLinks.push(...els);
              }

              // Deduplicate & filter valid links
              const validLinks = Array.from(new Set(allLinks)).filter(el => {
                const href = (el.getAttribute('href') || '').trim();
                if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.includes('logout') || href.includes('login') || href.includes('signup')) {
                  return false;
                }
                const rect = el.getBoundingClientRect();
                return rect.width > 8 && rect.height > 8 && rect.top < window.innerHeight + 500 && rect.bottom > -500;
              });

              if (validLinks.length > 0) {
                const selectedLink = validLinks[Math.floor(Math.random() * validLinks.length)];
                isPausing = true;

                selectedLink.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(() => {
                  const rect = selectedLink.getBoundingClientRect();
                  const targetX = Math.round(rect.left + rect.width / 2);
                  const targetY = Math.round(rect.top + rect.height / 2);

                  // Animate mouse to link center
                  animateMouseTo(targetX, targetY, 600, () => {
                    const originalOutline = selectedLink.style.outline;
                    selectedLink.style.outline = '3px dashed #ec4899';
                    selectedLink.style.transition = 'outline 0.2s ease';

                    // Dispatch natural click event sequence
                    ['mouseover', 'mouseenter', 'mousedown', 'mouseup', 'click'].forEach(evtType => {
                      try {
                        selectedLink.dispatchEvent(new MouseEvent(evtType, {
                          bubbles: true,
                          cancelable: true,
                          clientX: targetX,
                          clientY: targetY,
                          button: 0
                        }));
                      } catch (e) {}
                    });

                    setTimeout(() => {
                      selectedLink.style.outline = originalOutline;
                      try {
                        selectedLink.click();
                      } catch (e) {
                        if (selectedLink.href) window.location.href = selectedLink.href;
                      }
                      isPausing = false;
                      randomPostClickerLoop();
                    }, 600);
                  });
                }, 1000);

              } else {
                randomPostClickerLoop();
              }
            } catch (err) {
              console.log('[Nano ADB AutoClicker Notice]', err);
              randomPostClickerLoop();
            }
          }, clickInterval);
        }

        setTimeout(randomPostClickerLoop, 3000);
      };

      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        initAutoScroll();
      } else {
        window.addEventListener('DOMContentLoaded', initAutoScroll);
        window.addEventListener('load', initAutoScroll);
        setTimeout(initAutoScroll, 1000);
      }
    }

    console.log('%c[Nano ADB Pro Anti-Detect Engine] Active & Shielded (' + (isGecko ? 'Gecko Mode' : 'Blink Mode') + ')', 'color: #10b981; font-weight: bold;');
  } catch (err) {
    console.error('[Nano ADB Engine] Error initializing content script:', err);
  }
})();
