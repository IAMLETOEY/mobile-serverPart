var multiparty = require('multiparty'); // npm install multiparty
var _ = require('underscore'); // npm install underscore
var unzip = require('unzip'); // npm install unzip
var find = require('findit'); // npm install findit
var path = require('path');
var fs = require('fs');
var log = console.log;
var exec = require('child_process').exec;


var defaults = {
    uploadDir: __dirname + '/public/files',
    maxFileSize: 1024 * 1024 * 100
};

// create folder if folder is not exists
var mkdir = function(dir) {
        var fullPath = /^win/i.test(process.platform) ? '' : '/';
        var osSep = /^win/i.test(process.platform) ? '\\' : '/';
        var parts = path.normalize(dir).split(osSep);
        var existsSync = fs.existsSync || path.existsSync;
        parts.forEach(function(part) {
            if (part !== '') {
                fullPath = path.normalize(path.join(fullPath, part));
                if (/\.$/.test(fullPath)) {
                    fullPath = fullPath.replace(/\.$/, osSep);
                }
                if (part !== "" && !existsSync(fullPath)) {
                    try {
                        fs.mkdirSync(fullPath);
                    } catch (err) {

                    }
                }
            }
        });
    }
    // read folder return all the files in the folder
var readdir = function(dir, callback) {
    var finder = find(dir);
    var result = {
        path: dir,
        type: 'directory',
        files: {}
    };
    var _dir = dir;
    finder.on('directory', function(dir, stat, stop) {
        var base = path.basename(dir);
        if (dir === _dir) {
            result.stat = stat;
        } else {
            var tmp = result;
            _.chain(dir.replace(_dir, '').split('/')).shift().each(function(name) {
                if (!tmp.files[name]) {
                    tmp.files[name] = {
                        path: dir,
                        type: 'directory',
                        name: name,
                        files: {},
                        stat: stat
                    }
                } else {
                    tmp = tmp.files[name];
                }
            });
        }
        if (base === '.git' || base === 'node_modules') {
            stop();
        }
    });
    finder.on('file', function(dir, stat) {
        var tmp = result;
        _.chain(dir.replace(_dir, '').split('/')).shift().each(function(name) {
            if (!tmp.files[name]) {
                var extension = path.extname(dir).toLowerCase();
                var basename = path.basename(dir, extension).toLowerCase();
                tmp.files[name] = {
                    path: dir,
                    type: 'file',
                    extension: extension,
                    basename: basename,
                    stat: stat
                }
            } else {
                tmp = tmp.files[name];
            }
        });
    });
    finder.on('end', function() {
        callback(result);
    });
    finder.on('error', function(err) {
        log('finder:error >> ' + err);
    });
}

var upload = {
    form: function(settings) {
        var config = _.extend({}, defaults, settings);
        mkdir(config.uploadDir);
        var form = new multiparty.Form(config);
        form.on('error', function(err) {
            log('error >> ' + err);
        });
        return form
    },
    unzip: function(file, callback, deep) {
        var extension = path.extname(file.path).toLowerCase();
        var basename = path.basename(file.path, extension);
        var command = 'unzip ' + file.path + ' -d ./' + basename;
        if (extension == '.zip') {
            var child = exec(command, {
                cwd: __root + '/static/game'
            }, function(error, stdout, stderr) {
                // log('stdout: ' + stdout);
                // log('stderr: ' + stderr);
                if (error !== null) {
                    log('exec error: ' + error);
                }
                readdir(__root + '/static/game/' + basename, function(result) {
                    callback(result, basename);
                });
            });
        } else {
            // 不是zip 不做任何操作
            // readdir(file.path, callback);
        }

        // var extension = path.extname(file.path).toLowerCase();
        // var basename = path.basename(file.path, extension);
        // var unzipDir = path.dirname(file.path) + '/' + basename;
        // if (extension == '.zip') {
        //     mkdir(unzipDir);
        //     fs.createReadStream(file.path).pipe(unzip.Extract({
        //         path : unzipDir
        //     })).on('close', function(){
        //         readdir(unzipDir, function(result){
        //             callback(result, unzipDir);
        //         });
        //     });
        // } else {
        //     // 不是zip 不做任何操作
        //     // readdir(file.path, callback);
        // }
        return this
    },
    filter: function(result, types, callback, deep) {
        var ret = [];
        var search = function(target) {
            _(target.files).each(function(file) {
                if (file.type == 'directory') {
                    _(types).some(function(type) {
                        if (typeof type == 'string' && type.indexOf('.') == -1) {
                            if (type === file.name || type === '*') {
                                ret.push(file);
                                return true
                            }
                        }
                    });
                    if (deep) {
                        search(file);
                    };
                } else if (file.type == 'file') {
                    _(types).some(function(type) {
                        if (typeof type == 'string' && type.indexOf('.') != -1) {
                            var basename = type.split('.')[0];
                            var extension = '.' + type.split('.')[1];
                            if (extension === file.extension) {
                                if (basename === '*' || basename === file.basename) {
                                    ret.push(file);
                                    return true
                                }
                            }
                        } else if (typeof type == 'string' && type === '*') {
                            ret.push(file);
                            return true
                        }
                    });
                };
            });
        };
        search(result);
        callback(ret);
        return this
    },
    remove: function(dir) {
        var remove = function(dir) {
            if (fs.existsSync(dir)) {
                if (fs.statSync(dir).isDirectory()) {
                    var fileList = fs.readdirSync(dir);
                    var base = dir + '/';
                    fileList.forEach(function(file) {
                        var dir = base + '/' + file;
                        remove(dir);
                    });
                    fs.rmdirSync(dir);
                } else {
                    fs.unlinkSync(dir);
                }
            }
        }
        remove(dir);
    },
    readConfig: function(filePath, callback) {
        try {
            var JsonObj = JSON.parse(fs.readFileSync(filePath));
            callback(null, {
                config: JsonObj
            });
        } catch (err) {
            callback(err, null);
        }
    }
}

module.exports = upload;
