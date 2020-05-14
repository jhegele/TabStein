const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const package = require('../package.json');

const archive = archiver('zip', {
    zlib: { level: 9 }
})

const osxAppPath = path.join(__dirname, '../testing/osx/TabPy Tools-darwin-x64/TabPy Tools.app');
const osxZipPath = path.join(__dirname, `../releases/osx/TabPyTools-v${package.version}.zip`);

const osxOutputFile = fs.createWriteStream(osxZipPath);

osxOutputFile.on('close', () => {
    console.log(archive.pointer() + ' bytes written!');
})

osxOutputFile.on('end', () => {
    console.log('Data has been drained');
})

archive.on('warning', err => {
    if (err.code === 'ENOENT') {
        console.log('WARNING');
        console.log(err);
    } else {
        throw err;
    }
});

archive.on('error', err => {
    throw err;
})

archive.pipe(osxOutputFile);

archive.directory(osxAppPath, 'TabPy Tools.app');
archive.finalize();