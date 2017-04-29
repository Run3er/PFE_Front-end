// Checking arguments
if (process.argv.length > 3) {
    console.log('Error: Too many arguments passed. Maximum number of arguments is 1. Aborting.')
    process.exitCode = 9;
}

// Dependencies
var fs = require('fs');

// App variables
var file2UpdateName = "index.js";
var string2Replace = ', new RegExp("</svg>")';
var string2ReplaceWith = '';
var module2Update = "live-server";
var modulesFolderName = "node_modules";
var modulesFolderPathArg;
var pathDelimiter = process.argv[1][0] === "/" ? "/" : "\\";
var path;
if (process.argv.length === 3) {
    modulesFolderPathArg = process.argv[2];
    if (modulesFolderPathArg[modulesFolderPathArg.length - 1] === pathDelimiter) {
        modulesFolderPathArg.splice(modulesFolderPathArg.length - 1, 1);
    }
    path = modulesFolderPathArg;
    if (!fs.existsSync(path + pathDelimiter + modulesFolderName)) {
        fatalError();
        return;
    }
    else {
        console.log("Located " + modulesFolderName + " at '" + path + "'.");
        if (!fs.existsSync(path + pathDelimiter + modulesFolderName + pathDelimiter + module2Update)) {
            fatalError();
            return;
        }
        else {
            onSuccess();
        }
    };
} 
else {
    // Locating modules folder in the script's path hierarchy
    console.log("Locating " + modulesFolderName + " in the script's path hierarchy ...");
    var pathDelimiter = process.argv[1][0] === "/" ? "/" : "\\";
    var parentFolders = process.argv[1].split(pathDelimiter);
    parentFolders.splice(parentFolders.length - 1, 1);
    var path = parentFolders.join(pathDelimiter);
    var pathHierarchy = [];

    while (true) {
        while (!fs.existsSync(path + pathDelimiter + modulesFolderName)) {
            // Unix || Windows path-style checking
            if (parentFolders.length === 0 || (parentFolders.length === 1 && parentFolders[0] !== "")) {
                fatalError();
                return;
            }
            parentFolders.splice(parentFolders.length - 1, 1);
            path = parentFolders.join(pathDelimiter);
            pathHierarchy.push(path + pathDelimiter);
        }
        console.log("Located " + modulesFolderName + " at '" + path + "'.");
        if (!fs.existsSync(path + pathDelimiter + modulesFolderName + pathDelimiter + module2Update)) {
            console.log("Package '" + module2Update + "' not found. Searching further in the hierarchy ...");
            parentFolders.splice(parentFolders.length - 1, 1);
            path = parentFolders.join(pathDelimiter);
            pathHierarchy.push(path + pathDelimiter);
        }
        else {
            onSuccess();
            break;
        }
    }
}


function fatalError() {
    console.log("Fatal error at script '" + process.argv[1] + "'.\n" +
                "Error updating '"+ module2Update + "' package from " + modulesFolderName + ".");
    if (modulesFolderPathArg) {
        console.log("Could not locate " + modulesFolderName + " directory containing '" + module2Update +
            "' package in the argument directory: " + modulesFolderPathArg);
    }
    else {
        console.log("Could not locate " + modulesFolderName + " directory containing '" + module2Update +
            "' package in the script's path hierarchy:");
        for (var i = 0; i < pathHierarchy.length; i++) {
            console.log(" " + pathHierarchy[i]);
        }
    }
    if (process.argv.length !== 3) {
        console.log("--Make sure to pass the location of '" + module2Update + "' package's parent directory [" + modulesFolderName +
                    "] as an argument if it is not located in the script's path hierarchy.");
    }
    process.exitCode = -1;
}


function onSuccess() {
    // console.log("Located " + module2Update + " at '" + path + pathDelimiter + modulesFolderName + "'.\n");

    // Remove expression from execution program package's file
    var file2Update = path + pathDelimiter + modulesFolderName + pathDelimiter + module2Update + pathDelimiter + file2UpdateName;
    fs.readFile(file2Update, 'utf8',
        function (err, data) {
        if (err) {
            console.log("\nImpossible to access '" + file2UpdateName + "' file.");
            console.log("Error at script '" + process.argv[1] + "': " + err.message);
            process.exitCode = -1;
            return;
        }

        console.log("\nUpdating '" + file2UpdateName + "' ...");
        var updatedFileContents = data.replace(string2Replace, string2ReplaceWith);

        fs.writeFile(file2Update, updatedFileContents, 'utf8', function (err) {
            if (err) {
                console.log("\nImpossible to rewrite '" + file2UpdateName + "' file.");
                console.log("Error at script '" + process.argv[1] + "': " + err.message);
                process.exitCode = -1;
                return;
            }
        });
        console.log("Updated '" + file2UpdateName + "' successfully.");
    });
}