$(function() {

  $(".activate-custom-overtime-amount").on('click', function(event) {
    $(".default-overtime-amount").hide('fast');
    $(".custom-overtime-amount").show('fast');
  });

  $(".activate-custom-overtime-date").on('click', function(event) {
    $(".default-overtime-date").hide('fast');
    $(".custom-overtime-date").show('fast');
  });

  $("[name=overtime_hours], [name=overtime_minutes]").on('change', function(event) {
    var amount = parseInt(event.target.value, 10) || 0;
    var total = 0;
    if (/_minutes$/.test(event.target.name)) {
      total = amount + parseInt($("[name=overtime_hours]").val() || 0, 10) * 60;
    } else if (/_hours$/.test(event.target.name)) {
      total = amount * 60 + parseInt($("[name=overtime_mimnutes]").val() || 0, 10);
    }

    if (total > 0) {
      updateOvertimeStatementTime(total);
    } else {
      updateOvertimeStatementTime('');
    }
  });

  $(".time-amount").on('click', function(event) {
    var amount = (parseInt(event.target.dataset.amount) || 0) * 60;
    updateOvertimeStatementTime(amount);
  });

  $("[name=overtime_date]").on('change', function(event) {
    var date = moment(event.target.value);
    updateOvertimeStatementDate(date);
  });

  $(".today").on('click', function(event) {
    var date = moment();
    updateOvertimeStatementDate(date);
  });

  $(".yesterday").on('click', function(event) {
    var date = moment().subtract('day', 1);
    updateOvertimeStatementDate(date);
  });

  $(".save").on('click', function(event) {
    var date = moment($(".current-date").data('date'));
    var minutes = parseInt($(".current-time").data('amount'), 10) || 0;

    if (date.isValid() && minutes > 0) {
      var userData = getUserData();
  
      addUserDataEntry(date.format('YYYYMMDD'), minutes, userData);

      $(".reset").trigger('click');

    } else {
      // what?
    }

  });

  $(".reset").on('click', function(event) {
    setCurrentTime('', 0);
    setCurrentDate('', '');
    toggleStatementDelimiter();
    $('input').val('');

    $(".default-overtime-amount").show('fast');
    $(".custom-overtime-amount").hide('fast');

    $(".default-overtime-date").show('fast');
    $(".custom-overtime-date").hide('fast');
  });

});

// the tabs should be on the bottom of the screen
$(window).on("load", function() {     
  var $footer = $(".button-group");
  var footerHeight = $footer.height();
  var footerTop = ($(window).scrollTop() + $(window).height() - footerHeight) + "px";

  if (($("#content").height()+footerHeight) < $(window).height()) {
    $footer.css({
      "margin-top": $(window).height() - ($("#content").height() + footerHeight) - 10
    });
  }
});

var setCurrentTime = function(text, amount) {
  $(".current-time").text(text);
  $(".current-time").data('amount', amount);
};

var setCurrentDate = function(text, date) {
  $(".current-date").text(text);
  $(".current-date").data('date', date);
};

var updateOvertimeStatementTime = function(total) {
  // put hours and minutes in a div
  if (total > 0) {
    var hours = parseInt(total / 60);
    var minutes = total % 60;
    if (hours === 1 && minutes === 0) {
      setCurrentTime(hours + ' hour', total);
    } else if (hours > 1 && minutes === 0) {
      setCurrentTime(hours + ' hours', total);
    } else if (minutes > 0) {
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      setCurrentTime(hours + ':' + minutes + ' hours', total);
    }
  } else {
    setCurrentTime('', 0);
  }

  toggleStatementDelimiter();
};

var updateOvertimeStatementDate = function(date) {
  // put date representation in a div
  if (!date.isValid()) {
    setCurrentDate('', '');
  } else {

    var now = moment();
    var diff = now.diff(date, 'days');
    var dateString = date.format("YYYY-MM-DD");
    if (diff === 0) {
      // today
      setCurrentDate('Today', dateString);
    } else if (diff === 1) {
      // yesterday
      setCurrentDate('Yesterday', dateString);
    } else {
      setCurrentDate(dateString, dateString);
    }
  }
  toggleStatementDelimiter();
};

var toggleStatementDelimiter = function() {
  if ($(".current-time").text() === '' || $(".current-date").text() === '') {
    $(".current-statement-delim").text('');
  } else {
    $(".current-statement-delim").text(', ');
  }
};

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
  var parent = $('body > div:first2');
  
  $.each(daily, function(i, v) {
    render(templates.dailyOvertime, v, parent);
  });
};

var showThisMonthOvertime = function(event) { // ui
  var userData = getUserData();
  var minutes = totalOvertimeThisMonth(new Date(), userData);
  
  $('body div:first').text(readableTimeDelta(minutes));
};

var showMessage = function(text) {
  $(".message-text").text(text);
  $(".message").fadeIn('fast').delay(3000).fadeOut('fast');
};

var showError = function(text) {
  $(".error > .message-text").text(text);
  $(".error").fadeIn('fast').delay(5000).fadeOut('fast');
};

