mkdir -p /tmp

# Install Prince
curl https://www.princexml.com/download/prince-14.1-macos.zip -o /tmp/prince.zip
cd /tmp && unzip prince.zip
echo "/usr/local" | prince-14.1-macos/install.sh
rm prince.zip
prince --version

# Install Pandoc
curl https://github.com/jgm/pandoc/releases/download/2.13/pandoc-2.13-macOS.pkg -o /tmp/pandoc.pkg -L
sudo installer -pkg /tmp/pandoc.pkg -target /usr/local/bin
rm /tmp/pandoc.pkg
pandoc --version

# Install Kindle Previewer
curl https://s3.amazonaws.com/kindlepreviewer3/KindlePreviewerInstaller.pkg -o /tmp/kindle-previewer.pkg
sudo installer -pkg /tmp/kindle-previewer.pkg -target /usr/local/bin
rm /tmp/kindle-previewer.pkg
kindlepreviewer --help