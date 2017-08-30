var fs = require('fs');
var path = require('path');
var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();

var config = JSON.parse(fs.readFileSync('./.ftp', 'utf8'));

config.localRoot = path.join(__dirname, config.localRoot);

ftpDeploy.deploy(config, function (err) {
    if (err) console.log(err)
    else console.log('finished');
});

ftpDeploy.on('uploading', function (data) {
    console.log(data.transferredFileCount + " of " + data.totalFileCount);
    console.log("Uploading: ", data.filename);
});