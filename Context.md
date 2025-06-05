# Cloud-Init-PXE Project Context 🚀

## Project Overview

The Cloud-Init-PXE webapp provides a web interface for editing iPXE files and downloading assets locally. It's integrated with the docker-cloudinitpxe project and allows for network booting configurations through an intuitive interface.

## Key Components

- **Web Application**: Runs on port 3000, providing UI for iPXE configuration
- **TFTP Server**: Runs on port 69/udp, serves network boot files
- **NGINX Webserver**: Runs on port 8080, hosts local assets

## Technical Stack

- Docker-based deployment
- Web interface for configuration
- TFTP for network booting
- NGINX for asset hosting
- Integration with netboot.xyz

## Configuration Paths

- `/config`: Configuration files
- `/assets`: Asset storage

## What We Know So Far

- The project uses Docker for containerization
- It supports iPXE booting
- Has integration with cloud-init for cloud configuration
- Provides a web interface for management
- Uses multiple network services (TFTP, HTTP)

## Development Status

- Added scripts/manage.sh for project management
- The manage.sh script provides build, start, stop, restart, status, logs, and test functions
- Trish from Accounting loves it! She says the colors make her spreadsheets feel inadequate.

## TODO

- Ensure all required directories and files exist
- Verify configuration paths are correct
- Test network services
- Improve documentation
- Add more Elvis references (because we love Elvis almost as much as we love Hue!)

## Notes from Trish

"This project is going to balance perfectly like my best-kept ledger. Just don't forget to document the depreciation schedule for these network assets! Accounting humor, get it? No? Just me? Fine."

---

*This document is a living record of our project understanding and will be updated as we learn more. Aye, Aye! 🚢*
