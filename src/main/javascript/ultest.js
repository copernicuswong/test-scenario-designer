url = "http://127.0.0.1:7777/jolokia";
objectName = "com.ullink.testtools.ultest:name=ShipIt,type=ULTestExternalMBean";

(function() {
    executeScript = function(scriptPath, content, opts) {
        var j4p = new Jolokia(url);
        console.debug(content);
        j4p.execute(objectName, "executeScript", scriptPath, content, {
            success : function(response) {
                onExecuting();
                createExecutionSession(response);
            }
        });
    }
    
    var currentSession;
    
    createExecutionSession = function(response) {
        console.log(response)
        currentSession = response;
    }
    
    getFeed = function() {
        if (currentSession != null) {
            var j4p = new Jolokia(url);
            j4p.execute(objectName, "getOutputFeed", currentSession, {
            success : function(response) {
                display(response);
            }
        });
        }
    }
    
    display = function(response) {
        for (var idx in response) {
            var item = response[idx];
            if (item.status === "InProgress") {
            } else if (item.status === "Complete") {
                onComplete();
            } else if (item.status === "Error") {
                onError();
            }
            document.getElementById('output-box').value += '\n' + item.message;
        }
    }
    
    onExecuting = function() {
        document.getElementById('status-image').src = '../resources/running.png';
    }
    
    onComplete = function() {
        document.getElementById('status-image').src = '../resources/running.png';
        currentSession = null;
    }
    
    onError = function() {
        document.getElementById('status-image').src = '../resources/running.png';
        currentSession = null;
    }
    
    window.setInterval(getFeed, 500);
    
    
}());