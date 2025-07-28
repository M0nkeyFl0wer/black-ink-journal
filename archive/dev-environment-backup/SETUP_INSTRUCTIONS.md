# Development Environment Setup

## Extensions to Install in Cursor

### Essential Extensions
- **TypeScript and JavaScript Language Features** (built-in)
- **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`
- **ESLint** - `dbaeumer.vscode-eslint`
- **Prettier** - `esbenp.prettier-vscode`
- **Auto Rename Tag** - `formulahendry.auto-rename-tag`
- **Bracket Pair Colorizer** - `CoenraadS.bracket-pair-colorizer-2`
- **GitLens** - `eamodio.gitlens`
- **Thunder Client** - `rangav.vscode-thunder-client` (for API testing)

### React/TypeScript Extensions
- **ES7+ React/Redux/React-Native snippets** - `dsznajder.es7-react-js-snippets`
- **TypeScript Importer** - `pmneo.tsimporter`
- **Import Cost** - `wix.vscode-import-cost`

### Markdown Extensions
- **Markdown All in One** - `yzhang.markdown-all-in-one`
- **Markdown Preview Enhanced** - `shd101wyy.markdown-preview-enhanced`

### Theme and Icons
- **Material Icon Theme** - `PKief.material-icon-theme`
- **One Dark Pro** - `zhuangtongfa.Material-theme` (or your preferred theme)

## Node.js Setup

1. Install Node.js 20+ on Ubuntu:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. Install dependencies:
   ```bash
   npm install
   # or if using bun:
   bun install
   ```

3. Install global tools:
   ```bash
   npm install -g typescript ts-node nodemon
   ```

## Supabase Setup

1. Copy the Supabase configuration from `src/integrations/supabase/`
2. Update environment variables if needed
3. Test connection with recovery scripts

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run recovery scripts
node scripts/recover-posts-from-supabase.cjs

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## File Structure

```
benwest.blog/
├── content/
│   ├── posts/          # Your recovered blog posts
│   └── about.md        # About page
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   └── integrations/   # Supabase config
├── scripts/            # Recovery and utility scripts
└── public/             # Static assets
```

## Notes

- All your blog posts are recovered and ready in `content/posts/`
- About page is in `content/about.md`
- Recovery scripts are in `scripts/` directory
- Supabase configuration is preserved in `src/integrations/supabase/`
