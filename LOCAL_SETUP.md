# 🚀 Local Setup - One Liner Commands

## Quick Setup (Run from your local Ubuntu machine)

### Option 1: If you have the project files locally
```bash
# Copy the setup script and run it
curl -sSL https://raw.githubusercontent.com/your-repo/benwest.blog/main/scripts/local-setup.sh | bash
```

### Option 2: Copy from Docker container first
```bash
# Find your container ID
docker ps

# Copy the project (replace CONTAINER_ID with your actual container ID)
docker cp CONTAINER_ID:/root/Projects/benwest.blog ~/benwest.blog

# Run setup
cd ~/benwest.blog && chmod +x scripts/local-setup.sh && ./scripts/local-setup.sh
```

### Option 3: Copy from remote server
```bash
# Copy from server (replace with your server details)
scp -r user@server:/root/Projects/benwest.blog ~/benwest.blog

# Run setup
cd ~/benwest.blog && chmod +x scripts/local-setup.sh && ./scripts/local-setup.sh
```

## What the Setup Script Does

✅ **Automatically:**
- Copies your project to `~/Projects/benwest.blog`
- Installs Node.js 20+ if needed
- Installs all npm dependencies
- Finds and configures your Cursor AppImage
- Installs all recommended Cursor extensions
- Sets up Cursor settings (theme, formatting, etc.)
- Creates quick start scripts
- Tests the project build

## After Setup

```bash
# Navigate to project
cd ~/Projects/benwest.blog

# Open in Cursor
./open-in-cursor.sh

# Start development server
./start-dev.sh
```

## Manual Steps (if needed)

1. **Download Cursor** (if not found): https://cursor.sh
2. **Install extensions manually** (if auto-install fails):
   - Open Cursor
   - Go to Extensions (Ctrl+Shift+X)
   - Search and install from the list in `dev-environment-backup/CURSOR_EXTENSIONS.md`

## Troubleshooting

- **Permission errors**: Run with `sudo` if needed
- **Cursor not found**: Download from https://cursor.sh
- **Extensions not installing**: Install manually through Cursor's extension marketplace
- **Build errors**: Check Node.js version (should be 20+)

## Project Structure After Setup

```
~/Projects/benwest.blog/
├── content/
│   ├── posts/          # ✅ All 8 recovered blog posts
│   └── about.md        # ✅ About page
├── src/                # ✅ React app
├── scripts/            # ✅ Recovery and utility scripts
├── start-dev.sh        # ✅ Quick start script
├── open-in-cursor.sh   # ✅ Open in Cursor script
└── dev-environment-backup/  # ✅ Setup documentation
```

🎉 **You're ready to develop locally!** 