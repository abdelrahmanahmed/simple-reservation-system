// datepicker to make calendars language specific.

function deCalendar() {
  $.datepicker.regional['de'] = {
    clearText: 'ausl&ouml;schen',
    clearStatus: '',
    closeText: 'Schlie&szlig;en',
    closeStatus: 'Schlie&szlig;en ohne &Auml;nderung',
    prevText: '<Zur&uuml;ck',
    prevStatus: 'Vorheriger Monat',
    nextText: 'N&auml;chster>',
    nextStatus: 'Sehen Sie N&auml;chster Monat',
    currentText: 'Heute',
    currentStatus: 'Zeige aktuellen Monat',
    monthNames: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthNamesShort: ['Jan', 'Feb', 'M&auml;r', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    monthStatus: 'Siehe einen weiteren Monat',
    yearStatus: 'Siehe ein weiteres Jahr',
    weekHeader: 'KW',
    weekStatus: '',
    dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    dayStatus: 'Verwenden DD als erster Tag der Woche',
    dateStatus: 'Choose DD, MM d',
    dateFormat: 'yy-mm-dd',
    firstDay: 0,
    initStatus: 'W&auml;hlen Sie das Datum',
    isRTL: false
  };
  $.datepicker.setDefaults($.datepicker.regional['de']);
}

function nlCalendar(){
  $.datepicker.regional['nl'] = {
    clearText: 'uitwissen',
    clearStatus: '',
    closeText: 'Sluiten',
    closeStatus: 'Sluiten zonder wijziging',
    prevText: '<Terug',
    prevStatus: 'Vorige maand',
    nextText: 'Volgende>',
    nextStatus: 'Zie volgende maand',
    currentText: 'Vandaag',
    currentStatus: 'Bekijk maand',
    monthNames: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    monthStatus: 'Bekijk een andere maand',
    yearStatus: 'Zie nog een jaar',
    weekHeader: 'KW',
    weekStatus: '',
    dayNames: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
    dayNamesShort: ['Zon', 'Maa', 'Din', 'Woe', 'Don', 'Vri', 'Zat'],
    dayNamesMin: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
    dayStatus: 'Gebruik DD als de eerste dag van de week',
    dateStatus: 'Kies DD , MM d',
    dateFormat: 'dd-mm-yy',
    firstDay: 0,
    initStatus: 'Kies de datum',
    isRTL: false
  };
    $.datepicker.setDefaults($.datepicker.regional['nl']);
}

function enCalendar() {
  $.datepicker.regional['en'] = {
    closeText: 'Done',
    prevText: 'Prev',
    nextText: 'Next',
    currentText: 'Today',
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    weekHeader: 'Wk',
    dateFormat: 'mm/dd/yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
  };
  $.datepicker.setDefaults($.datepicker.regional['en']);
}

function validateFromDate(avlFromDate, avlToDate) {
  const dateRegex = /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g;
  const fromdate = new Date(avlFromDate.split('/').reverse().join('-'));
  const toDate = avlToDate ? new Date(avlToDate.split('/').reverse().join('-')) : null;
  if (dateRegex.test(avlFromDate) && fromdate <= new Date()) {
    if (!toDate || fromdate <= toDate) {
      return true;
    }
  }
  return false;
}

$(function () {
  $('#Rep_date,#Rep_date_1').datepicker({
    dateFormat: 'dd/mm/yy',
    maxDate: new Date(),
  });

  $('#avl-from').datepicker({
    dateFormat: 'dd/mm/yy',
    maxDate: new Date(),
    onClose: function (selectedDate) {
      if (validateFromDate(selectedDate, $('#avl-to').val())) {
        $('#avl-to').datepicker('option', 'minDate', selectedDate);
      }
    },
  });

  $('#avl-to').datepicker({
    dateFormat: 'dd/mm/yy',
    maxDate: new Date(),
  });

  $('#util-from').datepicker({
    dateFormat: 'dd/mm/yy',
    maxDate: new Date(),
    onClose: function (selectedDate) {
      if (validateFromDate(selectedDate, $('#util-to').val())) {
        $('#util-to').datepicker('option', 'minDate', selectedDate);
      }
    },
  });

  $('#util-to').datepicker({
    dateFormat: 'dd/mm/yy',
    maxDate: new Date(),
  });

  $('#rdy-from').datepicker({
    dateFormat: 'dd/mm/yy',
    maxDate: new Date(),
    onClose: function (selectedDate) {
      if (validateFromDate(selectedDate, $('#rdy-to').val())) {
        $('#rdy-to').datepicker('option', 'minDate', selectedDate);
      }
    },
  });

  $('#rdy-to').datepicker({
    dateFormat: 'dd/mm/yy',
    maxDate: new Date(),
  });

  $('#profile-from').datepicker({
    dateFormat: 'dd/mm/yy',
    maxDate: new Date(),
    onClose: function (selectedDate) {
      if (validateFromDate(selectedDate, $('#profile-to').val())) {
        $('#profile-to').datepicker('option', 'minDate', selectedDate);
      }
    },
  });

  $('#profile-to').datepicker({
    dateFormat: 'dd/mm/yy',
    maxDate: new Date(),
  });
});