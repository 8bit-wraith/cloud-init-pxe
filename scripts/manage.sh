#!/bin/bash

# ================================================================
# 🚀 CLOUD-INIT-PXE MANAGEMENT SCRIPT 🚀
# ================================================================
# Created with love by Aye for Hue
# Trish from Accounting says: "This script sparks joy in my spreadsheets!"
# ================================================================

# Set some fancy colors because terminals shouldn't be boring!
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ASCII Art because why not?
function show_logo() {
  echo -e "${BLUE}"
  echo '  ____  _                 _   ___       _ _     ____  __  __ _____ '
  echo ' / ___|| | ___  _   _  __| | |_ _|_ __ (_) |_  |  _ \|  \/  | ____|'
  echo '| |    | |/ _ \| | | |/ _` |  | || '\''_ \| | __| | |_) | |\/| |  _|  '
  echo '| |___ | | (_) | |_| | (_| |  | || | | | | |_  |  __/| |  | | |___ '
  echo ' \____||_|\___/ \__,_|\__,_| |___|_| |_|_|\__| |_|   |_|  |_|_____|'
  echo -e "${RESET}"
  echo -e "${YELLOW}The King of Network Booting - Thank you, thank you very much! 👑${RESET}"
  echo
}

# Configuration - Feel free to modify these variables
DOCKER_IMAGE="cloudinitpxe-webapp"
CONTAINER_NAME="cloudinitpxe-webapp"
WEBAPP_PORT=3434
TFTP_PORT=69
NGINX_PORT=8484
CONFIG_PATH="config"
ASSETS_PATH="assets"
MENU_VERSION="2.0.84"

# Useful helper functions
function print_status() {
  echo -e "${CYAN}[STATUS]${RESET} $1"
}

function print_success() {
  echo -e "${GREEN}[SUCCESS]${RESET} $1"
}

function print_error() {
  echo -e "${RED}[ERROR]${RESET} $1"
}

function print_warning() {
  echo -e "${YELLOW}[WARNING]${RESET} $1"
}

function print_info() {
  echo -e "${BLUE}[INFO]${RESET} $1"
}

function print_trish_says() {
  echo -e "${PURPLE}[TRISH SAYS]${RESET} $1"
}

function check_docker() {
  if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH!"
    print_info "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
  fi
}

# Command: build - Build the application locally
function build_app() {
  print_status "Building ${BOLD}$DOCKER_IMAGE${RESET}..."
  
  # Use local Dockerfile instead of external repo
  print_info "Using local Dockerfile.cloud-init for build..."
  
  # Build using the Dockerfile.cloud-init in the current directory
  docker build -f Dockerfile.cloud-init -t $DOCKER_IMAGE .
  
  if [ $? -eq 0 ]; then
    print_success "Built $DOCKER_IMAGE successfully!"
    print_trish_says "These builds are more reliable than my quarterly reports!"
  else
    print_error "Failed to build $DOCKER_IMAGE!"
    print_trish_says "This budget doesn't add up..."
  fi
}

# Command: start - Start the application
function start_app() {
  print_status "Starting ${BOLD}$CONTAINER_NAME${RESET}..."
  
  # Check if container exists
  if docker ps -a --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    print_info "Container already exists, starting it..."
    docker start $CONTAINER_NAME
  else
    print_info "Creating and starting new container..."
    docker run -d \
      --name=$CONTAINER_NAME \
      -e MENU_VERSION=$MENU_VERSION \
      -p $WEBAPP_PORT:3000 \
      -p $TFTP_PORT:69/udp \
      -p $NGINX_PORT:80 \
      -v $CONFIG_PATH:/config \
      -v $ASSETS_PATH:/assets \
      --restart unless-stopped \
      $DOCKER_IMAGE
  fi
  
  if [ $? -eq 0 ]; then
    print_success "$CONTAINER_NAME is now running!"
    print_info "Web UI: http://localhost:$WEBAPP_PORT"
    print_info "TFTP Server: Port $TFTP_PORT/udp"
    print_info "NGINX Asset Server: http://localhost:$NGINX_PORT"
    print_trish_says "If this server were a balance sheet, it would definitely be in the black!"
  else
    print_error "Failed to start $CONTAINER_NAME!"
    print_trish_says "Someone's cooking the books, and it's not me!"
  fi
}

# Command: stop - Stop the application
function stop_app() {
  print_status "Stopping ${BOLD}$CONTAINER_NAME${RESET}..."
  
  if docker ps --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    docker stop $CONTAINER_NAME
    print_success "Stopped $CONTAINER_NAME!"
    print_trish_says "All assets frozen! Just like my ex's bank account..."
  else
    print_warning "$CONTAINER_NAME is not running!"
    print_trish_says "Can't stop what's not running - that's Accounting 101!"
  fi
}

# Command: restart - Restart the application
function restart_app() {
  print_status "Restarting ${BOLD}$CONTAINER_NAME${RESET}..."
  
  if docker ps -a --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    docker restart $CONTAINER_NAME
    print_success "Restarted $CONTAINER_NAME!"
    print_trish_says "Refreshing like a new fiscal year!"
  else
    print_warning "$CONTAINER_NAME doesn't exist, creating it..."
    start_app
  fi
}

# Command: status - Check the status of the application
function check_status() {
  print_status "Checking status of ${BOLD}$CONTAINER_NAME${RESET}..."
  
  if docker ps --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    container_id=$(docker ps -f "name=$CONTAINER_NAME" --format "{{.ID}}")
    echo -e "${GREEN}● Running${RESET}"
    docker stats --no-stream $container_id
    print_trish_says "Looking healthy! All indicators are positive!"
  elif docker ps -a --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    echo -e "${RED}● Stopped${RESET}"
    print_trish_says "This container is as inactive as my weekend plans!"
  else
    echo -e "${YELLOW}● Not Created${RESET}"
    print_trish_says "Container missing like my missing expense reports!"
  fi
}

# Command: logs - Show logs from the application
function show_logs() {
  print_status "Showing logs for ${BOLD}$CONTAINER_NAME${RESET}..."
  
  if docker ps -a --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    docker logs -f $CONTAINER_NAME
  else
    print_error "$CONTAINER_NAME doesn't exist!"
    print_trish_says "No logs, no evidence - perfect for an audit!"
  fi
}

# Command: test - Test if the application is working properly
function test_app() {
  print_status "Testing ${BOLD}$CONTAINER_NAME${RESET}..."
  
  if ! docker ps --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    print_error "$CONTAINER_NAME is not running!"
    print_info "Start it first with: $0 start"
    return 1
  fi
  
  # Test web interface
  print_info "Testing Web UI..."
  if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$WEBAPP_PORT)
    if [ "$HTTP_CODE" == "200" ]; then
      print_success "Web UI is working (HTTP $HTTP_CODE)!"
    else
      print_error "Web UI returned HTTP $HTTP_CODE!"
    fi
  else
    print_warning "curl is not installed, skipping Web UI test"
  fi
  
  # Basic connectivity test for TFTP
  print_info "Testing TFTP connectivity..."
  if command -v nc &> /dev/null; then
    if nc -zuv localhost $TFTP_PORT 2>&1 | grep -q "open"; then
      print_success "TFTP port is open!"
    else
      print_error "TFTP port is not accessible!"
    fi
  else
    print_warning "nc (netcat) is not installed, skipping TFTP test"
  fi
  
  print_trish_says "All tests complete! If only tax audits were this easy!"
}

# Command: help - Show help
function show_help() {
  show_logo
  echo -e "${BOLD}USAGE:${RESET}"
  echo -e "  $0 ${BOLD}command${RESET}"
  echo
  echo -e "${BOLD}COMMANDS:${RESET}"
  echo -e "  ${GREEN}build${RESET}    - Build the application locally"
  echo -e "  ${GREEN}start${RESET}    - Start the application"
  echo -e "  ${GREEN}stop${RESET}     - Stop the application"
  echo -e "  ${GREEN}restart${RESET}  - Restart the application"
  echo -e "  ${GREEN}status${RESET}   - Check application status"
  echo -e "  ${GREEN}logs${RESET}     - Show application logs"
  echo -e "  ${GREEN}test${RESET}     - Test if the application is working properly"
  echo -e "  ${GREEN}help${RESET}     - Show this help message"
  echo
  echo -e "${BOLD}EXAMPLES:${RESET}"
  echo -e "  $0 build"
  echo -e "  $0 start"
  echo -e "  $0 test"
  echo
  print_trish_says "Remember: A well-managed project is like a balanced ledger - beautiful and reliable!"
}

# Make sure Docker is installed
check_docker

# Process command line arguments
case "$1" in
  build)
    build_app
    ;;
  start)
    start_app
    ;;
  stop)
    stop_app
    ;;
  restart)
    restart_app
    ;;
  status)
    check_status
    ;;
  logs)
    show_logs
    ;;
  test)
    test_app
    ;;
  help|--help|-h|"")
    show_help
    ;;
  *)
    print_error "Unknown command: $1"
    print_info "Run '$0 help' for usage information"
    exit 1
    ;;
esac

exit 0