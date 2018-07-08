chrome.devtools.panels.create("My Panel",
    "./images/icon.png",
    "./html/panel.html",
    function (panel) {
        // code invoked on panel creation
        console.log(`panel creation: ${JSON.stringify(Array.from(arguments))}`)
    }
);