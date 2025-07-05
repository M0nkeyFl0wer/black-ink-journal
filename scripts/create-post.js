import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createPost() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node scripts/create-post.js "Post Title"');
    console.log('Example: node scripts/create-post.js "My New Blog Post"');
    process.exit(1);
  }

  const title = args[0];
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const postsDir = path.join(__dirname, '..', 'content', 'posts');
  const filePath = path.join(postsDir, `${slug}.md`);

  // Check if file already exists
  try {
    await fs.access(filePath);
    console.log(`❌ Post with slug "${slug}" already exists!`);
    process.exit(1);
  } catch {
    // File doesn't exist, we can create it
  }

  const now = new Date();
  const dateString = now.toISOString().split('T')[0];

  const frontmatter = `---
title: "${title}"
date: "${dateString}T00:00:00+00:00"
author: "Ben West"
excerpt: ""
tags: []
published: true
---

# ${title}

Write your content here...

## Introduction

Start with an introduction to your topic.

## Main Content

Add your main content here with proper markdown formatting.

## Conclusion

Wrap up your thoughts and provide any final insights.

---

*This post was written on ${dateString}.*
`;

  try {
    await fs.writeFile(filePath, frontmatter, 'utf8');
    console.log(`✅ Created new post: ${filePath}`);
    console.log(`📝 Edit the file to add your content`);
    console.log(`🔗 The post will be available at: /post/${slug}`);
  } catch (error) {
    console.error('❌ Error creating post:', error.message);
    process.exit(1);
  }
}

createPost(); 