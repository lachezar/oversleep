var initApp = function() {

  var ua = navigator.userAgent;
  if (isIOS(ua)) {
    $(".install-instructions").hide();
    $("#iOS.install-instructions").show();
  } else if (isAndroidChrome(ua)) {
    $(".install-instructions").hide();
    $("#android-chrome.install-instructions").show();
  } else if (isAndroid(ua)) {
    $(".install-instructions").hide();
    $("#android.install-instructions").show();
  } else if (isFirefoxOS(ua)) {
    $(".install-instructions").hide();
    showFFInstallInstructions();
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
