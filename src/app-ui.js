var initApp = function() {
  $(".install-instructions").hide();

  var ua = navigator.userAgent;
  if (isWebView()) {
    // hide all instructions
  } else if (isIOS(ua)) {
    $("#iOS.install-instructions").show();
  } else if (isAndroidChrome(ua)) {
    $("#android-chrome.install-instructions").show();
  } else if (isAndroid(ua)) {
    $("#android.install-instructions").show();
  } else if (isFirefoxOS(ua)) {
    showFFInstallInstructions();
  } else {
    $("#default.install-instructions").show();
  }

  window.history.replaceState(null, "Overtime", "/");
};

var showFFInstallInstructions = function() {
  var request = navigator.mozApps.getSelf();
  request.onsuccess = function () {
    if (request.result === null) {
      $("#firefox-os.install-instructions").show();
      $(".firefox-os-install").on('click', function(event) {
        var installRequest = navigator.mozApps.install(window.location.origin + "/manifest.webapp");
        installRequest.onsuccess = function(data) {
            $("#firefox-os.install-instructions").hide();
        };
        installRequest.onerror = function() {
            alert("Install failed:\n\n" + installRequest.error.name);
        };
      });
    }
  };
};
