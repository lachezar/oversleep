var initStats = function() {
  renderStats();

  $(".icon-html52").on('click', function() {
    var a = scaffoldUserDataStructure();
    addUserDataEntry('20140501', '120', a);
    addUserDataEntry('20140502', '60', a);
    addUserDataEntry('20140503', '90', a);
    addUserDataEntry('20140421', '100', a);
    addUserDataEntry('20140422', '180', a);
    addUserDataEntry('20140411', '120', a);
    addUserDataEntry('20140401', '60', a);
    addUserDataEntry('20140402', '120', a);
    addUserDataEntry('20140301', '60', a);
    addUserDataEntry('20140306', '120', a);
    addUserDataEntry('20130501', '180', a);
    addUserDataEntry('20130502', '60', a);
    addUserDataEntry('20130516', '60', a);
    addUserDataEntry('20120701', '60', a);
    addUserDataEntry('20120711', '120', a);
    addUserDataEntry('20120721', '120', a);
    addUserDataEntry('20120728', '120', a);
  });
};

var renderStats = function() {
  var stats = $(".stats");
  if (stats.length > 0) {
    var userData = getUserData();

    stats.html(getStatsHTML(userData));

    $(".stats > li").bind('click', function(event) {
      var container = $(event.target).closest('.stats > li');
      container.find('ul').slideToggle('fast');
      container.toggleClass('is-expanded');
      event.preventDefault();
    });
  }
};

var fillGapBetweenMonths = function(lastDate, date) {
  var dummyUserData = scaffoldUserDataStructure();
  var result = '';
  while (lastDate.subtract('month', 1) > date) {
    result += getMonthStatsHTML(lastDate, 0, dummyUserData);
  }
  return result;
};

var getStatsHTML = function(userData) {
  var monthlyData = totalOvertimeByMonths(userData);
  var dates = Object.keys(monthlyData);
  dates.sort();
  dates.reverse();

  var lastDate, date, overtime, result = '';
  for (var i = 0; i < dates.length; i++) {
    date = moment(dates[i] + '01', 'YYYYMMDD');

    if (lastDate) {
      result += fillGapBetweenMonths(lastDate, date);
    }

    overtime = monthlyData[dates[i]];
    result += getMonthStatsHTML(date, overtime, userData);
    lastDate = date;
  }

  return result;
};

var getMonthStatsHTML = function(date, overtime, userData) {
  var result = '<li><a href="javascript:void(0)" class="month-group-header"><time datetime="'+date.format('YYYY-MM')+'">'+date.format('YYYY, MMMM')+'</date><span class="monthly-overtime-amount">'+readableTimeDelta(overtime)+'</span></a><ul class="daily-stats">'+getDailyStatsHTML(date.format('YYYYMM'), userData)+'</ul></li>';
  return result;
};

var getDailyStatsHTML = function(yyyymm, userData) {
  var dailyStats = overtimeDaily(yyyymm, userData);

  var result = '';
  for (var i = 0; i < dailyStats.length; i++) {
    var date = moment(dailyStats[i][0], "YYYYMMDD");
    result += '<li><a href="javascript:void(0)"><time datetime="'+date.format('YYYY-MM-DD')+'">'+date.format('MMM Do, ddd')+'</date><span class="daily-overtime-amount">'+readableTimeDelta(dailyStats[i][1])+'</span></a></li>';
  }
  return result;
};

