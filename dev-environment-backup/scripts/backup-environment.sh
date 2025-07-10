#!/bin/bash

# Backup script for development environment
# Run this before moving to local Cursor

echo "🔧 Backing up your development environment..."

# Create backup directory
BACKUP_DIR="dev-environment-backup"
mkdir -p $BACKUP_DIR

echo "📦 Backing up package.json and dependencies..."
cp package.json $BACKUP_DIR/
cp package-lock.json $BACKUP_DIR/ 2>/dev/null || echo "No package-lock.json found"
cp bun.lockb $BACKUP_DIR/ 2>/dev/null || echo "No bun.lockb found"

echo "⚙️ Backing up configuration files..."
cp tsconfig.json $BACKUP_DIR/ 2>/dev/null || echo "No tsconfig.json found"
cp tsconfig.app.json $BACKUP_DIR/ 2>/dev/null || echo "No tsconfig.app.json found"
cp tsconfig.node.json $BACKUP_DIR/ 2>/dev/null || echo "No tsconfig.node.json found"
cp vite.config.ts $BACKUP_DIR/ 2>/dev/null || echo "No vite.config.ts found"
cp tailwind.config.ts $BACKUP_DIR/ 2>/dev/null || echo "No tailwind.config.ts found"
cp postcss.config.js $BACKUP_DIR/ 2>/dev/null || echo "No postcss.config.js found"
cp eslint.config.js $BACKUP_DIR/ 2>/dev/null || echo "No eslint.config.js found"
cp components.json $BACKUP_DIR/ 2>/dev/null || echo "No components.json found"

echo "📝 Backing up scripts..."
cp -r scripts/ $BACKUP_DIR/ 2>/dev/null || echo "No scripts directory found"

echo "🔑 Backing up Supabase configuration..."
cp -r src/integrations/supabase/ $BACKUP_DIR/ 2>/dev/null || echo "No Supabase config found"

echo "📋 Creating setup instructions..."
cat > $BACKUP_DIR/SETUP_INSTRUCTIONS.md << 'EOF'
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
EOF

echo "📊 Creating environment summary..."
cat > $BACKUP_DIR/ENVIRONMENT_SUMMARY.md << 'EOF'
# Environment Summary

## Project Type
- React + TypeScript + Vite
- Tailwind CSS for styling
- Supabase for backend (recovered content)
- Markdown-based content management

## Key Dependencies
- React 18+
- TypeScript 5+
- Vite for build tooling
- Tailwind CSS for styling
- Supabase client for database access
- Marked for markdown processing

## Content Status
- ✅ 8 blog posts recovered from Supabase
- ✅ About page converted to markdown
- ✅ All images and formatting preserved
- ✅ Ready for static site generation

## Development Tools
- Node.js scripts for content recovery
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
EOF

echo "✅ Environment backup complete!"
echo "📁 Backup saved to: $BACKUP_DIR/"
echo ""
echo "📋 Next steps:"
echo "1. Copy $BACKUP_DIR/ to your local machine"
echo "2. Install Cursor on Ubuntu"
echo "3. Follow SETUP_INSTRUCTIONS.md"
echo "4. Install the recommended extensions"
echo "5. Run 'npm install' to restore dependencies" 