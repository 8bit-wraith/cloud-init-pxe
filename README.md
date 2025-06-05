# 🚀 Cloud-Init-PXE: The Network Boot Rockstar 🚀

![Version](https://img.shields.io/badge/version-latest-blue)
![Docker](https://img.shields.io/badge/docker-powered-blue)
![Elvis](https://img.shields.io/badge/Elvis-Approved-gold)

> "Some networks are born great, some achieve greatness, and some have greatness thrust upon them through PXE booting." — Not Shakespeare, probably

## 🎭 What Is This Magic?

This repo houses the **cloud-init-pxe webapp** - a stylish web interface for editing iPXE files and downloading assets locally. It's like a backstage pass to the rock concert of network booting!

The app allows you to:

- ✨ Configure and manage iPXE boot files through a slick web UI
- 🌐 Serve boot files via TFTP (because FTP was too mainstream)
- 🏗️ Host assets locally through a built-in NGINX webserver
- ☁️ Integrate with cloud-init for that sweet, sweet cloud configuration goodness

The app is versioned over time and is integrated into the docker-cloudinitpxe project located [here](https://github.com/cloud-init-pxe/docker-cloudinitpxe).

## 🏗️ Building It (So Easy Even Trish from Accounting Could Do It)

Uses the docker-cloudinitpxe repo for source files to avoid duplication of configs (because nobody likes copying files as much as they like copying playlists):

```bash
# Clone the repositories
git clone https://github.com/cloud-init-pxe/webapp
cd webapp
git clone https://github.com/cloud-init-pxe/docker-cloudinitpxe

# Build that beautiful container
docker build . -t cloudinitpxe-webapp
```

## 🚀 Running It Locally (Like a Boss)

```bash
docker run -d \
  --name=cloudinitpxe-webapp \
  -e MENU_VERSION=2.0.84             `# optional` \
  -p 3000:3000                       `# sets webapp port` \
  -p 69:69/udp                       `# sets tftp port` \
  -p 8080:80                         `# optional` \
  -v /local/path/to/config:/config   `# optional` \
  -v /local/path/to/assets:/assets   `# optional` \
  --restart unless-stopped \
  cloudinitpxe-webapp
```

## 🔌 Port Assignments (Because Sharing Is Caring)

- **Port 3000**: Web Application - Your gateway to iPXE glory
- **Port 8080**: NGINX Webserver - Serving assets faster than a short-order cook
- **Port 69**: TFTP Server - Yes, 69. Stop giggling, it's a standard port. Really!

## 🧙‍♂️ The Magic Management Script

We've included a powerful `scripts/manage.sh` script that handles all your container management needs with style and personality. It's colorful, informative, and occasionally makes accounting jokes (Trish insisted).

```bash
# Get help (and a motivational message from Trish)
./scripts/manage.sh help

# Build the application
./scripts/manage.sh build

# Start the container
./scripts/manage.sh start

# Check if everything is running smoothly
./scripts/manage.sh status
```

## 🏎️ Running the Latest Dev Build (Living on the Edge)

For those who like to live dangerously (we see you, edge-case enthusiasts):

```bash
docker run -d \
  --name=cloudinitpxe-webapp-dev \
  -e MENU_VERSION=2.0.84             `# optional` \
  -p 3000:3000                       `# sets webapp port` \
  -p 69:69/udp                       `# sets tftp port` \
  -p 8080:80                         `# optional` \
  -v /local/path/to/config:/config   `# optional` \
  -v /local/path/to/assets:/assets   `# optional` \
  --restart unless-stopped \
  ghcr.io/cloud-init-pxe/webapp-dev:latest
```

## 🤔 Technical Overview

Cloud-Init-PXE combines several technologies to create a seamless network booting experience:

1. **Web Interface**: A modern web application for easy configuration
2. **TFTP Server**: For serving boot files to network clients
3. **NGINX**: For hosting local assets like kernels, initrds, and other boot files
4. **Docker**: Everything containerized for easy deployment and management
5. **Cloud-Init Integration**: For customizing your booted instances

## 💡 Fun Facts

- The TFTP protocol is so old it remembers when Elvis was just getting started
- If you stack all the network packets used in PXE booting end to end, they'd reach approximately... actually, we have no idea, but Trish says the accounting on that would be a nightmare
- This project was written with more enthusiasm than a caffeinated developer at 3am

## 🧪 Contributing

Found a bug? Want to add a feature? Have a suggestion for making this even more awesome? We welcome contributions! Check out our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## 📜 License

This project is licensed under the terms included in the [LICENSE](LICENSE) file. It's like a rental agreement but for code.

---

## "Network booting: Because walking over to each computer with a USB drive is for suckers ."*

Brought to you by the team that believes Elvis is still alive (at least in our hearts and in our network packets).

Aye, Aye! 🚢
> **yes, you can even be a sucker and use a usb net boot with this project!**
