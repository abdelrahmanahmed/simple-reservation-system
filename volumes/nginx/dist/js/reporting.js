$(document).ready(function () {
  if (sessionStorage.getItem('reporting_section') === 'reserveReport') {
    $('#util-profile').css('display', 'block');
    if (sessionStorage.role.indexOf(sessionStorage.groupAdminRole) > -1) {
      $('.gr-admin-col').show();
      $('.gr-admin-next').removeClass('rep-col-2').addClass('rep-col-3');
    }
    getUtilizedFilterDropDown();
  } else if (sessionStorage.getItem('reporting_section') === 'availableReport') {
    $('#avl-profile').css('display', 'block');
    if (sessionStorage.role.indexOf(sessionStorage.groupAdminRole) > -1) {
      $('.gr-admin-col').show();
      $('.gr-admin-next-avl').addClass('rep-col-2');
    }
    getAvailableFilterDropDown();
  } else if (sessionStorage.getItem('reporting_section') === 'unconfirmedReport') {
    $('#rdy-profile').css('display', 'block');
    getReadyFilterDropDown();
  } else if (sessionStorage.getItem('reporting_section') === 'profileDownloadReport') {
    $('#profile-dwn').css('display', 'block');
    getStatusFilterDropDown();
  }
});

/*
 * Code to export report data as an XML file
 *
 */
$('#util-download-xml').click(function () {
  const fileName = 'Reserved_ESIM_Profile_Report';
  generateXmlFile(fileName, 'util_table');
});

$('#avl-download-xml').click(function () {
  const fileName = 'Available_ESIM_Profile_Report';
  generateXmlFile(fileName, 'avl_table');
});

$('#rdy-download-xml').click(function () {
  const fileName = 'Unconfirmed_ESIM_Profile_Report';
  generateXmlFile(fileName, 'rdy_table');
});

$('#profile-download-xml').click(function () {
  const fileName = 'ESIM_Profile_Download_Status_Report';
  generateXmlFile(fileName, 'profile_table');
});

/*
 * Function to generate XML file
 * @params File name
 * @params table id
 */
function generateXmlFile(fileName, tableId) {
  var header = [];
  $("#" + tableId + " thead tr th").each(function () {
    header.push($(this).text().trim().replace('&', '').replace(/ /g, ''));
  });
  var tableToXML = '<?xml version="1.0" encoding="utf-8"?>';
  tableToXML += '<' + fileName + '>';
  $("#" + tableId + " tbody tr").each(function () {
    var cells = $("td", this);
    if (cells.length > 0) {
      tableToXML += '<Data>';
      for (var i = 0; i < header.length; i += 1) {
        tableToXML += '<' + header[i] + '>' + cells.eq(i).text() + '</' + header[i] + '>';
      }
      tableToXML += '</Data>';
    }
  });
  tableToXML += '</' + fileName + '>';
  var operator = sessionStorage.operatorName;
  var fileName = fileName + '_' + new Date().getTime() + '.xml';
  var browserAgent = window.navigator.userAgent;
  var Idx = browserAgent.indexOf('MSIE'); // Check if the browser is IE
  if (Idx > 0 || navigator.userAgent.match(/Trident\/7\./)) {
    blobObject = new Blob([tableToXML]);
    window.navigator.msSaveOrOpenBlob(blobObject, fileName);
  } else {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURI(tableToXML));
    element.setAttribute('download', fileName);
    document.body.appendChild(element); // for firefox browser
    element.click();
    document.body.removeChild(element); // for firefox browser
  }
}

/*
 * Code to export report data as an CSV file
 *
 */

$('#util-download-csv').click(function () {
  $('#util_table').tableToCSV('Reserved_ESIM_Profile_Report');
});
$('#avl-download-csv').click(function () {
  $('#avl_table').tableToCSV('Available_ESIM_Profile_Report');
});
$('#rdy-download-csv').click(function () {
  $('#rdy_table').tableToCSV('Unconfirmed_ESIM_Profile_Download_Report');
});
$('#profile-download-csv').click(function () {
  $('#profile_table').tableToCSV('ESIM_Profile_Download_Status_Report');
});

function enableShowButton(showButtonId) {
  $('#' + showButtonId).removeAttr('disabled');
  $('#' + showButtonId).removeClass('btn_disabled');
}

function disableShowButton(showButtonId) {
  $('#' + showButtonId).attr('disabled', 'disabled');
  $('#' + showButtonId).addClass('btn_disabled');
}

function validateInputDate(inputDate) {
  const dateRegexPattern = new RegExp(sessionStorage.dateRegex);
  if (inputDate) {
    if (dateRegexPattern.test(inputDate)) {
      $('#err-title').removeAttr('data-i18n', 'errorTranslation.invaildDate');
      $('.errorAlert').css('display', 'none');
      return true;
    }
    $('#err-title').attr('data-i18n', 'errorTranslation.invaildDate');
    $('.errorAlert').css('display', 'block');
    return false;
  }
  return false;
}

function displayErrorMessage(reportId, errorMessage) {
  $('.' + reportId).css('display', 'none');
  $('#err-title').attr('data-i18n', 'errorTranslation.' + errorMessage);
  $('.errorAlert').css('display', 'block');
  $('#no-records').css('display', 'none');
	errori18();
}

function checkForFutureDate(avlFromDate, avlToDate, reportId, showButtonId) {
  const currentDate = new Date();
  const fromDate = new Date(avlFromDate.split('/').reverse().join('-'));
  const toDate = new Date(avlToDate.split('/').reverse().join('-'));
  const noOfDays = Math.round(Math.abs((fromDate.getTime() - toDate.getTime()) / (24 * 60 * 60 * 1000)));
  if (fromDate > currentDate || toDate > currentDate) {
    displayErrorMessage(reportId, 'no_future_date');
    disableShowButton(showButtonId);
  } else if (fromDate > toDate) {
    displayErrorMessage(reportId, 'greater_date');
    disableShowButton(showButtonId);
  } else if ((noOfDays + 1) > 180) {
    displayErrorMessage(reportId, 'date_range');
    disableShowButton(showButtonId);
  } else {
    enableShowButton(showButtonId);
  }
}

function validateNeighbourDate(validDate, checkDate, reportId, showButtonId, flag = true) {
  if (checkDate && validateInputDate(checkDate)) {
    if (flag) {
      checkForFutureDate(validDate, checkDate, reportId, showButtonId);
    } else {
      checkForFutureDate(checkDate, validDate, reportId, showButtonId);
    }
  } else {
    disableShowButton(showButtonId);
  }
}

// Error messages to be shown on blur of from and to dates
$('#avl-from').change(function () {
  const showButtonId = 'generateReport-avl-profile';
  const reportId = 'avl-profile-report';
  const availableRepFromDate = $(this).val();
  const availableRepToDate = $('#avl-to').val();
  if (validateInputDate(availableRepFromDate)) {
    validateNeighbourDate(availableRepFromDate, availableRepToDate, reportId, showButtonId);
  } else {
    disableShowButton(showButtonId);
  }
  errori18();
});

$('#avl-to').change(function () {
  const showButtonId = 'generateReport-avl-profile';
  const reportId = 'avl-profile-report';
  const availableRepToDate = $(this).val();
  const availableRepFromDate = $('#avl-from').val();
  if (validateInputDate(availableRepToDate)) {
    validateNeighbourDate(availableRepToDate, availableRepFromDate, reportId, showButtonId, false);
  } else {
    disableShowButton(showButtonId);
  }
  errori18();
});

$('#util-from').change(function () {
  const showButtonId = 'generateReport-util-profile';
  const reportId = 'util-profile-report';
  const availableRepFromDate = $(this).val();
  const availableRepToDate = $('#util-to').val();
  if (validateInputDate(availableRepFromDate)) {
    validateNeighbourDate(availableRepFromDate, availableRepToDate, reportId, showButtonId);
  } else {
    disableShowButton(showButtonId);
  }
  errori18();
});

$('#util-to').change(function () {
  const showButtonId = 'generateReport-util-profile';
  const reportId = 'util-profile-report';
  const availableRepToDate = $(this).val();
  const availableRepFromDate = $('#util-from').val();
  if (validateInputDate(availableRepToDate)) {
    validateNeighbourDate(availableRepToDate, availableRepFromDate, reportId, showButtonId, false);
  } else {
    disableShowButton(showButtonId);
  }
  errori18();
});

$('#rdy-from').change(function () {
  const showButtonId = 'generateReport-rdy-profile';
  const reportId = 'rdy-profile-report';
  const availableRepFromDate = $(this).val();
  const availableRepToDate = $('#rdy-to').val();
  if (validateInputDate(availableRepFromDate)) {
    validateNeighbourDate(availableRepFromDate, availableRepToDate, reportId, showButtonId);
  } else {
    disableShowButton(showButtonId);
  }
  errori18();
});

$('#rdy-to').change(function () {
  const showButtonId = 'generateReport-rdy-profile';
  const reportId = 'rdy-profile-report';
  const availableRepToDate = $(this).val();
  const availableRepFromDate = $('#rdy-from').val();
  if (validateInputDate(availableRepToDate)) {
    validateNeighbourDate(availableRepToDate, availableRepFromDate, reportId, showButtonId, false);
  } else {
    disableShowButton(showButtonId);
  }
  errori18();
});

$('#profile-from').change(function () {
  const showButtonId = 'generateReport-profile-dwn';
  const reportId = 'profile-dwn-report';
  const availableRepFromDate = $(this).val();
  const availableRepToDate = $('#profile-to').val();
  if (validateInputDate(availableRepFromDate)) {
    validateNeighbourDate(availableRepFromDate, availableRepToDate, reportId, showButtonId);
  } else {
    disableShowButton(showButtonId);
  }
  errori18();
});

$('#profile-to').change(function () {
  const showButtonId = 'generateReport-profile-dwn';
  const reportId = 'profile-dwn-report';
  const availableRepToDate = $(this).val();
  const availableRepFromDate = $('#profile-from').val();
  if (validateInputDate(availableRepToDate)) {
    validateNeighbourDate(availableRepToDate, availableRepFromDate, reportId, showButtonId, false);
  } else {
    disableShowButton(showButtonId);
  }
  errori18();
});

function generateReservedProfileReport(fromDate, toDate) {
  $('.errorAlert').css('display', 'none');
  const profileType = $('#profileTypeSelect-util-profile').attr('data-value');
  const smdp = $('#simTypeSelect-util-profile').attr('data-value');
  const channel = $('#channelTypeSelect-util-profile').attr('data-value');
  const country = $('#countryTypeSelect-util-profile').attr('data-value');
  var ajaxURL;
  if(sessionStorage.role.toLowerCase() !== 'simadministrator'){
    ajaxURL = sessionStorage.gatewayurl + sessionStorage.reports +'reservedReport'+'&fromDate='+fromDate+'&toDate='+toDate
    + '&profileType='+profileType+'&smdp='+smdp+'&channel='+channel+'&country='+country;
  } else {
    ajaxURL = sessionStorage.gatewayurl + sessionStorage.reports +'reservedReport'+'&fromDate='+fromDate+'&toDate='+toDate
    + '&profileType='+profileType+'&smdp='+smdp+'&channel='+channel
  }
  $.ajax({
    method: 'GET',
    async: true,
    url: ajaxURL,
    headers: {
      Authorization: localStorage.jwtToken,
    },
    jsonpCallback: 'jsonCallback',
    crossDomain: true,
    dataType: 'json',
  }).success(function (data) {
    $('#table-body').empty();
    if (data.length !== 0) {
      var tr;
      for (let i = 0; i < data.length; i += 1) {
        tr = $('<tr/>');
        tr.append("<td class='reserved_date'>" + (new Date(data[i].DATE_RESERVED)).format('dd/mm/yyyy') + "</td>");
        tr.append("<td class='reserved_profile'>" + data[i].PROFILE_TYPE + "</td>");
        tr.append("<td class='reserved_channel'>" + data[i].RESERVE_CHANNEL + "</td>");
        tr.append("<td class='reserved_count'>" + data[i].BLOCK_COUNT + "</td>");
        tr.append("<td class='reserved_country'>" + data[i].OPERATOR_NAME.replace('vodafone','vf').toUpperCase() + "</td>");
        tr.append("<td class='reserved_sim_company'>" + data[i].SIM_PERSONALIZATION_COMPANY + "</td>");
        $('table').append(tr);
      }
      var noOfRec = data.length;
      showDropdown(noOfRec);
      sortTableColumns();
      $('#numberofrecords').html(noOfRec);
      $('.optionselector').attr('onchange', 'showRecords(this)');
      var drpValue = $('#optionselector_rep1 option:selected').val();
      localStorage.totalRow = noOfRec;
      pagination(drpValue, noOfRec);
      $('.util-profile-report').css('display', 'block');
      $('#no-records').css('display', 'none');
    } else {
      $('#no-records').html('<div class="servbox" data-i18n="errorTranslation.no_record_av"></div>');
      $('.util-profile-report').css('display', 'none');
      $('#no-records').css('display', 'block');
      errori18();
     }
   }).error(function (error) {
     if (error.status === 0 && !localStorage.jwtToken) {
       logoutClient();
     } else {
       $('#no-records').html('<div class="servbox" data-i18n="errorTranslation.no_record_av"></div>');
       $('.util-profile-report').css('display', 'none');
       $('#no-records').css('display', 'block');
       errori18();
     }
   });
}

function generateAvailableProfileReport(fromDate, toDate) {
  $('.errorAlert').css('display', 'none');
  const profileType = $('#profileTypeSelect-avl-profile').attr('data-value');
  const smdp = $('#simTypeSelect-avl-profile').attr('data-value');
  const country = $('#countryTypeSelect-avl-profile').attr('data-value');
  var ajaxUrl;
  if (sessionStorage.role.toLowerCase() !== 'simadministrator') {
    ajaxUrl = sessionStorage.gatewayurl + sessionStorage.reports + 'availableReport'+ '&fromDate='+fromDate+'&toDate='+toDate
     +'&profileType='+profileType+'&smdp='+smdp+'&country='+country;
  } else {
    ajaxUrl = sessionStorage.gatewayurl + sessionStorage.reports + 'availableReport'+ '&fromDate='+fromDate+'&toDate='+toDate
     +'&profileType='+profileType+'&smdp='+smdp
  }
  $.ajax({
    method: 'GET',
    async: true,
    url: ajaxUrl,
    headers: {
      Authorization: localStorage.jwtToken,
    },
    jsonpCallback: 'jsonCallback',
    crossDomain: true,
    dataType: 'json',
  }).success(function (data) {
    $('#avl-table-body').empty();
    if (data.length !== 0) {
      var tr;
      for (let i = 0; i < data.length; i += 1) {
        tr = $('<tr/>');
        tr.append("<td class='available_esim_date'>" + (new Date(data[i].REPORT_DATE)).format('dd/mm/yyyy') + "</td>");
        tr.append("<td class='available_esim_profile'>" + data[i].PROFILE_TYPE + "</td>");
        tr.append("<td class='available_esim_count'>" + data[i].AVAILABLE_RECORDS + "</td>");
        tr.append("<td class='available_esim_country'>" + data[i].OPERATOR_NAME.replace('vodafone','vf').toUpperCase() + "</td>");
        tr.append("<td class='available_esim_sim_company'>" + data[i].SIM_PERSONALIZATION_COMPANY + "</td>");
        $('#avl-table-body').append(tr);
      }
      var noOfRec = data.length;
      showDropdown(noOfRec);
      sortTableColumns();
      $('#numberofrecords_2').html(noOfRec);
      $('.optionselector').attr('onchange', 'showRecordsAvl(this)');
      var drpValue = $('#optionselector_rep2 option:selected').val();
      localStorage.totalRow = noOfRec;
      paginationAvl(drpValue, noOfRec);
      $('.avl-profile-report').css('display', 'block');
      $('#no-records').css('display', 'none');
    } else {
      $('#no-records').html('<div class="servbox" data-i18n="errorTranslation.no_record_av"></div>');
      $('.avl-profile-report').css('display', 'none');
      $('#no-records').css('display', 'block');
      errori18();
    }
  }).error(function (error) {
    if (error.status === 0 && !localStorage.jwtToken) {
      logoutClient();
    } else {
      $('#no-records').html('<div class="servbox" data-i18n="errorTranslation.no_record_av"></div>');
      $('.avl-profile-report').css('display', 'none');
      $('#no-records').css('display', 'block');
      errori18();
    }
  });
}

function generateProfileDownloadReport(fromDate, toDate) {
  $('.errorAlert').css('display', 'none');
  const profileType = $('#profileTypeSelect-profile-dwn').attr('data-value');
  const smdp = $('#simTypeSelect-profile-dwn').attr('data-value');
  const channel = $('#channelTypeSelect-profile-dwn').attr('data-value');
  const status = $('#statusTypeSelect-profile-dwn').attr('data-value');
  const deviceType = $('#deviceTypeSelect-profile-dwn').attr('data-value');
  const timezone = getTimezone();
  const url = sessionStorage.gatewayurl + sessionStorage.reports + 'profileDownloadReport' + '&fromDate='+fromDate+'&toDate='+toDate
   +'&profileType='+profileType+'&smdp='+smdp+'&channel='+channel+'&deviceType='+deviceType+'&status='+status
  $.ajax({
    method: 'GET',
    async: true,
    url: url,
    headers: {
      Authorization: localStorage.jwtToken,
    },
    jsonpCallback: 'jsonCallback',
    crossDomain: true,
    dataType: 'json',
  }).success(function (data) {
    $('#status-table-body').empty();
    if (data.length !== 0) {
      var tr;
      for (let i = 0; i < data.length; i += 1) {
        tr = $('<tr/>');
        tr.append("<td class='esim_status_msisdn msisdn_profile_status'>" + (data[i].MSISDN || "")+ "</td>");
        tr.append("<td class='esim_status_iccid iccid_profile_status'>" + data[i].ICCID + "</td>");
        tr.append("<td class='fail-reason'><span data-i18n = translation.failure_reason></span>: <span data-i18n = translation."+ failureDescription(data[i]) +"></span>"+ "</td>");
        tr.append("<td class='fail-col'><span data-i18n = translation.failure_code></span>" + (data[i].SUBJECT_CODE+"."+data[i].REASON_CODE || "") + "</td>");
        tr.append("<td class='esim_status status-col profile_status'>" + data[i].RESPONSE_STATUS + "</td>");
        tr.append("<td class='esim_status_profile esim_download_profile_type'>" + data[i].PROFILE_TYPE + "</td>");
        tr.append("<td class='esim_status_channel esim_download_profile_type'>" + (data[i].CHANNEL || "") + "</td>");
        tr.append("<td class='eid-col'><span data-i18n = translation.EID></span>: " + (data[i].EID || "")+ "</td>");
        var device = data[i].DEVICE_TYPE;
        if (device) {
          tr.append("<td class='esim_status_device device-column esim_download_device'>" + device + "</td>");
        } else {
          tr.append("<td class='esim_status_device device-column esim_download_device' data-i18n = translation.unknown></td>");
        }
        tr.append("<td class='esim_status_sim_company sim_profile_status'>" + data[i].SIM_PERSONALIZATION_COMPANY + "</td>");
        var recvDate = data[i].RESPONSE_DATE;
        tr.append("<td class='esim_status_date'>" + (new Date(recvDate)).format("dd/mm/yyyy, HH:MM:ss")+' '+timezone+ "</td>");
        $('#status-table-body').append(tr);
      }
      translationi18();
      var noOfRec = data.length;
      showDropdown(noOfRec);
      sortTableColumns();
      $('#numberofrecords_4').html(noOfRec);
      $('.optionselector').attr('onchange', 'showRecordsStatus(this)');
      var drpValue = $('#optionselector_rep4 option:selected').val();
      localStorage.totalRow = noOfRec;
      paginationStatus(drpValue, noOfRec);
      $('.profile-dwn-report').css('display', 'block');
      bindings.init();
      $('#no-records').css('display', 'none');
    } else {
      $('#no-records').html('<div class="servbox" data-i18n="errorTranslation.no_record_av"></div>');
      $('.profile-dwn-report').css('display', 'none');
      $('#no-records').css('display', 'block');
      errori18();
    }
  }).error(function (error) {
    if (error.status === 0 && !localStorage.jwtToken) {
      logoutClient();
    } else {
      $('#no-records').html('<div class="servbox" data-i18n="errorTranslation.no_record_av"></div>');
      $('.profile-dwn-report').css('display', 'none');
      $('#no-records').css('display', 'block');
      errori18();
    }
  });
}

function generateUncofirmedDownloadReport(fromDate, toDate) {
  $('.errorAlert').css('display', 'none');
  const profileType = $('#profileTypeSelect-rdy-profile').attr('data-value');
  const smdp = $('#simTypeSelect-rdy-profile').attr('data-value');
  const channel = $('#channelTypeSelect-rdy-profile').attr('data-value');
  const deviceType = $('#deviceTypeSelect-rdy-profile').attr('data-value');
  const url = sessionStorage.gatewayurl + sessionStorage.reports + 'unconfirmedReport'+'&fromDate='+fromDate
  +'&toDate='+toDate+'&profileType='+profileType+'&smdp='+smdp+'&channel='+channel+'&deviceType='+deviceType
  $.ajax({
    method: 'GET',
    async: true,
    url: url,
    headers: {
      Authorization: localStorage.jwtToken,
    },
    jsonpCallback: 'jsonCallback',
    crossDomain: true,
    dataType: 'json',
  }).success(function (data) {
    var finalData = data[0];
    $('#rdy-table-body').empty();
    if (finalData.length !== 0) {
      var tr;
      for (let i = 0; i < finalData.length; i += 1) {
        tr = $('<tr/>');
        tr.append("<td class='unconfirmed_date'>" + (new Date(finalData[i].RESPONSE_DATE)).format('dd/mm/yyyy') + "</td>");
        tr.append("<td class='unconfirmed_profile'>" + finalData[i].PROFILE_TYPE + "</td>");
        tr.append("<td class='unconfirmed_channel'>" + finalData[i].CHANNEL + "</td>");
        var deviceType = finalData[i].DEVICE_TYPE;
        if (deviceType) {
          tr.append("<td class='unconfirmed_device'>" + deviceType + "</td>");
        } else {
          tr.append("<td class='unconfirmed_device' data-i18n = translation.unknown></td>");
        }
        tr.append("<td class='unconfirmed_profile_count'>" + finalData[i].READY_COUNT + "</td>");
        tr.append("<td class='unconfirmed_country'>" + finalData[i].OPERATOR_NAME.replace('vodafone','vf').toUpperCase() + "</td>");
        tr.append("<td class='unconfirmed_sim_company'>" + finalData[i].SIM_PERSONALIZATION_COMPANY + "</td>");
        $('#rdy-table-body').append(tr);
      }
      translationi18();
      var noOfRec = finalData.length;
      showDropdown(noOfRec);
      sortTableColumns();
      $('#numberofrecords_3').html(noOfRec);
      $('.optionselector').attr('onchange', 'showRecordsReady(this)');
      var drpValue = $('#optionselector_rep3 option:selected').val();
      localStorage.totalRow = noOfRec;
      paginationReady(drpValue, noOfRec);
      $('.rdy-profile-report').css('display', 'block');
      $('#no-records').css('display', 'none');
    } else {
      $('#no-records').html('<div class="servbox" data-i18n="errorTranslation.no_record_av"></div>');
      $('.rdy-profile-report').css('display', 'none');
      $('#no-records').css('display', 'block');
      errori18();
    }
  }).error(function (error) {
    if (error.status === 0 && !localStorage.jwtToken) {
      logoutClient();
    }else {
      $('#no-records').html('<div class="servbox" data-i18n="errorTranslation.no_record_av"></div>');
      $('.rdy-profile-report').css('display', 'none');
      $('#no-records').css('display', 'block');
      errori18();
    }
  });
}

/*
 * Code to display Available ESIM Profiles Report Data
 *
 */
$('#generateReport-avl-profile').click(function () {
  $('#avl-table-body').empty();
  $('#err-title').empty();
  $('.errorAlert').css('display', 'none');
  reInstateArrows();
  const fromDate = $('#avl-from').val().split('/').reverse().join('-');
  const toDate = $('#avl-to').val().split('/').reverse().join('-');
  generateAvailableProfileReport(fromDate, toDate);
});

/*
 * Code to display Reserved ESIM Profiles Report Data
 *
 */
$('#generateReport-util-profile').click(function () {
  $('#table-body').empty();
  $('#err-title').empty();
  $('.errorAlert').css('display', 'none');
  reInstateArrows();
  const fromDate = $('#util-from').val().split('/').reverse().join('-');
  const toDate = $('#util-to').val().split('/').reverse().join('-');
  generateReservedProfileReport(fromDate, toDate);
});

/*
 * Code to display ESIM Profile Download Status Report Data
 *
 */
$('#generateReport-profile-dwn').click(function () {
  $('#err-title').empty();
  $('.errorAlert').css('display', 'none');
  reInstateArrows();
  const fromDate = $('#profile-from').val().split('/').reverse().join('-');
  const toDate = $('#profile-to').val().split('/').reverse().join('-');
  generateProfileDownloadReport(fromDate, toDate);
});

/*
 * Code to display Unconfirmed ESIM Profiles Report Data
 *
 */

$('#generateReport-rdy-profile').click(function () {
  $('#rdy-table-body').empty();
  $('#err-title').empty();
  $('.errorAlert').css('display', 'none');
  reInstateArrows();
  const fromDate = $('#rdy-from').val().split('/').reverse().join('-');
  const toDate = $('#rdy-to').val().split('/').reverse().join('-');
  generateUncofirmedDownloadReport(fromDate, toDate);
});

function failureDescription(data) {
  var failureDesc;
  if (data.SUBJECT_CODE) {
    failureDesc = '5_' + data.NOTIFICATION_POINT_ID + "_" + data.SUBJECT_CODE.replace(/\./g, '_') + '_' + data.REASON_CODE.replace(/\./g, '_');
  }
  return failureDesc;
}
