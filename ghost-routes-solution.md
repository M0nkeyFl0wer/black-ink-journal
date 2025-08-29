# Ghost JSON File Serving Solution

The issue is that Ghost doesn't serve files from `/content/images/` by default. You need to either:

## Option 1: Custom Routes (Recommended)

1. **Create a `routes.yaml` file** in your Ghost root directory:

```yaml
routes:
  /bluesky-feed.json:
    template: bluesky-feed
    content_type: application/json

collections:
  /:
    permalink: /{slug}/
    template: index
```

2. **Create template file** `content/themes/[your-theme]/bluesky-feed.hbs`:

```handlebars
{{!-- This template serves the JSON data --}}
{
  "posts": [
    {{#foreach posts limit="4"}}
    {
      "id": "{{id}}",
      "text": "{{excerpt}}",
      "createdAt": "{{date format='YYYY-MM-DDTHH:mm:ss.SSSZ'}}",
      "author": {
        "displayName": "{{primary_author.name}}",
        "handle": "benwest.bsky.social",
        "avatar": "{{primary_author.profile_image}}"
      },
      "blueskyUrl": "https://bsky.app/profile/benwest.bsky.social/post/abc123"
    }{{#unless @last}},{{/unless}}
    {{/foreach}}
  ],
  "generatedAt": "{{date format='YYYY-MM-DDTHH:mm:ss.SSSZ'}}",
  "totalPosts": {{posts.length}},
  "author": {
    "handle": "benwest.bsky.social",
    "displayName": "Ben West"
  }
}
```

## Option 2: Use GitHub Raw URL (Simplest)

Since the GitHub Action is working, just use the raw GitHub URL directly in your widget:

```javascript
var url = "https://raw.githubusercontent.com/M0nkeyFl0wer/black-ink-journal/main/bluesky-feed.json";
```

But this will have CORS issues in browsers.

## Option 3: Proxy Through Your Server

Add this to your Ghost theme or create a simple PHP/Node.js proxy:

```javascript
// Instead of fetching /content/images/bluesky-feed.json
// Fetch from a proxy endpoint that you create
var url = "/api/bluesky-proxy";
```

## Recommended Next Steps:

1. **Try the GitHub raw URL** with a CORS proxy
2. **Or set up the custom routes** approach
3. **Or create a simple server-side proxy** to fetch from GitHub

Which approach would you prefer to try first?