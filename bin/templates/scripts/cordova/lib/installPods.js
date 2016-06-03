var fs = require('fs');
var util = require('util');
var superspawn = require('cordova-common').superspawn;


/*
To do: 

-- Error handling 
    - capturing errors from pod install 
    - adding a pod that already exists in Podfile 
    - removing a pod that isn't in the Podfile 
    - no podName specified in module function invoking 
    - 


-- After pods are installed in a .xcworkspace, all existing ios code needs to go into the WORKSPACE file -- will need to 
    create a workspace file and then embed the Xcode project  
        - Holly might have done some work on this, see the docs: 
          https://github.com/phonegap/phonegap-webview-ios not sure how applicable it can be to our case


Cases to handle: 

-- Podfile does not exist || Podfile exists but has nothing in it yet (w)
-- Podfile exists and has pods in it 
    -- adding Pods in addition to existing Pods (rw)
    -- removing Pods from Podfile (cordova plugin rm ...)
    -- if a Cocoapod exists in the Podfile but is not the spec(version) specified 
    -- 

*/

function readPodfile (Podfile) {
        var podfileContents = fs.readFileSync(Podfile, 'utf8');
        console.log(podfileContents);
}


function installPodsSync (projectName, pathToProjectFile, nameOfPod, podSpec) {
    // called from cordova project directory-- when invoked, args are as follows
    //  projectName         = cordovaProject (name) and 
    //  pathToProjectFile   = ./path/to/cordovaProject 
    //  nameOfPod           = obj.src  //from framework tag
    //  podSpec             = obj.spec  //from framework tag   

    
    // readFileSync will currently truncate the Podfile if it exists
    // if a Podfile doesn't exist, one will be created
   
   
    // this code will be run during cordova plugin add x -- which has to be run in the cordova project 
  
    //-----------
    //ERRORS 
    //
    //if no podName is specified, console err 
    //-----------
    
    
    pathToProjectFile = pathToProjectFile + ".xcodeproj"; //path/to/project.xcodeproj
    podSpec = podSpec || ''; //spec is optional
    
    var stringToWrite;
    
    //check for nameOfPod in pods.json 
    
    //if the pod is in the json file, 
    
        //check if the spec was specified for a change
        
        // if not, then do nothing to the Podfile and return an err-- pod already installed
    
    //if the pod is not in the json file, 
    
        // read what is currently in the Podfile and inject the pod '</pod>' line, shift the rest of the pod lines 
    
    
    //adapt this to the code written above
    //minimum deployment target is iOS 8.0 for cordova 
    if (podSpec == '') {
        stringToWrite = util.format("platform :ios, '8.0'\n\ntarget '%s' do\n\n  project '%s'\n\n  pod '%s' \n\nend", projectName, pathToProjectFile, nameOfPod);
    } else {
        stringToWrite = util.format("platform :ios, '8.0'\n\ntarget '%s' do\n\n  project '%s'\n\n  pod '%s', '%s' \n\nend", projectName, pathToProjectFile, nameOfPod, podSpec);
    }
   
     
    fs.writeFileSync('Podfile', stringToWrite);
    
    readPodfile('Podfile'); //this should not be here.. reading should happen before writing-- this is for testing 
    
    
    
    // once all is good in the Podfile, cocoapods will handle the installation 
    superspawn.spawn('pod', ['install'], {});
    
    //-----------
    //ERRORS 
    //
    // if pod install fails, console err 
    //-----------
    
    //and after this completes, perhaps emit a verbose log or a console log -- Pods installed in Xcode workspace 
}

function uninstallPod (pod) {
    //remove from pods.json 
    //remove from Podfile
    
}

function uninstallAllPods () {
    superspawn.spawn('pod', ['deintegrate'], {});
}


module.exports = {
    installPodsSync     : installPodsSync
};