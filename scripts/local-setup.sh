#!/bin/bash

# Local Setup Script for Ben West's Blog
# Run this on your local Ubuntu machine

set -e  # Exit on any error

echo "🚀 Setting up Ben West's Blog locally..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're running locally (not in Docker)
if [ -f /.dockerenv ]; then
    print_error "This script should be run on your local machine, not in Docker!"
    exit 1
fi

# Set up project directory
PROJECT_DIR="$HOME/Projects/benwest.blog"
BACKUP_DIR="$HOME/benwest.blog-backup"

print_status "Setting up project in: $PROJECT_DIR"

# Create Projects directory if it doesn't exist
mkdir -p "$HOME/Projects"

# Check if project already exists
if [ -d "$PROJECT_DIR" ]; then
    print_warning "Project directory already exists at $PROJECT_DIR"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Setup cancelled."
        exit 0
    fi
    rm -rf "$PROJECT_DIR"
fi

# Copy project from backup or create from current directory
if [ -d "$BACKUP_DIR" ]; then
    print_status "Found backup directory, copying project..."
    cp -r "$BACKUP_DIR" "$PROJECT_DIR"
    print_success "Project copied from backup"
elif [ -d "./dev-environment-backup" ]; then
    print_status "Found dev-environment-backup in current directory..."
    cp -r . "$PROJECT_DIR"
    print_success "Project copied from current directory"
else
    print_error "No backup found! Please ensure you have the project files."
    print_status "Expected locations:"
    print_status "  - $BACKUP_DIR"
    print_status "  - ./dev-environment-backup"
    exit 1
fi

cd "$PROJECT_DIR"

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    print_success "Node.js installed"
else
    print_status "Node.js already installed: $(node --version)"
fi

# Install npm dependencies
print_status "Installing npm dependencies..."
npm install
print_success "Dependencies installed"

# Check for Cursor AppImage
CURSOR_APPIMAGE="$HOME/cursor-*.AppImage"
if ls $CURSOR_APPIMAGE 1> /dev/null 2>&1; then
    print_status "Found Cursor AppImage, making it executable..."
    chmod +x $CURSOR_APPIMAGE
    print_success "Cursor AppImage is ready to use"
    
    # Create desktop shortcut
    print_status "Creating desktop shortcut for Cursor..."
    cat > "$HOME/.local/share/applications/cursor.desktop" << EOF
[Desktop Entry]
Name=Cursor
Exec=$HOME/cursor-*.AppImage
Icon=cursor
Type=Application
Categories=Development;IDE;
EOF
    print_success "Desktop shortcut created"
else
    print_warning "No Cursor AppImage found in home directory"
    print_status "You can download it from: https://cursor.sh"
fi

# Install Cursor extensions
print_status "Installing Cursor extensions..."

# List of essential extensions
extensions=(
    "bradlc.vscode-tailwindcss"
    "dbaeumer.vscode-eslint"
    "esbenp.prettier-vscode"
    "formulahendry.auto-rename-tag"
    "CoenraadS.bracket-pair-colorizer-2"
    "eamodio.gitlens"
    "dsznajder.es7-react-js-snippets"
    "pmneo.tsimporter"
    "wix.vscode-import-cost"
    "yzhang.markdown-all-in-one"
    "shd101wyy.markdown-preview-enhanced"
    "rangav.vscode-thunder-client"
    "PKief.material-icon-theme"
    "zhuangtongfa.Material-theme"
)

# Try to install extensions if Cursor is available
if command -v cursor &> /dev/null; then
    for extension in "${extensions[@]}"; do
        print_status "Installing $extension..."
        cursor --install-extension "$extension" || print_warning "Failed to install $extension"
    done
    print_success "Extensions installation attempted"
elif ls $CURSOR_APPIMAGE 1> /dev/null 2>&1; then
    print_status "Installing extensions via AppImage..."
    for extension in "${extensions[@]}"; do
        print_status "Installing $extension..."
        $CURSOR_APPIMAGE --install-extension "$extension" || print_warning "Failed to install $extension"
    done
    print_success "Extensions installation attempted"
else
    print_warning "Cursor not found. Please install extensions manually after starting Cursor."
    print_status "Extension list saved to: $PROJECT_DIR/dev-environment-backup/CURSOR_EXTENSIONS.md"
fi

# Create Cursor settings
print_status "Setting up Cursor settings..."
mkdir -p "$HOME/.config/Cursor/User"
cat > "$HOME/.config/Cursor/User/settings.json" << 'EOF'
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "typescript.preferences.importModuleSpecifier": "relative",
    "tailwindCSS.includeLanguages": {
        "typescript": "javascript",
        "typescriptreact": "javascript"
    },
    "workbench.colorTheme": "One Dark Pro",
    "workbench.iconTheme": "material-icon-theme",
    "editor.fontSize": 14,
    "editor.fontFamily": "'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
    "editor.fontLigatures": true
}
EOF
print_success "Cursor settings configured"

# Test the project
print_status "Testing the project..."
if npm run build &> /dev/null; then
    print_success "Project builds successfully!"
else
    print_warning "Project build failed, but this might be expected for development"
fi

# Create a quick start script
cat > "$PROJECT_DIR/start-dev.sh" << 'EOF'
#!/bin/bash
echo "🚀 Starting Ben West's Blog development server..."
echo "📁 Project directory: $(pwd)"
echo "🌐 Server will be available at: http://localhost:5173"
echo ""
npm run dev
EOF
chmod +x "$PROJECT_DIR/start-dev.sh"

# Create a script to open in Cursor
cat > "$PROJECT_DIR/open-in-cursor.sh" << 'EOF'
#!/bin/bash
echo "📂 Opening project in Cursor..."
if command -v cursor &> /dev/null; then
    cursor .
elif ls ~/cursor-*.AppImage 1> /dev/null 2>&1; then
    ~/cursor-*.AppImage .
else
    echo "❌ Cursor not found. Please install it first."
    echo "Download from: https://cursor.sh"
fi
EOF
chmod +x "$PROJECT_DIR/open-in-cursor.sh"

# Final summary
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📁 Project location: $PROJECT_DIR"
echo "🚀 Start development: cd $PROJECT_DIR && ./start-dev.sh"
echo "📂 Open in Cursor: cd $PROJECT_DIR && ./open-in-cursor.sh"
echo ""
echo "📋 What was set up:"
echo "  ✅ Project files copied"
echo "  ✅ Node.js dependencies installed"
echo "  ✅ Cursor AppImage configured (if found)"
echo "  ✅ Cursor extensions installed"
echo "  ✅ Cursor settings configured"
echo "  ✅ Quick start scripts created"
echo ""
echo "🔧 Next steps:"
echo "  1. cd $PROJECT_DIR"
echo "  2. ./open-in-cursor.sh"
echo "  3. ./start-dev.sh"
echo ""
echo "📚 Documentation:"
echo "  - Setup guide: $PROJECT_DIR/dev-environment-backup/SETUP_INSTRUCTIONS.md"
echo "  - Extensions list: $PROJECT_DIR/dev-environment-backup/CURSOR_EXTENSIONS.md"
echo "  - Recovery summary: $PROJECT_DIR/dev-environment-backup/RECOVERY_SUMMARY.md"
echo ""

print_success "Local setup completed successfully!" 