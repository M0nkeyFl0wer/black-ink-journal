# Content Management Guide

Your blog now uses markdown files instead of Supabase! This makes it much simpler to manage your content.

## 📝 Creating New Posts

```bash
npm run create:post "Your Post Title"
```

This will create a new markdown file in `content/posts/` with proper frontmatter.

## 📁 File Structure

```
content/
├── posts/                    # Your blog posts
│   ├── post-slug.md         # Individual post files
│   └── ...
└── export-summary.json      # Post metadata (auto-generated)
```

## ✏️ Editing Posts

1. **Open any `.md` file** in `content/posts/`
2. **Edit the frontmatter** at the top:
   ```yaml
   ---
   title: "Your Post Title"
   date: "2025-01-01T00:00:00+00:00"
   author: "Ben West"
   excerpt: "Brief description of your post"
   tags: ["climate", "politics"]
   published: true
   ---
   ```
3. **Write your content** in markdown below the frontmatter
4. **Save the file** - changes appear immediately in development

## 🚀 Publishing Workflow

1. **Create/edit posts** in `content/posts/`
2. **Test locally** with `npm run dev`
3. **Build for production** with `npm run build`
4. **Deploy** your changes

## 📋 Markdown Features

Your posts support full markdown:

- **Headers**: `# H1`, `## H2`, `### H3`
- **Bold**: `**bold text**`
- **Italic**: `*italic text*`
- **Links**: `[text](url)`
- **Lists**: `- item` or `1. item`
- **Code**: `` `inline code` `` or code blocks
- **Images**: `![alt](image-url)`
- **Blockquotes**: `> quote`

## 🔧 Frontmatter Options

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Post title |
| `date` | string | ✅ | Publication date (ISO format) |
| `author` | string | ❌ | Author name (defaults to "Ben West") |
| `excerpt` | string | ❌ | Brief description |
| `tags` | array | ❌ | Array of tags |
| `published` | boolean | ❌ | Whether post is published (defaults to true) |
| `featured_image` | string | ❌ | URL to featured image (e.g., "/images/filename.jpg") |

## 🎯 Tips

- **Use descriptive slugs** - they become the URL
- **Add excerpts** for better previews
- **Use tags** to organize content
- **Set `published: false`** for drafts
- **Add featured images** for better visual appeal
- **Test locally** before deploying

## 🖼️ Adding Images

### Featured Images
Add a `featured_image` field to your frontmatter:
```yaml
featured_image: "/images/your-image.jpg"
```

### Inline Images
Use standard markdown syntax in your content:
```markdown
![Alt text](/images/your-image.jpg)
```

### Available Images
Your images are stored in `public/images/`. You can reference them with paths like:
- `/images/filename.jpg`
- `/images/subfolder/image.png`

## 🚫 What's Gone

- ❌ No more Supabase database
- ❌ No more authentication issues
- ❌ No more 401 errors
- ❌ No more complex admin interface

## ✅ What's Better

- ✅ **Version control** - track changes with git
- ✅ **Edit locally** - use any text editor
- ✅ **Faster builds** - static site generation
- ✅ **Better security** - no database to hack
- ✅ **Full control** - everything in your repo

## 🔄 Migration Complete

All your existing posts have been exported to markdown files. You can now:

1. **Delete Supabase** if you want (optional)
2. **Edit posts directly** in the markdown files
3. **Create new posts** with the create script
4. **Deploy confidently** knowing everything is in your repo

Happy writing! 🎉 