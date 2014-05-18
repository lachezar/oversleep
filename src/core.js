// uglifyjs app.js ui.js  -e jQuery,moment,simpleStorage,false:$,moment,simpleStorage,isTestMode -c -m

var USER_DATA_KEY = "overtime_data";

var exportUserData = function() {
};

var importUserData = function(userData) {
};

var sanitizeUserData = function(userData) {
  var sanitizedUserData = scaffoldUserDataStructure();
  $.each(userData.entries, function(k, v) {
    var key = k + "";
    var value = parseInt(v, 10);
    if (!isEntryValid(key, value)) {
      handleSanitizationError(k, v);
      return; //continue;
    }
    
    sanitizedUserData.entries[key] = value; 
  });
  
  return sanitizedUserData;
};

var isEntryValid = function(yyyymmdd, minutes) {
  if (!moment(yyyymmdd, "YYYYMMDD").isValid()) {
    return false;
  }
  if (minutes <= 0 || minutes > 24*60) {
    return false;
  }
  return true;
};

var getUserData = function() {
  if (!simpleStorage.canUse()) {
    handleNoStorage();
    return null;
  }
  
  var userData = simpleStorage.get(USER_DATA_KEY);
  
  if (userData === void 0) {
    userData = scaffoldUserDataStructure();
  }
  
  var sanitizedUserData = sanitizeUserData(userData);
  return sanitizedUserData;
  //return data or throws exception
};

var updateUserData = function(sanitizedUserData) {
  if (!simpleStorage.canUse()) {
    handleNoStorage();
    return;
  }
  
  var operationResult = simpleStorage.set(USER_DATA_KEY, sanitizedUserData);
  if (operationResult !== true) {
    handleSavingError();
    return;
  }

  handleSuccessfulUpdate();
};

var addUserDataEntry = function(yyyymmdd, minutes, userData) {
  yyyymmdd += "";
  minutes = parseInt(minutes, 10);
  if (!isEntryValid(yyyymmdd, minutes)) {
    throw new Error("New entries must have a date index in format YYYYMMDD and minutes within 1 and 24*60");
  }
  
  userData.entries[yyyymmdd] = minutes;
  updateUserData(userData);
};

var handleNoStorage = function() {
  showError('No local storage available. Are you running in private mode?');
};

var handleSavingError = function() {
  showError('Could not save the new entry. Are you running in private mode?');
};

var handleSanitizationError = function(k, v) {
  // log this somehow for postmortem analysis
};

var handleSuccessfulUpdate = function() {
  showMessage("Saved!");
};

var scaffoldUserDataStructure = function() {
  return {entries: {}};
};

var totalOvertimeByMonths = function(userData) {
  var months = {};
  $.each(userData.entries, function(k, v) {
    var index = k.substring(0, 6);
    months[index] = (months[index] || 0) + v; 
  });
  return months;
};

var totalOvertimeThisMonth = function(date, userData) {
  var thisMonth = moment(date).format('YYYYMM');
  var minutes = totalOvertimeByMonths(userData)[thisMonth] || 0;
  return minutes;
};

var overtimeDaily = function(yyyymm, userData) {
  var results = [];
  $.each(userData.entries, function(k, v) {
    if (k.substring(0, 6) == yyyymm) {
      results.push([k, v]);
    }
  });
  
  results.sort(function(a, b) { 
    return a[0].localeCompare(b[0]);
  });
  
  return results;
};

var readableTimeDelta = function(minutes) {
  if (minutes % 60 === 0) {
    return parseInt(minutes / 60) + " hours";
  }
  
  return parseInt(minutes / 60) + " hours, " + (minutes % 60) + " minutes";
};

var showError = function() {};
var showMessage = function() {};

// sync user data with server
// load user data from server
// create user identifier ... or login credentials... or something
