// Listen for navigation events on Amazon.co.jp
chrome.webNavigation.onCompleted.addListener(
  function(details) {
    // Get the current URL
    const url = new URL(details.url);
    
    // Check if it's already in the shortest format
    if (isShortestFormat(url)) {
      return; // Do nothing
    }
    
    // Try to extract ASIN from the URL
    const asin = extractASIN(url);
    
    // If ASIN was found, redirect to the shortest format
    if (asin) {
      chrome.tabs.update(details.tabId, {
        url: `https://www.amazon.co.jp/dp/${asin}`
      });
    }
  },
  { url: [{ hostSuffix: 'amazon.co.jp' }] }
);

// Check if the URL is already in the shortest format
function isShortestFormat(url) {
  // Match pattern: https://www.amazon.co.jp/dp/<ASIN>
  // But exclude patterns like https://www.amazon.co.jp/Something/dp/<ASIN> or with query parameters
  const shortestPattern = /^https:\/\/www\.amazon\.co\.jp\/dp\/[A-Z0-9]{10}$/i;
  return shortestPattern.test(url.href);
}

// Extract ASIN from various Amazon URL formats
function extractASIN(url) {
  const urlString = url.href;
  
  // Pattern 1: /exec/obidos/ASIN/<ASIN>
  let match = urlString.match(/\/exec\/obidos\/ASIN\/([A-Z0-9]{10})/i);
  if (match) return match[1];
  
  // Pattern 2: /o/ASIN/<ASIN>
  match = urlString.match(/\/o\/ASIN\/([A-Z0-9]{10})/i);
  if (match) return match[1];
  
  // Pattern 3 & 4: /exec/obidos/ISBN=<ASIN> or /exec/obidos/ISBN%3D<ASIN>
  match = urlString.match(/\/exec\/obidos\/ISBN(?:%3D|=)([A-Z0-9]{10})/i);
  if (match) return match[1];
  
  // Pattern 5: /o/ISBN=<ASIN>
  match = urlString.match(/\/o\/ISBN=([A-Z0-9]{10})/i);
  if (match) return match[1];
  
  // Pattern 6 & 7: /exec/obidos/tg/detail/-/<ASIN> or /exec/obidos/tg/detail/-/Elements-Style/<ASIN>
  match = urlString.match(/\/exec\/obidos\/tg\/detail\/-\/(?:[^\/]+\/)?([A-Z0-9]{10})/i);
  if (match) return match[1];
  
  // Pattern 8 & 9: /o/tg/detail/-/<ASIN> or /o/tg/detail/-/Elements-Style/<ASIN>
  match = urlString.match(/\/o\/tg\/detail\/-\/(?:[^\/]+\/)?([A-Z0-9]{10})/i);
  if (match) return match[1];
  
  // Pattern 10: /gp/product/<ASIN>
  match = urlString.match(/\/gp\/product\/([A-Z0-9]{10})/i);
  if (match) return match[1];
  
  // Pattern 11: /gp/product/product-description/<ASIN>
  match = urlString.match(/\/gp\/product\/product-description\/([A-Z0-9]{10})/i);
  if (match) return match[1];
  
  // Pattern 12: Already handled by isShortestFormat()
  
  // Pattern 13 & 14: /Something/dp/<ASIN> or /Something/dp/product-description/<ASIN>
  match = urlString.match(/\/[^\/]+\/dp\/(?:product-description\/)?([A-Z0-9]{10})/i);
  if (match) return match[1];
  
  // Pattern 15: URLs with encoded titles before /dp/<ASIN>
  match = urlString.match(/\/[^\/]+\/dp\/([A-Z0-9]{10})/i);
  if (match) return match[1];
  
  // Pattern 17: URLs with query parameters
  match = urlString.match(/\/dp\/([A-Z0-9]{10})\?/i);
  if (match) return match[1];
  
  // No match found
  return null;
}