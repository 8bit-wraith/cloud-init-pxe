# Custom Menus for Self Hosted cloud-init-pxe.com

This directory contains custom iPXE files that are rendered
during menu generation and available from the main menu via
the custom menu option.

When these options are set:

```
custom_generate_menus: true
custom_templates_dir: "{{ cloudinitpxecom_conf_dir }}/custom"
```

the menu will add an option for custom menus and attempt to load into
custom/custom.ipxe.  From there custom options can be built and
maintained seperately from the cloud-init-pxe.com source tree so that both
menus can be updated independently.

A sample menu is provided to demonstrate how to configure and set up
a menu.  You can copy the custom directory from the repo:

```
cp -r etc/cloudinitpxecom/custom /etc/cloudinitpxecom/custom
```

If you are building via Docker, you can create a `custom` folder in
the root source directory and then set the variable like so:

```
custom_generate_menus: true
custom_templates_dir: "/ansible/custom"
```
