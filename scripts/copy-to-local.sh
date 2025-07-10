#!/bin/bash

# Copy Project from Docker to Local Machine
# Run this from your local machine (not in Docker)

echo "📋 Copy Project from Docker to Local"
echo "====================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in Docker
if [ -f /.dockerenv ]; then
    echo "❌ This script should be run from your LOCAL machine, not in Docker!"
    echo ""
    echo "📋 Manual Copy Instructions:"
    echo "1. From your local machine, run one of these commands:"
    echo ""
    echo "   Option A - Using docker cp:"
    echo "   docker cp <container_id>:/root/Projects/benwest.blog ~/benwest.blog"
    echo ""
    echo "   Option B - Using scp (if SSH accessible):"
    echo "   scp -r user@server:/root/Projects/benwest.blog ~/benwest.blog"
    echo ""
    echo "   Option C - Using rsync:"
    echo "   rsync -avz user@server:/root/Projects/benwest.blog ~/benwest.blog"
    echo ""
    echo "2. Then run the local setup script:"
    echo "   cd ~/benwest.blog && chmod +x scripts/local-setup.sh && ./scripts/local-setup.sh"
    exit 1
fi

# Get container ID if Docker is running
CONTAINER_ID=""
if command -v docker &> /dev/null; then
    print_info "Looking for running containers..."
    CONTAINER_ID=$(docker ps --filter "ancestor=node:20" --format "{{.ID}}" | head -1)
    
    if [ -n "$CONTAINER_ID" ]; then
        print_success "Found container: $CONTAINER_ID"
    else
        print_warning "No running Node.js containers found"
        print_info "Available containers:"
        docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Status}}"
        echo ""
    fi
fi

# Copy methods
echo "📋 Choose your copy method:"
echo ""
echo "1. Docker copy (if container is running)"
echo "2. SCP from remote server"
echo "3. Manual copy instructions"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        if [ -n "$CONTAINER_ID" ]; then
            print_info "Copying from Docker container..."
            docker cp "$CONTAINER_ID:/root/Projects/benwest.blog" ~/benwest.blog
            print_success "Project copied to ~/benwest.blog"
        else
            print_error "No container found for Docker copy"
            exit 1
        fi
        ;;
    2)
        echo ""
        read -p "Enter server address (e.g., user@192.168.1.100): " server
        read -p "Enter remote path (default: /root/Projects/benwest.blog): " remote_path
        remote_path=${remote_path:-"/root/Projects/benwest.blog"}
        
        print_info "Copying from $server:$remote_path..."
        scp -r "$server:$remote_path" ~/benwest.blog
        print_success "Project copied to ~/benwest.blog"
        ;;
    3)
        echo ""
        echo "📋 Manual Copy Instructions:"
        echo ""
        echo "From your local machine, run one of these:"
        echo ""
        echo "Docker copy:"
        echo "  docker cp <container_id>:/root/Projects/benwest.blog ~/benwest.blog"
        echo ""
        echo "SCP from server:"
        echo "  scp -r user@server:/root/Projects/benwest.blog ~/benwest.blog"
        echo ""
        echo "rsync:"
        echo "  rsync -avz user@server:/root/Projects/benwest.blog ~/benwest.blog"
        echo ""
        echo "After copying, run:"
        echo "  cd ~/benwest.blog && chmod +x scripts/local-setup.sh && ./scripts/local-setup.sh"
        exit 0
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Run local setup if copy was successful
if [ -d "~/benwest.blog" ]; then
    echo ""
    print_info "Copy successful! Running local setup..."
    cd ~/benwest.blog
    chmod +x scripts/local-setup.sh
    ./scripts/local-setup.sh
else
    print_error "Copy failed or project not found in ~/benwest.blog"
    exit 1
fi 