export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y
add-apt-repository -y ppa:ubuntugis/ppa
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
add-apt-repository -y "deb https://dl.yarnpkg.com/debian/ stable main"
apt-get install -y \
build-essential \
curl \
default-jre-headless \
gdal-bin \
git \
language-pack-en-base \
libffi-dev \
libgdal-dev \
libmagic1 \
libpq-dev \
libqt5core5a \
libsqlite3-mod-spatialite \
libspatialite7 \
libspatialite-dev \
libproxy1v5 \
libxslt1-dev \
nodejs \
osmctools \
postgresql-client \
postgis \
python3-dev \
python3-pip \
python3-setuptools \
python3-wheel \
python3-gdal \
spatialite-bin \
unzip \
yarn \
zip \
nginx \
qt5-default \
postgresql-10-postgis-2.4 \
redis-server \
certbot \
python3-certbot-nginx \
osmium-tool \
awscli \
libspatialindex-dev

pip3 install virtualenv

# Ubuntu 18.04 fix. see https://github.com/valhalla/valhalla/issues/1437
ln -s /usr/lib/x86_64-linux-gnu/mod_spatialite.so /usr/lib/x86_64-linux-gnu/mod_spatialite

wget https://hotosm-export-tool.s3.amazonaws.com/mkgmap-r3890.zip
unzip mkgmap-r3890.zip -d /usr/local
mv /usr/local/mkgmap-r3890 /usr/local/mkgmap
rm mkgmap-r3890.zip

wget https://hotosm-export-tool.s3.amazonaws.com/splitter-r583.zip
unzip splitter-r583.zip -d /usr/local
mv /usr/local/splitter-r583 /usr/local/splitter
rm splitter-r583.zip

wget https://hotosm-export-tool.s3.amazonaws.com/OsmAndMapCreator-main.zip
mkdir /usr/local/OsmAndMapCreator
unzip OsmAndMapCreator-main.zip -d /usr/local/OsmAndMapCreator
rm OsmAndMapCreator-main.zip

wget https://hotosm-export-tool.s3.amazonaws.com/omim-2017.tgz
tar -xzf omim-2017.tgz
mv omim/generate_mwm.sh /usr/local/bin/
mv omim/generator_tool /usr/local/bin/
mv omim/data /usr/
chmod 777 /usr/data/
rm -r omim
rm omim-2017.tgz

# Create a db called 'exports' owned by the exports user.
adduser --disabled-password --gecos "" exports
su - postgres -c 'createuser exports'
su - postgres -c 'psql postgres -c "create database exports;"'
su - postgres -c 'psql postgres -c "alter database exports owner to exports;"'
su - postgres -c 'psql exports -c "create extension postgis;"'
su - postgres -c 'psql exports -c "create extension hstore;"'

mv /tmp/nginx.conf /etc/nginx/nginx.conf
mv /tmp/django.service /etc/systemd/system/django.service
mv /tmp/worker-ondemand.service /etc/systemd/system/worker-ondemand.service
mv /tmp/worker-scheduled.service /etc/systemd/system/worker-scheduled.service

yarn global add tl @mapbox/mbtiles @mapbox/tilelive @mapbox/tilejson tilelive-http --prefix /usr/local/