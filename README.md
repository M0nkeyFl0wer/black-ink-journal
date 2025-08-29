# Black Ink Journal - Ghost Blog

Ben West's personal blog with automated Bluesky feed integration.

## Bluesky Integration

This repository automatically fetches recent posts from Bluesky and makes them available as JSON for the Ghost blog widget.

### GitHub Actions

- **Update Bluesky Feed**: Runs hourly to fetch latest posts
- Files are generated at `content/files/bluesky-feed.json`

### Local Development

```bash
npm install
npm run generate-feed
```

### Archive

The original Lovable project files have been moved to `/archive/lovable-project/` for reference.

---

Blog: [benwest.blog](https://benwest.blog)  
Bluesky: [@benwest.bsky.social](https://bsky.app/profile/benwest.bsky.social)
