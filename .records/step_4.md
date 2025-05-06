
# Eliminating Flickering in Amazon URL Formatter Extension

The current implementation uses `chrome.webNavigation.onCompleted` which waits for the page to fully load before redirecting to the standardized URL format. This causes the flickering issue because the user first sees the original page loading and then gets redirected.

## Better Solution: Using declarativeNetRequest API

The best way to eliminate flickering is to use Chrome's `declarativeNetRequest` API, which allows the browser to redirect the URL before the page even starts loading. This happens at the network request level rather than after page load.

### Implementation Steps:

1. **Update manifest.json** to include the necessary permissions:

```json
{
  "manifest_version": 3,
  "name": "Format Amazon URL",
  "version": "1.0",
  "description": "Redirects various Amazon.co.jp URL formats to the standardized format",
  "permissions": ["declarativeNetRequest"],
  "host_permissions": ["*://www.amazon.co.jp/*"],
  "background": {
    "service_worker": "background.js"
  },
  "declarative_net_request": {
    "rule_resources": [{
      "id": "ruleset_1",
      "enabled": true,
      "path": "rules.json"
    }]
  }
}
```

2. **Create a rules.json file** with redirect rules for all Amazon URL patterns:

```json
{
  "rules": [
    {
      "id": 1,
      "priority": 1,
      "action": {
        "type": "redirect",
        "redirect": {
          "transform": {
            "scheme": "https",
            "host": "www.amazon.co.jp",
            "path": "/dp/${1}"
          }
        }
      },
      "condition": {
        "regexFilter": "^https?://www\\.amazon\\.co\\.jp/exec/obidos/ASIN/([A-Z0-9]{10}).*$",
        "resourceTypes": ["main_frame"]
      }
    },
    // Additional rules for each pattern...
  ]
}
```

3. **Create a dynamic rule setup in background.js** for patterns that are too complex for the static rules:

```javascript
chrome.runtime.onInstalled.addListener(() => {
  // Create dynamic rules for complex patterns
  const rules = [
    // Rules for each Amazon URL pattern
    createRedirectRule(1, "^https?://www\\.amazon\\.co\\.jp/exec/obidos/ASIN/([A-Z0-9]{10}).*$"),
    createRedirectRule(2, "^https?://www\\.amazon\\.co\\.jp/o/ASIN/([A-Z0-9]{10}).*$"),
    // ... more rules for each pattern
  ];

  // Update the dynamic rules
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(rule => rule.id),
    addRules: rules
  });
});

function createRedirectRule(id, regexPattern) {
  return {
    id: id,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        regexSubstitution: "https://www.amazon.co.jp/dp/\\1"
      }
    },
    condition: {
      regexFilter: regexPattern,
      resourceTypes: ["main_frame"]
    }
  };
}
```

## Benefits of This Approach:

1. **No Flickering**: The redirect happens at the network request level before any page content is loaded
2. **Better Performance**: Less resource-intensive as it doesn't require loading the page first
3. **Better User Experience**: The user only sees the final, standardized URL
4. **Future-Proof**: Uses the recommended API for Manifest V3

This implementation maintains all the functionality of the original extension but eliminates the flickering issue by intercepting and redirecting the requests before they're processed by the browser.