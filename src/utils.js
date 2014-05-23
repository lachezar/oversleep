var isIOS = function(ua) {
  return /iPhone|iPad/i.test(ua);
};

var isAndroid = function(ua) {
  return /Android/i.test(ua);
};

var isFirefoxOS = function(ua) {
  return !!navigator.mozApps;
};
