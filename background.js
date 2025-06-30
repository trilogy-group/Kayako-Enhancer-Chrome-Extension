// Background script for the Kayako Resizer extension

// Keeps user logged in throughout other brands

// Configuration
const SOURCE_DOMAIN = 'central-supportdesk.kayako.com';
const COOKIE_NAME = 'novo_sessionid';

// Log that the service worker has started
console.log('Kayako Resizer service worker started');

// Load BRANDS dynamically
let BRANDS = [];

// Import the BRANDS configuration
try {
  // This will be replaced by the build system
  // @ts-ignore
  BRANDS = BRANDS_IMPORT;
} catch (e) {
  console.error('Failed to load BRANDS:', e);
  // Fallback to a minimal set of brands
  BRANDS = [
    'central-supportdesk.kayako.com',
    'hand-support.kayako.com',
    'help.hand.com'
  ];
}

/* -----------------------------------------------------------
   Delete all existing novo_sessionid cookies on <host>
----------------------------------------------------------- */
async function purgeOldCookies(host) {
  const stale = await chrome.cookies.getAll({ domain: host, name: COOKIE_NAME });

  for (const c of stale) {
    const scheme = c.secure ? 'https' : 'http';
    const dom    = c.domain.startsWith('.') ? c.domain.slice(1) : c.domain;
    await chrome.cookies.remove({ url: `${scheme}://${dom}${c.path}`, name: COOKIE_NAME });
  }
}

/* -----------------------------------------------------------
   Write the fresh agent session on <host>
   • kayako.com hosts  →  cookie with Domain=<host>
   • other hosts       →  host‑only cookie (no domain attr)
----------------------------------------------------------- */
async function setFreshCookie(host, template) {
  const base = {
    url: `https://${host}/`,
    name: COOKIE_NAME,
    value: template.value,
    secure: template.secure ?? true,
    httpOnly: template.httpOnly,
    sameSite: template.sameSite,
    path: '/',
    expirationDate:
      template.expirationDate ?? Math.floor(Date.now() / 1000) + 86400 // +24 h
  };

  if (host.endsWith('.kayako.com') && host !== SOURCE_DOMAIN) {
    await chrome.cookies.set({ ...base, domain: host });     // explicit Domain attr
  } else {
    await chrome.cookies.set(base);                           // host‑only
  }
}

/* -----------------------------------------------------------
   Propagate the cookie to every brand (except SOURCE)
----------------------------------------------------------- */
async function propagateCookie(template) {
  for (const host of BRANDS) {
    if (host === SOURCE_DOMAIN) continue;          // never modify the source
    
    await purgeOldCookies(host);
    await setFreshCookie(host, template);
  }
}

/* -----------------------------------------------------------
   Helpers to recognise the agent cookie on the source brand
----------------------------------------------------------- */
function isSourceCookie(cookie) {
  return (
    cookie.name === COOKIE_NAME &&
    (cookie.domain === SOURCE_DOMAIN || cookie.domain === `.${SOURCE_DOMAIN}`)
  );
}

/* -----------------------------------------------------------
   Initial copy if a session already exists
----------------------------------------------------------- */
chrome.cookies.getAll({ name: COOKIE_NAME }, function(cookies) {
  const src = cookies.find(isSourceCookie);
  if (src) propagateCookie(src);
});

/* -----------------------------------------------------------
   Copy on every update to the source session
----------------------------------------------------------- */
chrome.cookies.onChanged.addListener(function(changeInfo) {
  if (changeInfo.removed || !isSourceCookie(changeInfo.cookie)) return;
  propagateCookie(changeInfo.cookie);
});

// Listener for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log("Kayako Resizer extension installed.");
});

// Listener for messages (if needed in future features)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "log") {
        console.log("Kayako Resizer Log:", message.data);
    }
});