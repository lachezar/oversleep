var initStats = function() {
  renderStats();
};

var renderStats = function() {
  var stats = $(".stats");
  if (stats.length > 0) {
    var userData = getUserData();

    if (Object.keys(userData.entries).length === 0) {
      // fresh start
      stats.html('<li><a href="/">Press the "Add" tab to add your first entry.</a></li>');
    } else {

      stats.html(getStatsHTML(userData));

      $(".stats > li").bind('click', function(event) {
        var container = $(event.target).closest('.stats > li');
        container.find('ul').slideToggle('fast');
        container.toggleClass('is-expanded');
        event.preventDefault();
      });
    }
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

