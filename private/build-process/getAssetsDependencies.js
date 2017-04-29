// Checking arguments
if (process.argv.length > 3) {
    console.log('Error: Too many arguments passed. Maximum number of arguments is 1. Aborting.')
    process.exitCode = 9;
}

// Dependencies
var fs = require('fs');
var url = require('url');
var http = require('http');

// App variables
var configParam = "pm-assetDependencies";
var configFileName = "package.json";
var configFilePathArg;
var pathDelimiter = process.argv[1][0] === "/" ? "/" : "\\";
var path;
if (process.argv.length === 3) {
    configFilePathArg = process.argv[2];
    if (configFilePathArg[configFilePathArg.length - 1] === pathDelimiter) {
        configFilePathArg.splice(configFilePathArg.length - 1, 1);
    }
    path = configFilePathArg;
    fs.readFile(path + pathDelimiter + configFileName, 'utf8', function (err, data) {
        if (err) {
            fatalError();
            return;
        }
        onSuccess(data);
    });
} 
else {
    // Locating config file in the script's path hierarchy
    console.log("Locating " + configFileName + " in the script's path hierarchy ...");
    var parentFolders = process.argv[1].split(pathDelimiter);
    parentFolders.splice(parentFolders.length - 1, 1);
    path = parentFolders.join(pathDelimiter);
    var pathHierarchy = [];

    fs.readFile(path + pathDelimiter + configFileName, 'utf8', function retrieveConfigFileContent(err, data) {
        if (err ) {
            pathHierarchy.push(path + pathDelimiter);
            // Unix || Windows path-style checking
            if (parentFolders.length === 0 || (parentFolders.length === 1 && parentFolders[0] !== "")) {
                fatalError();
                return;
            }
            parentFolders.splice(parentFolders.length - 1, 1);
            path = parentFolders.join(pathDelimiter);
            fs.readFile(path + pathDelimiter + configFileName, 'utf8', retrieveConfigFileContent);
            return;
        }
        onSuccess(data);
    });
}


function fatalError() {
    console.log("Fatal error at script '" + process.argv[1] + "'.\n" +
                "Error getting '"+ configParam + "' from " + configFileName + ".");
    if (configFilePathArg) {
        console.log("Could not locate " + configFileName + " file in the argument: " + configFilePathArg);
    }
    else {
        console.log("Could not locate " + configFileName + " file in the script's path hierarchy:");
        for (var i = 0; i < pathHierarchy.length; i++) {
            console.log(" " + pathHierarchy[i]);
        }
    }
    if (process.argv.length !== 3) {
        console.log("--Make sure to pass the location of the '" + configFileName + "' target file as " +
                    "an argument if it is not located in the script's path hierarchy.");
    }
    process.exitCode = -1;
}


function onSuccess(data) {
    console.log("Located " + configFileName + " at '" + path + "'.\n");
    // Read asset dependencies list from config file
    console.log("\nDownloading assets (" + configParam + ") found in " + configFileName + ".\n");
    try {
        var devDependencies = JSON.parse(data)[configParam];
        for(var i = 0; i < devDependencies.length; i++) {
            var assetsPath = path + pathDelimiter + devDependencies[i].assetsPath;
            // Create path if doesn't exist
            assetsPath
             .split('/')
             .reduce((path, folder) => {
               path += folder + '/';
               if (!fs.existsSync(path)){
                 fs.mkdirSync(path);
               }
               return path;
             }, '');
            // Download assets to specified path
            for(var j = 0; j < devDependencies[i].assetsURL.length; j++) {
                download_file_httpget(devDependencies[i].assetsURL[j], assetsPath);
            }
        }
    }
    catch (e) {
        console.log("Error at script '" + process.argv[1] + "': " + e.message);
        process.exitCode = -1;
    }
}


// Function to download file using HTTP.get
function download_file_httpget(file_url, dst_path) {
    var options = {
        host: url.parse(file_url).host,
        port: 80,
        path: url.parse(file_url).pathname
    };

    var file_name = url.parse(file_url).pathname.split('/').pop();
    http.get(options, function(res) {
        const statusCode = res.statusCode;

        let error;
        if (statusCode !== 200) {
            error = new Error("Error downloading '" + file_name + "': Request Failed with status code " + statusCode + ".");
        }
        if (error) {
            console.log(error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }


        try {
            var file = fs.createWriteStream(dst_path + file_name);
        } catch (e) {
            console.log('Error:' + e.message);
        }
        console.log("Downloading '" + file_name + "' ...");
        res.on('data', function(data) {
                try {
                    file.write(data);
                } catch (e) {
                    console.log('Error:' + e.message);
                }
            })
            .on('end', function() {
                file.end();
                console.log("Downloaded '" + file_name + "' to '" + dst_path + "'.");
            });
        })
        .on('error', (e) => {
          console.log("Error downloading '" + file_name + "': " + e.message);
        });
}