var cancelICCID;
$("#cancelbutton").click(function() {
  $("#selectedFile-txt").val("");
  $("#selectedFile").val("");
  $('#import-success-block-show').css('display', 'none');
  $(".errorAlert").hide();
});

//Code for enable/disable msisdn input element in servicePortal
$("#msisdn-radio").click(function() {
	setTimeout(function(){
	$("#txt_msisdn").removeAttr('disabled');
    $("#txt_iccid").attr('disabled','disabled');
    $("#txt_iccid").val("");
	$("#noResult,#searchResult,#cancelOrderSuccess").css('display', 'none');
	$(".errorAlert").css('display', 'none');
    $("#searchservice").addClass("btn_disabled");
    $("#searchservice").attr('disabled','disabled');
	},300);
});

//Code for enable/disable iccid input element in servicePortal
$("#iccid-radio").click(function() {
	setTimeout(function(){
    $("#txt_iccid").removeAttr('disabled');
    $("#txt_msisdn").attr('disabled','disabled');
    $("#txt_msisdn").val("");
	$("#noResult,#searchResult,#cancelOrderSuccess").css('display', 'none');
	$(".errorAlert").css('display', 'none');
    $("#searchservice").addClass("btn_disabled");
    $("#searchservice").attr('disabled','disabled');
	},300);
});

// Code for Upload Functionality Start
$("#importTable").click(function() {
  $("#table-body").empty();
  $('#import-success-block-show').css('display', 'none');
  var temp = true;
  var timezone = getTimezone();
  var fileFieldEmptyChk = $('#selectedFile').val();
  if (!fileFieldEmptyChk) {
    $("#err-title, #err-txt").empty();
    $(".errorAlert").css('display', 'none');
    $("#err-title").attr('data-i18n', 'errorTranslation.nofile1');
    $("#err-txt").attr('data-i18n', 'errorTranslation.nofile2');
    $(".errorAlert").css('display', 'block');
    temp = false;
  } else {
    var fileElement = document.getElementById("selectedFile");
    var file = fileElement.files[0];
	var fileSize = file.size/(sessionStorage.fileUploadSize); //9.9 MB = 10380902 bytes
    var exts = ['json'];
    var get_ext = (file.name).split('.');
    get_ext = get_ext.reverse()[0].toLowerCase();
    if ($.inArray(get_ext, exts) == -1) {
      $("#err-title, #err-txt").empty();
	  $("#invalidFile").css('margin-top', '5px');
      $(".errorAlert").css('display', 'none');
      $("#err-title").attr('data-i18n', 'errorTranslation.file_format1');
      $("#err-txt").attr('data-i18n', 'errorTranslation.file_format2');
      $(".errorAlert").css('display', 'block');
      temp = false;
    } else if (!file.type == "application/json") {
      $("#err-title, #err-txt").empty();
	  $("#invalidFile").css('margin-top', '5px');
      $(".errorAlert").css('display', 'none');
      $("#err-title").attr('data-i18n', 'invalid_fileSize');
      $(".errorAlert").css('display', 'block');
      temp = false;
    } else if (fileSize > 1) {
      $("#err-title, #err-txt").empty();
      $("#err-txt").removeAttr('data-i18n');
	  $("#invalidFile").css('margin-top', '14px');
      $(".errorAlert").css('display', 'none');
      $("#err-title").attr('data-i18n', 'errorTranslation.invalid_fileSize');
      $(".errorAlert").css('display', 'block');
      temp = false;
    }
  }
  if (temp) {
    $("#progressBar, #status").show();
    var amountLoaded = 0;
    progressBarSim(amountLoaded);
    $(".errorAlert").hide();
    var fd = new FormData();
    fd.append('uploadingFile', file);
    var ajaxURL = sessionStorage.gatewayurl + sessionStorage.simUpload ;

    $.ajax({
      method: "POST",
      contentType: false,
      async: true,
      processData: false,
      url: ajaxURL,
	  headers: {
	  'Authorization': localStorage.jwtToken,
      'uploadtype':'Manual'
	  },
      data: fd,
      jsonpCallback: 'jsonCallback',
      dataType: "json"
    }).done(function(data) {
        $("#progressBar, #status").hide();
        $("#err-title, #err-txt").empty();
        $(".errorAlert").css('display', 'none');
        $("#importSuccess").attr('data-i18n', 'translation.importSuccess');
        $(".import_alert").css('display', 'block');
		$("#import-success-block-show").css("display", "block");
	    $("#import-success-block1").css("display", "block");
	    $("#import-success-block-show").addClass("import-success-block");
        translationi18();
    }).fail(function(error) {
		if(error.status === 0 && !localStorage.jwtToken) {
          logoutClient();
        }else {
		  $("#err-title, #err-txt").empty();
		  $("#invalidFile").css('margin-top', '14px');
		  if(error.status === 413 || error.status === 0){
		    $("#err-txt").removeAttr('data-i18n');
		    $(".errorAlert").css('display', 'none');
		    $("#err-title").attr('data-i18n', 'errorTranslation.invalid_fileSize');
		    $(".errorAlert").css('display', 'block');
		    errori18();
		  } else {
		    $(".errorAlert").css('display', 'none');
		    $("#progressBar, #status").hide();
		    $("#err-title").attr('data-i18n', 'errorTranslation.genericUploadFailure');
		    $(".errorAlert").css('display', 'block');
		    errori18();
		  }
	    }
    });
  }
  errori18();
});
// Code for Upload Functionality Ends
function progressBarSim(al) {
  var bar = document.getElementById('progressBar');
  var status = document.getElementById('status');
  status.innerHTML = al + "%";
  bar.value = al;
  al++;
  var sim = setTimeout("progressBarSim(" + al + ")", 100);
  if (al == 100) {
    status.innerHTML = "98%";
    bar.value = 98;
    clearTimeout(sim);
  }
}

$("#txt_msisdn,#txt_iccid").keyup(function(data) {
  if ($(this).val() != "") {
    $("#searchservice").removeAttr("disabled");
    $("#searchservice").removeClass("btn_disabled");
  } else {
    $("#searchservice").attr("disabled", "disabled");
    $("#searchservice").addClass("btn_disabled");
  }
});

// Code for Search Functionality Starts
$("#searchservice").click(function() {
  $("#table-body").empty();
  $("#err-title").empty();
  $(".errorAlert").css('display', 'none');
  $("#cancelOrderSuccess").css('display', 'none');
  setVisibility('searchResult', 'none');
  setVisibility('noResult', 'none');
  var radioValue = $('input[name=imgsel]:checked').val();
  var custNumber;
  var flag = true;
  var expression;
  var searchAjaxURL;
  var tableFirstColumn;
  var timezone = getTimezone();
  var pattern;
  var searchResult = [];
  $.ajaxSetup( { "async": false } );
  $.getJSON(propertiesFile, function( data ) {
    pattern = data['pattern'+sessionStorage.country];
  });
  $.ajaxSetup( { "async": true } );
  if (radioValue == 'msisdn') {
    tableFirstColumn = 'ICCID';
    custNumber = $('#txt_msisdn').val();
    if (!custNumber.match(pattern)) {
      $("#err-title").attr('data-i18n', 'errorTranslation.invalid_msisdn');
      $(".errorAlert").css('display', 'block');
	  $("#cancelOrderSuccess").css('display', 'none');
	  $("#noResult").css('display', 'none');
	  $("#searchResult").css('display', 'none');
      flag = false;
    }
    searchAjaxURL = sessionStorage.gatewayurl +sessionStorage.msisdnSearch + custNumber;
  } else if (radioValue == 'iccid') {
    tableFirstColumn = 'MSISDN';
    custNumber = $('#txt_iccid').val();
    expression = /^[1-9][0-9]{18}[0-9F]?$/;
    if (!onlyNumeric(custNumber, expression)) {
      $("#err-title").attr('data-i18n', 'errorTranslation.invalid_iccid');
      $(".errorAlert").css('display', 'block');
	  $("#cancelOrderSuccess").css('display', 'none');
	  $("#noResult").css('display', 'none');
	  $("#searchResult").css('display', 'none');
      flag = false;
    };
    searchAjaxURL = sessionStorage.gatewayurl + sessionStorage.iccidSearch + custNumber + '/history';
  }
  errori18();
  if (flag) {
    $(".errorAlert").hide();
	$("#cancelOrderSuccess").css('display', 'none');
    $.ajax({
      method: "GET",
      async: true,
      headers: {
		'Authorization': localStorage.jwtToken
      },
	  url: searchAjaxURL,
      jsonpCallback: 'jsonCallback',
      dataType: "json"
    }).done(function(data) {
      $('table tr:eq(0) th:eq(0)').attr('data-i18n', 'translation.'+tableFirstColumn);
	  if (data.length == 0) {
	    $(".noResult").html('<div class="servbox" data-i18n="errorTranslation.no_records"></div>');
		setVisibility('noResult', 'inline');
		setVisibility('searchResult', 'none');
		errori18();
      }else {
	    displaySearchResult(data,radioValue,custNumber);
	  }
      }).fail(function(error, response, body) {
		if(error.status === 0 && !localStorage.jwtToken) {
          logoutClient();
        }else {
	      var errorMsg = error.responseJSON.descriptions[0].$;
	      if(errorMsg.code === 702){
		    $('#err-title').attr('data-i18n', 'errorTranslation.dbFailure');
            $(".errorAlert").css('display', 'block');
	        $("#noResult").css('display', 'none');
	        $("#searchResult").css('display', 'none');
	      }else {
		    $(".noResult").html('<div class="servbox" data-i18n="errorTranslation.no_records"></div>');
	        setVisibility('noResult', 'inline');
            setVisibility('searchResult', 'none');
		    $(".errorAlert").css('display', 'none');
	      }
	      errori18();
		}
      });
    }
});

// Code for Search Functionality Ends
function displaySearchResult(result,radioValue,custNumber){
	var tr,translationKey;
	$("#table-body").empty();
  var timezone = getTimezone();
	var profileStatusId = parseInt(result[0].status.$);
	cancelICCID = result[0].ids[0].$;
	for (var i = 0; i < result.length; i++) {
	  tr = $('<tr/>');
	  translationKey = getES2Status(result[i].parts['status-history']['state-transitions'][0]['state-transition']['to-status-code'].$,result[i].parts['download-requests'][0]['download-request']['download-response-code'].$);
	  tr.append('<td class="iccid-eid-class">' + (radioValue === 'iccid' ? result[i].parts['logical-resource'].msisdn : result[i].ids[0].$) + '</td>');
	  tr.append('<td class="iccid-eid-class">' + result[i].parts['logical-resource'].eid +'</td>');
	  tr.append('<td class="imei-col">' + result[i].parts['physical-resource'].imei + '</td>');
	  tr.append('<td class="device-col">' + result[i].parts['physical-resource'].type.$ +'</td>');
	  tr.append('<td class="status status-width-table" id="status_message" data-i18n="translation.'+translationKey+'"></td>');
	  var userName = result[i].parts['status-history']['state-transitions'][0]['state-transition']['changed-by-user-id'];
	  tr.append('<td class="col-hide">' + userName + '</td>');
	  var recvDate = result[i].parts['status-history']['state-transitions'][0]['state-transition']['effective-date-time'];
	  tr.append('<td class="action_date" id="action_' + i + '">' + (new Date(recvDate)).format("dd/mm/yyyy HH:MM:ss")+':'+(new Date(recvDate)).getMilliseconds()+' '+timezone +'</td>');
      tr.append('<td class="action-col">-</td>');
	  $('.dashboard ').append(tr);
	}
	if((profileStatusId > 2 && profileStatusId < 8)) {
	  $('div.action-ovl').children('div#action_cancel').show();
      $('#table_service-portal > tbody > tr:first> td:last').html('<img class="table-action" src="/img/Action.png"/>');
	}
	if((profileStatusId === 8 || profileStatusId === 9)) {
	  $('div.action-ovl').children('div#action_cancel').hide();
      $('#table_service-portal > tbody > tr:first> td:last').html('<img class="table-action" src="/img/Action.png"/>');
	}
	translationi18();
	bindings.init();
	$(".serv").html(radioValue.toUpperCase() + ' ' + custNumber);
	var noOfRec = $("tbody tr").length;
	localStorage.totalRow = noOfRec;
	showDropdown(noOfRec);
	$('#numberofrecords').html(noOfRec);
	$(".optionselector").attr("onchange", "showRecords(this)");
	var drpValue = $("#optionselector option:selected").val();
	setVisibility('searchResult', 'inline');
	setVisibility('noResult', 'none');
	pagination(drpValue, noOfRec);
}

//	Number Validation
function onlyNumeric(num, exp) {
  var regexp = exp;
  if (num.match(regexp)) {
    return true;
  } else {
    return false;
  }
}
// Function to read the response status from translation file
function getES2Status(actionType, responseCode) {
  var translationKey = '';
 if (responseCode) {
   translationKey = actionType + '_' + responseCode;
 }else {
   translationKey = actionType;
 }
 return translationKey;
}

function getFileUploadReport() {
  $('#upload-body').empty();
  var fromDate = new Date((new Date()).setDate(new Date().getDate() - 179)).format('yyyy-mm-dd');
  var toDate = new Date().format('yyyy-mm-dd');
  var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.reports + 'fileUploadReport'+'&fromDate='+fromDate+'&toDate='+toDate;

  $.ajax({
    method: "GET",
    async: true,
    url: ajaxUrl,
	headers: {
	  'Authorization': localStorage.jwtToken
	},
    jsonpCallback: 'jsonCallback',
    crossDomain: true,
    dataType: "json"
  }).success(function(data) {
	$('#upload-body').empty();
    var timezone = getTimezone();
    if (data.length !== 0) {
      var tr;
      for (i = 0; i < data.length; i++) {
        tr = $('<tr/>');
		var failReasonKey = 'uploadFailReason_' + data[i].ERROR_CODE;
        tr.append("<td class='uploaded_fileName table_adjust_large'>" + data[i].FILE_NAME + "</td>");
        tr.append("<td class='uploaded_company table_adjust_large'>" + (data[i].SIM_PERSONALIZATION_COMPANY || '-') + "</td>");
        tr.append("<td class='uploaded_type table_adjust_small'>" + data[i].UPLOAD_TYPE + "</td>");
        tr.append("<td class='fail-reason'><span data-i18n = translation.failure_reason></span>: <span data-i18n = translation."+failReasonKey+"></span></td>");
        tr.append("<td class='fail-col'><span data-i18n = translation.failure_code></span> " + data[i].ERROR_CODE + "</td>");
        tr.append("<td class='status-col table_adjust_small'>" + data[i].UPLOAD_STATUS + "</td>");
        var recvDate = data[i].UPLOAD_END_DATE;
        tr.append('<td class="uploaded_date table_adjust_small">' + (new Date(recvDate)).format("dd/mm/yyyy, HH:MM:ss")+'.'+(new Date(recvDate)).getMilliseconds()+' '+timezone+ '</td>');
        tr.append("<td class='uploaded_records_count table_adjust_small'>" + data[i].NUMBER_OF_RECORDS + "</td>");
		tr.append("<td class='uploaded_by table_adjust_small'>" + data[i].UPLOAD_USER_NAME + "</td>");
        $('#upload-body').append(tr);
      }
	  translationi18();
      var noOfRec = data.length;
      showUploadDropdown(noOfRec);

      $('#numberofrecords').html(noOfRec);
      $(".optionselector").attr("onchange", "showUploadRecords(this)");
      var drpValue = $("#optionselector_upload option:selected").val();
      localStorage.totalRow = noOfRec;
      $(".upload-dash").css("display", "block");
      bindings.init();
      $("#no-rec").css("display", "none");
      uploadPagination(drpValue, noOfRec);
      sortTableColumns();
    } else {
      $(".pagination").css("display", "none");
      $(".upload-dash").css("display", "none");
      $("#no-rec").css("display", "block");
      translationi18();
    }
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $(".pagination").css("display", "none");
      $(".upload-dash").css("display", "none");
      $("#no-rec").css("display", "block");
      translationi18();
	} 
  });
}

// function to cancel a pending download order request
$('#cancel_request_yes').click(function () {
  $('#err-title').empty();
  const cancelOrderUrl = sessionStorage.gatewayurl + sessionStorage.cancelOrderUrl.replace('{id}', cancelICCID)  + '?finalProfileStatusIndicator=Available';

  $.ajax({
    method: 'DELETE',
    async: false,
    url: cancelOrderUrl,
    headers: {
      Authorization: localStorage.jwtToken,
    },
    crossDomain: true,
    dataType: 'json',
  }).done(function () {
    $('.search-btn').trigger('click');
    $('#cancelOrderSuccessText').attr('data-i18n', 'translation.4');
    $('#cancelOrderSuccess').css('display', 'block');
    translationi18();
	}).error(function (error, textStatus, errorThrown) {
    if (error.status === 0 && !localStorage.jwtToken) {
      logoutClient();
    } else {
      $('.search-btn').trigger('click');
      if (error.status === 504 || error.status === 0) {
        $('#err-title').attr('data-i18n','translation.RequestTimeOut');
      } else if (error.status === 500) {
        $('#err-title').attr('data-i18n', 'translation.dbFailure');
      } else {
        var errorMessage = error.responseJSON.failures[0];
        if(errorMessage.code == 'RequestTimeOut') {
          $('#err-title').attr('data-i18n', 'translation.RequestTimeOut');
        } else if(errorMessage.code == 'ServerUnreachable') {
          $('#err-title').attr('data-i18n','translation.ServerUnreachable');
        } else {
          $('#err-title').attr('data-i18n', 'translation.'+errorMessage.code.replace(/\./g, '_'));
        }
      }
      $('.errorAlert').css('display', 'block');
      translationi18();
    }
  });
});
