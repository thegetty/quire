mkdir -p /tmp

# Install Prince
wget -q -O /tmp/prince.deb https://www.princexml.com/download/prince_12.5-1_ubuntu14.04_amd64.deb
dpkg -i /tmp/prince.deb
rm /tmp/prince.deb
prince --version

# Install Pandoc
wget -q -O /tmp/pandoc.deb https://github.com/jgm/pandoc/releases/download/2.7.3/pandoc-2.7.3-1-amd64.deb
dpkg -i /tmp/pandoc.deb
rm /tmp/pandoc.deb
pandoc --version