#! /bin/bash
sudo su

apt-get update 

apt-get upgrade -y

wget https://get.glennr.nl/unifi/install/install_latest/unifi-latest.sh && bash unifi-latest.sh