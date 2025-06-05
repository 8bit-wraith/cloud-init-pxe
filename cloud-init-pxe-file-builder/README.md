## Cloud-Init-PXE [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Your%20favorite%20operating%20systems%20in%20one%20place!&url=https://Cloud-Init-PXE&hashtags=cloudinitpxecom,ipxe,pxe,linux,tech,code)

Your favorite operating systems in one place!

[![Build Status](https://github.com/cloudinitpxecom/Cloud-Init-PXE/workflows/release/badge.svg)](https://github.com/cloudinitpxecom/Cloud-Init-PXE/actions?query=workflow%3Arelease)
[![Discord](https://img.shields.io/discord/425186187368595466)](https://discord.gg/An6PA2a)
[![Release](https://img.shields.io/github/v/release/cloudinitpxecom/Cloud-Init-PXE?color=hunter%20green)](https://github.com/cloudinitpxecom/Cloud-Init-PXE/releases/latest)
![GitHub all releases](https://img.shields.io/github/downloads/cloudinitpxecom/Cloud-Init-PXE/total)

![Cloud-Init-PXE menu](https://Cloud-Init-PXE/images/Cloud-Init-PXE.gif)

### Bootloader Downloads

#### Combined Legacy and UEFI iPXE Bootloaders

| Type | Bootloader | Description |
|------|------------|-------------|
|ISO| [Cloud-Init-PXE.iso](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE.iso)| Used for CD/DVD, Virtual CDs, DRAC/iLO, VMware, Virtual Box |
|USB| [Cloud-Init-PXE.img](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE.img)| Used for creation of USB Keys|

#### Legacy (PCBIOS) iPXE Bootloaders

| Type | Bootloader | Description |
|------|------------|-------------|
|Kernel| [Cloud-Init-PXE.lkrn](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE.lkrn)|Used for booting from GRUB/EXTLINUX|
|Floppy| [Cloud-Init-PXE.dsk](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE.dsk)| Virtual floppy disk for DRAC/iLO, VMware, Virtual Box, etc|
|Padded Floppy| [Cloud-Init-PXE.pdsk](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE.pdsk)| Padded Virtual floppy disk for DRAC/iLO, VMware, Virtual Box, etc|
|DHCP| [Cloud-Init-PXE.kpxe](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE.kpxe)| DHCP boot image file, uses built-in iPXE NIC drivers|
|DHCP-undionly| [Cloud-Init-PXE-undionly.kpxe](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE-undionly.kpxe)| DHCP boot image file, use if you have NIC issues|

#### UEFI iPXE Bootloaders

| Type | Bootloader | Description |
|------|------------|-------------|
|DHCP| [Cloud-Init-PXE.efi](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE.efi)| DHCP boot image file, uses built-in iPXE NIC drivers|
|DHCP-snp| [Cloud-Init-PXE-snp.efi](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE-snp.efi)| EFI w/ Simple Network Protocol, attempts to boot all net devices|
|DHCP-snponly| [Cloud-Init-PXE-snponly.efi](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE-snponly.efi)| EFI w/ Simple Network Protocol, only boots from device chained from|

#### ARM64 iPXE Bootloaders

| Type | Bootloader | Description |
|------|------------|-------------|
|DHCP| [Cloud-Init-PXE-arm64.efi](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE-arm64.efi)| DHCP boot image file, uses built-in iPXE NIC drivers|
|DHCP-snp| [Cloud-Init-PXE-arm64-snp.efi](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE-arm64-snp.efi)| EFI w/ Simple Network Protocol, attempts to boot all net devices|
|DHCP-snponly| [Cloud-Init-PXE-arm64-snponly.efi](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE-arm64-snponly.efi)| EFI w/ Simple Network Protocol, only boots from device chained from|

#### Raspberry Pi iPXE Bootloaders

| Type | Bootloader | Description |
|------|------------|-------------|
|USB/SD Card| [Cloud-Init-PXE-rpi4-sdcard.img](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE-rpi4-sdcard.img)| Raspberry Pi 4 - USB/SD Card Image|
|DHCP-snp| [Cloud-Init-PXE-rpi4-snp.efi](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE-rpi4-snp.efi)| Raspberry Pi 4 - EFI Image|

SHA256 checksums are generated during each build of iPXE and are located [here](https://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE-sha256-checksums.txt).  You can also view the scripts that are embedded into the images [here](https://github.com/cloudinitpxecom/Cloud-Init-PXE/tree/master/ipxe/disks).

### What is Cloud-Init-PXE?

[Cloud-Init-PXE](http://www.Cloud-Init-PXE) is a convenient place to boot into any type of operating system or utility disk without the need of having to go spend time retrieving the ISO just to run it.  [iPXE](http://ipxe.org/) is used to provide a user friendly menu from within the BIOS that lets you easily choose the operating system you want along with any specific types of versions or bootable flags.

If you already have iPXE up and running on the network, you can hit Cloud-Init-PXE at anytime by typing for Legacy (PCBIOS) mode:

    chain --autofree http://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE.lkrn

or when in UEFI mode:

    chain --autofree http://boot.Cloud-Init-PXE/ipxe/Cloud-Init-PXE.efi

You can also load using HTTPS, but by default builds of iPXE do not have HTTPS support compiled in. This will load the appropriate Cloud-Init-PXE kernel with all of the proper options enabled.

### Documentation

See [Cloud-Init-PXE](https://Cloud-Init-PXE) for all documentation.  Some links to get started with are:

* [Downloads](https://Cloud-Init-PXE/downloads/)
* [Self Hosting](https://Cloud-Init-PXE/docs/selfhosting/)
* [Booting Methods](https://Cloud-Init-PXE/docs/booting/ipxe)
* [FAQ](https://Cloud-Init-PXE/docs/faq)
* [Blog](https://Cloud-Init-PXE/blog)

If you'd like to contribute to the documentation, the Cloud-Init-PXE documentation is located at [Cloud-Init-PXE-docs](https://github.com/cloudinitpxecom/Cloud-Init-PXE-docs).

### Self Hosting Cloud-Init-PXE

For those users who want to deploy their own Cloud-Init-PXE environment,  you can leverage the same scripts that are used to deploy the hosted environment. The source scripts are all Ansible templates and can be generated and customized to your preference.

Please see the [self-hosting docs](https://Cloud-Init-PXE/docs/selfhosting/) for more information but in short:

#### Deploying using Ansible

To generate, run:

```
ansible-playbook site.yml
```

The build output will be located in /var/www/html by default.

#### Deploying with Docker

```
docker build -t localbuild --platform=linux/amd64 -f Dockerfile .
docker run --rm -it --platform=linux/amd64 -v $(pwd):/buildout localbuild
```

The build output will be in the generated folder `buildout`

#### Local Overrides

Ansible will handle source generation as well as iPXE disk generation with your settings.  It will generate Legacy (PCBIOS) and UEFI iPXE disks that can be used to load into your Cloud-Init-PXE environment. If you want to override the defaults, you can put overrides in user_overrides.yml.  See `user_overrides.yml` for examples. 

Using the overrides file, you can override all of the settings from the defaults/main.yml so that you can easily change the boot mirror URLs when the menus are rendered.  If you prefer to do this after the fact, you can also edit the boot.cfg to make changes, but keep in mind those changes will not be saved when you redeploy the menu.

#### Self Hosted Custom Options

In addition to being able to host Cloud-Init-PXE locally, you can also create your own custom templates for custom menus within Cloud-Init-PXE.  Please see [Custom User Menus](etc/cloudinitpxecom/custom/README.md) for more information.

### What Operating Systems are currently available on Cloud-Init-PXE?

#### Operating Systems

| Name       | URL             | Installer Kernel | Live OS       |
|------------|-----------------|------------------|---------------|
| AlmaLinux | https://almalinux.org/ | Yes | No |
| Alpine Linux | https://alpinelinux.org | Yes | No |
| Arch Linux | https://www.archlinux.org | Yes | No |
| Backbox | https://www.backbox.org | No | Yes |
| BlackArch Linux | https://blackarch.org | Yes | Yes |
| Bluestar Linux | https://sourceforge.net/projects/bluestarlinux | No | Yes |
| Bodhi Linux | https://www.bodhilinux.com | No | Yes |
| CachyOS | https://cachyos.org | No | Yes |
| CentOS | https://centos.org | Yes | No |
| Debian | https://debian.org | Yes | Yes|
| Devuan | https://devuan.org | Yes | No |
| Elementary OS | https://elementary.io | No | Yes |
| EndeavourOS | https://endeavouros.com | No | Yes |
| Fatdog64 | https://distro.ibiblio.org/fatdog/web/ | No | Yes |
| Fedora | https://fedoraproject.org | Yes | Yes |
| Fedora CoreOS | https://getfedora.org/en/coreos?stream=stable | Yes | No |
| Feren OS | https://ferenos.weebly.com/ | Yes | No |
| Flatcar Container Linux | https://www.flatcar.org | Yes | No |
| FreeBSD | https://freebsd.org | Yes, disk image | No |
| FreeDOS | https://www.freedos.org | ISO - Memdisk| No |
| Garuda Linux | https://garudalinux.org/ | No | Yes |
| Gentoo | https://gentoo.org | Yes | Yes |
| Harvester | https://harvesterhci.io | Yes | No |
| hrmpf | https://github.com/leahneukirchen/hrmpf/ | No | Yes |
| IPFire | https://www.ipfire.org | Yes | No |
| K3OS | https://k3os.io/ | Yes | Yes |
| Kairos | https://kairos.io/ | Yes | No |
| Kali Linux | https://www.kali.org | Yes | Yes |
| KDE Neon | https://neon.kde.org | No | Yes |
| Kodachi | https://www.digi77.com/linux-kodachi/ | No | Yes |
| Linux Lite | https://www.linuxliteos.com | No | Yes |
| LXLE | https://lxle.net/ | No | Yes |
| Mageia | https://www.mageia.org | Yes | No |
| Manjaro | https://manjaro.org | No | Yes |
| Mint | https://linuxmint.com | No | Yes |
| Microsoft Windows | https://www.microsoft.com | User supplied media | No |
| MirOS | http://www.mirbsd.org | Yes | No |
| Nitrux | https://nxos.org/ | No | Yes |
| NixOS | https://nixos.org | Yes | No |
| OpenBSD | https://openbsd.org | Yes | No |
| openEuler | https://openeuler.org | Yes | No |
| openSUSE | https://opensuse.org | Yes | No |
| Oracle Linux | https://www.oracle.com/linux/ | Yes | Installer |
| Parrot Security | https://www.parrotsec.org | No | Yes |
| Peppermint | https://peppermintos.com | No | Yes |
| Pop OS |https://system76.com/pop| No | Yes |
| Proxmox Open Source Products | https://www.proxmox.com/ | Yes | No |
| Q4OS | https://q4os.org | No | Yes |
| Raizo | https://sourceforge.net/projects/live-raizo/ | No | Yes |
| Red Hat Enterprise Linux | https://www.redhat.com | User supplied media | No |
| Regolith | https://regolith-linux.org | No | Yes |
| Rocky Linux | https://rockylinux.org/ | Yes | No |
| Septor | https://septor.sourceforge.io | No | Yes |
| Slackware | https://www.slackware.com | Yes | No |
| SmartOS | https://www.smartos.org/ | Yes | No |
| SparkyLinux | https://sparkylinux.org/ | No | Yes |
| Tails | https://tails.net | No | Yes |
| Talos | https://www.talos.dev/ | Yes | No |
| Tiny Core Linux | https://tinycorelinux.net | Yes | Yes |
| Ubuntu | https://www.ubuntu.com | Yes | Yes |
| VMware | https://www.vmware.com | User supplied media | No |
| VMware Photon | https://vmware.github.io/photon/ | Yes | No |
| Vanilla OS | https://vanillaos.org | No | Yes |
| Voyager | https://voyagerlive.org | No | Yes |
| VyOS | https://vyos.io | Yes | No |
| Zen Installer | https://sourceforge.net/projects/revenge-installer | Yes | No |
| Zorin OS | https://zorin.com | No | Yes |

### Utilities

| Name       | URL                     | Type |
|------------|-------------------------|------|
| 4MLinux | https://4mlinux.com/ | Kernel/Initrd |
| Boot Repair CD | https://sourceforge.net/projects/boot-repair-cd/ | LiveCD |
| Breakin | https://www.advancedclustering.com/products/software/breakin/ | Kernel/Initrd |
| CAINE | https://www.caine-live.net/ | LiveCD |
| Clonezilla | https://www.clonezilla.org/ | LiveCD |
| DBAN | https://www.dban.org/ | Kernel |
| GParted | https://gparted.org | LiveCD |
| Grml | https://grml.org | LiveCD |
| Kaspersky Rescue Disk | https://support.kaspersky.com/krd18 | LiveCD |
| Memtest | https://www.memtest.org/ | Kernel |
| MemTest86 Free | https://www.memtest86.com | USB Img |
| Redo Rescue | http://redorescue.com/ | LiveCD |
| Rescatux | https://www.supergrubdisk.org/rescatux/ | LiveCD |
| Rescuezilla | https://rescuezilla.com/ | LiveCD |
| ShredOS | https://github.com/PartialVolume/shredos.x86_64 | Kernel | 
| Super Grub2 Disk | https://www.supergrubdisk.org | ISO - Memdisk |
| System Rescue | https://system-rescue.org/ | LiveCD |
| Ultimate Boot CD | https://www.ultimatebootcd.com | ISO - Memdisk |
| ZFSBootMenu | https://docs.zfsbootmenu.org/ | Kernel |

### Stargazers over time

[![Stargazers over time](https://starchart.cc/cloudinitpxecom/Cloud-Init-PXE.svg)](https://starchart.cc/cloudinitpxecom/Cloud-Init-PXE)

### Feedback

Feel free to open up an [issue](https://github.com/cloudinitpxecom/Cloud-Init-PXE/issues) on Github or ping us on [Discord](https://discord.gg/An6PA2a).  Follow us on [Twitter](https://twitter.com/cloudinitpxecom) and like us on [Facebook](https://www.facebook.com/Cloud-Init-PXE)!
