var showMonthlyOvertime = function(event) { // ui
  var userData = getUserData();
  var months = totalOvertimeByMonths(userData);
  
  var keys = Object.keys(months).sort().reverse();
  var parent = $('body');
  render(templates.monthsListItem, [keys, months], parent);
};

var showDailyOvertime = function(event) { // ui
  var userData = getUserData();
  var yyyymm = event.target.dataset.yyyymm;
  var daily = overtimeByMonth(yyyymm, userData);
  var parent = $('body > div:first');
  
  $.each(daily, function(i, v) {
    render(templates.dailyOvertime, v, parent);
  });
};

var showThisMonthOvertime = function(event) { // ui
  var userData = getUserData();
  var minutes = totalOvertimeThisMonth(new Date, userData);
  
  $('body div:first').text(readableTimeDelta(minutes));
};

var addEntryEvent = function(event) { // ui
  var minutes = ($('.hours').val() || 0) * 60 + ($('.minutes').val() || 0);
  var date = moment($('.date').val());
  
  if (!date.isValid()) {
    throw new Exception('wtf date?');
  }

  var userData = getUserData();
  
  addUserDataEntry(date.format('YYYYMMDD'), minutes, userData);
  toast("Entry added");
};
