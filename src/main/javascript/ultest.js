url = "http://127.0.0.1:7777/jolokia";
objectName = "com.ullink.testtools.ultest:name=ShipIt,type=ULTestExternalMBean";

(function() {
    executeScript = function(scriptPath, content, opts) {
        var j4p = new Jolokia(url);
        j4p.execute(objectName, "executeScript", scriptPath, content, opts);
    }
}());