# SSHmulti
[![GitHub license](https://img.shields.io/github/license/nasiruddinml/sshmulti)](https://github.com/nasiruddinml/sshmulti/blob/master/LICENSE) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=nasiruddinml_sshmulti&metric=coverage)](https://sonarcloud.io/summary/new_code?id=nasiruddinml_sshmulti)

Manage multiple ssh accounts.

SSHmulti
==========

SSHmulti is a node version of ruby gem [SSHwitch](https://github.com/agush22/sshwitch) that lets you manage different sets of keys in Unix-like systems.
The purpose of this is to enable using diferent sets of keys for services such as Github, Heroku, Bitbucket, or any other that requires SSH auth.

Install
-------

    npm install -g sshmulti

Usage
-----

### Backup


Supposing you already have a "work" key pair in your home dir.
First do a backup of it:

    sshmulti -b work

This will create a copy of the current key pair (the one in ~/.ssh/) in a new dir:  ~/.ssh/work

### New


To create a new RSA key pair (you need to have ssh-keygen installed) run:

    sshmulti -n personal

This will create a new key pair in ~/.ssh/personal

### Switch


Make personal the current key pair:

    sshmulti personal

Change back to work key pair

    sshmulti work

### Rename

Change the work key pair to job (both params together separated by comma):

    sshmulti -r work,job

This will move (rename) the folder ~/.ssh/work to ~/.ssh/job

### List

List the name of available key pairs

    sshmulti -l

### Current

Display the name of the active key pair

    sshmulti -c
or

    sshmulti

### Delete

Delete the key pair in ~/.ssh/job

    sshmulti -d job

If that key was currently active, it will stay that way until you switch it out again


To Do
-----

* ~~Tests :(~~ Done :)
