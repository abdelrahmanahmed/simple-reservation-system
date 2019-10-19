var iccidValue;
var PIN1;
var PUK1;
var PIN2;
var PUK2;
var confCode;
var activationCode;
var jsonParse;
var codeVersion = '1';
var delimeter = '$';
var msisdnValue;
var simRequestJson;
var subTypeSelect;
var msisdnRequestJson;
var eid = '';
var imei = '';
var msisdnRegex ;
const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

$.getJSON('/payloads/postPayload.json', function(data) {
  simRequestJson = data;
});
$.getJSON('/payloads/putPayload.json', function(data) {
  msisdnRequestJson = data;
});

// Fetch Subscription types which has available profiles
function populateSubscriptionType() {
  const ajaxUrl = sessionStorage.gatewayurl + sessionStorage.subscriptionTypeDropDownUrl;
  $.ajax({
    method: 'GET',
    url: ajaxUrl,
    headers: {
      'Authorization': localStorage.jwtToken,
    }
  }).success(function(data) {
    $('#cs-option-ul_subscriptionType').append('<li data-option data-value="' + data[0].SUBSCRIPTION_TYPES +
      '" class="cs-selected cs-option" id="subTypeOption0"><span>' + data[0].SUBSCRIPTION_TYPES + '</span></li>');
    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_subscriptionType').append('<li data-option data-value="' + data[j].SUBSCRIPTION_TYPES + '" class="cs-option" id="profileTypeOption' + (j) +
        '"><span>' + data[j].SUBSCRIPTION_TYPES + '</span></li>');
    }
    bindings.init();
  }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
      }
  });
}

//for fetching iccid and its attribute from DB
$("#eSIM").click(function() {
  $('.warning').css('display', 'none');
  $('#alertTitle1_warning').empty();
  if (msisdnRequestJson.details['confirmation-code-required'] === true) {
    confirmationCodeMandatory = true;
  } else {
    confirmationCodeMandatory = false;
  }
  sessionStorage.selval = $("#subTypeSelect").attr('data-value');
  sessionStorage.seltxt = $("#subTypeSelect").text();
  var fetchedValue = $("#subTypeSelect").attr('data-value');
  if (!fetchedValue) {
    $('#alertTitle1_warning').attr('data-i18n', 'errorTranslation.select_subscription');
    $('.warning').css('display', 'block');
    $('.errorAlert').css('display', 'none');
    errori18();
  } else {
    simRequestJson.type.$ = fetchedValue;
    sessionStorage.setItem('profileTypeValue', fetchedValue);
    var profileTypeValue = fetchedValue;
    var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.reserveICCIDAjax;
    $.ajax({
      method: "POST",
      url: ajaxUrl,
      data: JSON.stringify(simRequestJson),
      headers: {
        'Authorization': localStorage.jwtToken,
      },
      contentType: sessionStorage.CSMContentType + '; charset=utf-8',
      dataType: "json"
    }).success(function(body) {
        $('.errorAlert').css('display', 'none');
        $("#disablebtn").removeAttr("disabled");
        $("#disablebtn").removeClass("btn_disabled");
        $("#getNewEsim_Sc1").css("display", "none");
        $("#getNewEsim_Sc2").css("display", "block");
        $(".subType").css("display", "none");
        $(".newSim1").css("display", "block");
        $("#subscrptextVal1").html(sessionStorage.profileTypeValue);
        $(".copy-print").css("display", "block");
        $(".subType .cs-placeholder").addClass("cs-disabled");
        $(".cs-option-ul").empty();
        iccidValue = body.ids[0].$;
        PIN1 = body.details.pin1;
        PUK1 = body.details.puk1;
        PIN2 = body.details.pin2;
        PUK2 = body.details.puk2;
        $("#bar-code").JsBarcode(iccidValue, {backgroundColor: "white"});
        icc = iccidValue;
        sessionStorage.setItem('icc', iccidValue);
        $("#iccidNumber").html(iccidValue);
        $("#pin1").html("PIN 1 : " + PIN1);
        $("#puk1").html("PUK 1 : " + PUK1);
        $("#pin2").html("PIN 2 : " + PIN2);
        $("#puk2").html("PUK 2 : " + PUK2);
        $("#getNewEsim_Sc1").css("display", "none");
        $("#getNewEsim_Sc2").css("display", "block");
        $(".copy-print").css("display", "block");
        $(".subType .cs-placeholder").addClass("cs-disabled");
        $(".languageSelector .cs-placeholder").addClass("cs-disabled");
    }).error(function(error, response, body) {
	    if (error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
      } else {
	    if(error.status === 500){
		  $('#getEsim_errorMsg').attr('data-i18n', 'errorTranslation.dbFailure');
          $('#getEsim_error').css('display', 'block');
          $('.warning').css('display', 'none');
	    }else if(error.status === 404){
		  $('#alertTitle1_warning').attr('data-i18n', 'errorTranslation.no_available');
          $('.warning').css('display', 'block');
          $('.errorAlert').css('display', 'none');
	    }
	  }
      errori18();
    });
  }
});

//copy functionality
function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
$("#copyToClipBoard").click(function() {
  $(".tooltip-success").css("display", "block");
  var offset = $(this).position();
  var topOffset = offset.top - 25;
  var leftOffset = offset.left;
  $(".tooltip-success").css("top", topOffset).css("left", leftOffset);
  setTimeout(function() {
    $(".tooltip-success").css("display", "block").fadeOut('slow');
  }, 2000);
});

//clciking this button we will move to device details
$("#disablebtn").click(function() {
  $("#subscrptextICCIDval").html(icc);
  $("#subscrptextVal").html(sessionStorage.profileTypeValue);
  $("#newSubscription").css("display", "none");
  $("#deviceDetails").css("display", "block");
  $('#tx_msisd').val('');
  $(".wizard-stp .step:nth-child(1) .wizard-image").attr("src", "/img/WizardImages/GeteSIMcomplete.png");
  $(".wizard-stp .step:nth-child(3) .wizard-image").attr("src", "/img/WizardImages/DevicedetailsInprogress.png");
  $(".wizard-stp .progress-line:nth-child(2) .progress").addClass('waiting');
});
// MSISDN validations
$('#tx_msisd').blur(function() {
  validationMsisdn();
});

function validationMsisdn() {
  $.getJSON(propertiesFile, function(data) {
    $('#error_msisdn').css('display', 'none');
    $('#alertTitle2_error_msisdn').empty();
    msisdnValue = $('#tx_msisd').val();
    sessionStorage.setItem('msisdnValue', msisdnValue);
    msisdnRegex = data['pattern' + sessionStorage.country];
    if (!msisdnValue) {
      $('#alertTitle2_error_msisdn').attr('data-i18n', 'errorTranslation.mandatory_msisdn');
      $('#error_msisdn').css('display', 'block');
      $('.successAlert').css('display', 'none');
      $('#next').attr("disabled", "disabled");
      $("#next").addClass("btn_disabled");
    } else if (!msisdnValue.match(msisdnRegex)) {
      $('#alertTitle2_error_msisdn').attr('data-i18n', 'errorTranslation.incorrect_msisdn');
      $('#error_msisdn').css('display', 'block');
      $('.successAlert').css('display', 'none');
      $('#next').attr("disabled", "disabled");
      $("#next").addClass("btn_disabled");
    } else {
      $('#error_msisdn').css('display', 'none');
	  enableIssueEsimButton();
      reserveMSISDN();
      eid = $("#tx_eid").val();
      if (!eid) {
        sessionStorage.setItem('scenerio', 'pull');
      } else {
        sessionStorage.setItem('scenerio', 'push');
      }
      $('.successAlert').css('display', 'none');
    }
    errori18();
  });
}
$('#tx_imei').blur(function() {
  validationImei();
})

function validationImei() {
  imei = $("#tx_imei").val();
  var eidData = $("#tx_eid").val();
  var msisdnData = $('#tx_msisd').val();
  const imeiRegex = '^[1-9]{1}[0-9]{14}$';
  var eidRegex = '^[0-9]{32}$';
  if (!imei) {
    imei = '';
    $('#error_imei').css('display', 'none');
    $('.successAlert').css('display', 'none');
	if ((msisdnData.match(msisdnRegex) && (msisdnData)) && (eidData.match(eidRegex) || (!eidData))) {
	  enableIssueEsimButton();
	} else {
	  $('#next').attr("disabled", "disabled");
      $("#next").addClass("btn_disabled");
	}
  } else {
    if (imei.match(imeiRegex)) {
      $('#error_imei').css('display', 'none');
      $('.successAlert').css('display', 'none');
	  if ((msisdnData.match(msisdnRegex) && (msisdnData)) && (eidData.match(eidRegex) || (!eidData))) {
		enableIssueEsimButton();
	  }
    } else {
      $('#alertTitle2_error_imei').attr('data-i18n', 'errorTranslation.invalid_imei');
      $('#error_imei').css('display', 'block');
      $('.successAlert').css('display', 'none');
	  $('#next').attr("disabled", "disabled");
      $("#next").addClass("btn_disabled");
    }
  }
  errori18();
}
// IMEI validation ends
//EID Validations
$('#tx_eid').blur(function(e) {
  validateEid();
});

function validateEid() {
  $('#dialog-confirm').css('display', 'block');
  eid = $("#tx_eid").val();
  var msisdnData = $('#tx_msisd').val();
  var imeiData = $("#tx_imei").val();
  const imeiRegex = '^[1-9]{1}[0-9]{14}$';
  var eidRegex = '^[0-9]{32}$';
  if (!eid) {
    $('#error_eid').css('display', 'none');
    $('.successAlert').css('display', 'none');
	if ((msisdnData.match(msisdnRegex) && (msisdnData)) && (imeiData.match(imeiRegex) || (!imeiData))) {
	  enableIssueEsimButton();
	} else {
	  $('#next').attr("disabled", "disabled");
      $("#next").addClass("btn_disabled");
	}
  } else {
    if (eid.match(eidRegex)) {
      sessionStorage.setItem('scenerio', 'push');
      $('#error_eid').css('display', 'none');
      $('.successAlert').css('display', 'none');
	  sessionStorage.setItem('validEID',true);
	  if ((msisdnData.match(msisdnRegex) && (msisdnData)) && (imeiData.match(imeiRegex) || (!imeiData))) {
	    enableIssueEsimButton();
	  }
    } else {
      $('#alertTitle2_error_eid').attr('data-i18n', 'errorTranslation.invalid_eid');
      $('#error_eid').css('display', 'block');
      $('.successAlert').css('display', 'none');
	  sessionStorage.setItem('validEID',false);
	  $('#next').attr("disabled", "disabled");
      $("#next").addClass("btn_disabled");
    }
  }
  errori18();
}

$("#next").click(function() {
  if (msisdMatchStatus == 0) {
    mapMsisdn();
  } else {}
});

function reserveMSISDN() {
  var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.msisdnSearch + msisdnValue;
  if (imei === 0) {
    imei = '';
    sessionStorage.setItem('imei', imei);
  }
  $.ajax({
    method: "GET",
    async: false,
    url: ajaxUrl,
    headers: {
      'Authorization': localStorage.jwtToken,
    },
    crossDomain: true,
  }).success(function(data) {
	var msisdnMatchFlag = true;
	for(var i=0;i< data.length;i++) {
		if(data[i].ids[0].$ === sessionStorage.icc) {
			sessionStorage.setItem('msisdnDB', 'unmatched');
			msisdMatchStatus = 0;
			msisdnMatchFlag = false;
			break;
		}
	}
    if (msisdnMatchFlag) {
      sessionStorage.setItem('msisdnDB', 'matched');
      msisdMatchStatus = 1;
      $('#swap_iccid').html(data[0].ids[0].$);
      sessionStorage.setItem('swapedIccid', data[0].ids[0].$);
      $('#swap_eid').html(data[0].parts['logical-resource'].eid);
      $('#swap_device').html(data[0].parts['physical-resource'].type.$);
      $('#swap_status').html(data[0].parts['download-requests'][0]['download-request'].status.$);
      var time = data[0].parts['status-history']['state-transitions'][0]['state-transition']['effective-date-time'];
      var timezone = getUTCTimezone();
      $('#swap_time').html((new Date(time)).format("dd/mm/yyyy, HH:MM") + ' ' + timezone);
  }
 }).fail(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
      msisdMatchStatus = 0;
      sessionStorage.setItem('msisdnDB', 'unmatched');
      if (!confirm) {
        $("#txt_confirm1").attr("placeholder", "");
      } else {
        $('.successAlert').css('display', 'none');
        $("#txt_confirm1").attr("placeholder", confirm);
        $('#error_msisdn').css('display', 'none');
      }
    }
  });
}

function enableIssueEsimButton() {
	if($('#error_msisdn').is(':visible') || $('#error_eid').is(':visible') || $('#error_imei').is(':visible')) {
		$('#next').attr("disabled", "disabled");
		$("#next").addClass("btn_disabled");
	}else {
		$('#next').removeAttr('disabled');
		$("#next").removeClass("btn_disabled");
	}
}

function mapMsisdn() {
  var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.msisdnMap + icc;
  msisdnRequestJson.ids[0].$ = icc;
  msisdnRequestJson.parts['logical-resource'].msisdn = msisdnValue;
  msisdnRequestJson.parts['logical-resource'].eid = eid;
  msisdnRequestJson.parts['physical-resource'].imei = imei;
  $.ajax({
    method: "PUT",
    async: false,
    url: ajaxUrl,
    headers: {
	  'Authorization': localStorage.jwtToken,
	},
    data: JSON.stringify(msisdnRequestJson),
	contentType: sessionStorage.CSMContentType + '; charset=utf-8',
    dataType: "json",
    crossDomain: true,
  }).success(function(data, responseText, request) {
    matchingId = data.details['matching-id'];
    if (data !== undefined && matchingId != undefined) {
      confCode = data.details['confirmation-code'].$;
	  	smdpFQDN = data.details.smdpfqdn.replace(/:[0-9]*$/g, '');
      smdpFQDN = smdpFQDN.replace('https://', '');
      smdpFQDN = smdpFQDN.replace('http://', '');
      if(confirmationCodeMandatory){
				activationCode = 'LPA:' + codeVersion + delimeter + smdpFQDN + delimeter + data.details['matching-id'] + delimeter + delimeter + codeVersion;
			}else{
				activationCode = 'LPA:' + codeVersion + delimeter + smdpFQDN + delimeter + data.details['matching-id'];
			}
      if ($('#tx_msisd').val() && confirmationCodeMandatory == true && $('#tx_eid').val() == "") {
        $("#deviceDetails").css("display", "none");
        $("#confirmation").css("display", "block");
        $('#successMessageAlert').css('display', 'block');
        $(".wizard-stp .step:nth-child(1) .wizard-image").attr("src", "/img/WizardImages/GeteSIMcomplete.png");
        $(".wizard-stp .step:nth-child(3) .wizard-image").attr("src", "/img/WizardImages/DevicedetailsComplete.png");
        $(".wizard-stp .step:nth-child(5) .wizard-image").attr("src", "/img/WizardImages/ConfirmationcodeInprogress.png");
        $(".wizard-stp .progress-line:nth-child(2) .progress").addClass('completed');
        $(".wizard-stp .progress-line:nth-child(4) .progress").addClass('waiting');
        $('#pull_confirmation').css("display", "block");
        $('#push_confirmation').css("display", "none");
        $('#download-activate').css("display", "block");
        $('#download-finish').css("display", "none");
        $('.confirmationCode').css("background-image", "url('/img/Picture3.png')");
        $('.code').addClass("code_pull");
        $('#txt_confirm').addClass("txt_confirm_pull");
        $("#txt_confirm").attr("placeholder", confCode);
        $("#txt_confirm1").attr("placeholder", confCode);
        $('#actCode').css("display", "block");
        $("#activationText12").html(activationCode);
        $("#activationText6").html(activationCode);
        var qrcode = new QRCode(document.getElementById("qrcodeImage"), {width: 200, height: 200});
        qrcode.makeCode(activationCode);
      }
      //cc--> false, only msisdn
      else if ($('#tx_msisd').val() && confirmationCodeMandatory == false && $('#tx_eid').val() == "") {
        $("#deviceDetails").css("display", "none");
        $("#confirmation").css("display", "block");
        $('#successMessageAlert').css('display', 'block');
        $(".wizard-stp .step:nth-child(1) .wizard-image").attr("src", "/img/WizardImages/GeteSIMcomplete.png");
        $(".wizard-stp .step:nth-child(3) .wizard-image").attr("src", "/img/WizardImages/DevicedetailsComplete.png");
        $(".wizard-stp .step:nth-child(5) .wizard-image").attr("src", "/img/WizardImages/ConfirmationcodeInprogress.png");
        $(".wizard-stp .progress-line:nth-child(2) .progress").addClass('completed');
        $(".wizard-stp .progress-line:nth-child(4) .progress").addClass('waiting');
        $('#pull_confirmation').css("display", "none");
        $('#pullscenario2').css("display", "block");
        $('#push_confirmation').css("display", "none");
        $('#download-activate').css("display", "block");
        $('#download-finish').css("display", "none");
        $('.confirmationCode').css("display", "none");
        $('#downloadSimParapull2').css("display", "block");
        $('.code').addClass("code_pull");
        $('#txt_confirm').addClass("txt_confirm_pull");
        $('.simActivation').css("display", "none");
        $('.confirmationCodeHeight').css("margin-right", "-8px");
      }
      // cc-> true, msisdn+eid+auto check
      else if (confirmationCodeMandatory == true) {
        if ($('#tx_eid').val()) {
          $(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove();});
          $("#deviceDetails").css("display", "none");
          $("#confirmation").css("display", "block");
          $('#successMessageAlert').css('display', 'block');
          $(".wizard-stp .step:nth-child(1) .wizard-image").attr("src", "/img/WizardImages/GeteSIMcomplete.png");
          $(".wizard-stp .step:nth-child(3) .wizard-image").attr("src", "/img/WizardImages/DevicedetailsComplete.png");
          $(".wizard-stp .step:nth-child(5) .wizard-image").attr("src", "/img/WizardImages/ConfirmationcodeInprogress.png");
          $(".wizard-stp .progress-line:nth-child(2) .progress").addClass('completed');
          $(".wizard-stp .progress-line:nth-child(4) .progress").addClass('waiting');
          $('#push_confirmation').css("display", "block");
          $('#pull_confirmation').css("display", "none");
          $('#download-activate').css("display", "none");
          $('#download-activate2').css("display", "none");
          $('#download-finish').css("display", "block");
          $('.confirmationCode').css("background-image", "url('/img/Picture3.png')");
          $("#txt_confirm").attr("placeholder", confCode);
          $("#txt_confirm1").attr("placeholder", confCode);
          $('#actCode').css("display", "none");
          $("#activationText12").html(activationCode);
          $("#activationText6").html(activationCode);
          var qrcode = new QRCode(document.getElementById("qrcodeImage"), {
            width: 200,
            height: 200
          });
          qrcode.makeCode(activationCode);
          $(".wizard-stp .step:nth-child(5) .wizard-image").attr("src", "/img/WizardImages/ConfirmationcodeComplete.png");
          $(".wizard-stp .step:nth-child(7) .wizard-image").attr("src", "/img/WizardImages/ActivationcodeInprogress.png");
          $(".wizard-stp .progress-line:nth-child(2) .progress").addClass('completed');
          $(".wizard-stp .progress-line:nth-child(4) .progress").addClass('completed');
          $(".wizard-stp .progress-line:nth-child(6) .progress").addClass('waiting');
        }
      }
      //cc-> true, msisdn+eid+manual check
      else if (confirmationCodeMandatory == true) {
        if ($('#tx_eid').val()) {
          $(".modal-box, .modal-overlay").fadeOut(500, function() {
            $(".modal-overlay").remove();
          });
          $("#deviceDetails").css("display", "none");
          $("#confirmation").css("display", "block");
          $('#successMessageAlert').css('display', 'block');
          $(".wizard-stp .step:nth-child(1) .wizard-image").attr("src", "/img/WizardImages/GeteSIMcomplete.png");
          $(".wizard-stp .step:nth-child(3) .wizard-image").attr("src", "/img/WizardImages/DevicedetailsComplete.png");
          $(".wizard-stp .step:nth-child(5) .wizard-image").attr("src", "/img/WizardImages/ConfirmationcodeInprogress.png");
          $(".wizard-stp .progress-line:nth-child(2) .progress").addClass('completed');
          $(".wizard-stp .progress-line:nth-child(4) .progress").addClass('waiting');
          $('#pull_confirmation').css("display", "block");
          $('#push_confirmation').css("display", "none");
          $('#download-activate').css("display", "block");
          $('#download-finish').css("display", "none");
          $('.confirmationCode').css("background-image", "url('/img/Picture3.png')");
          $('.code').addClass("code_pull");
          $('#txt_confirm').addClass("txt_confirm_pull");
          $("#txt_confirm").attr("placeholder", confCode);
          $("#txt_confirm1").attr("placeholder", confCode);
          $('#actCode').css("display", "block");
          $('.confirmationCodeHeight').css("margin-right", "-8px");
          $("#activationText12").html(activationCode);
          $("#activationText6").html(activationCode);
          var qrcode = new QRCode(document.getElementById("qrcodeImage"), {
            width: 200,
            height: 200
          });
          qrcode.makeCode(activationCode);
        }
      }
      // cc-> false, msisdn+eid+auto check
      else if (confirmationCodeMandatory == false) {
        if ($('#tx_eid').val()) {
          $(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove();});
          $("#deviceDetails").css("display", "none");
          $("#confirmation").css("display", "block");
          $('#successMessageAlert').css('display', 'block');
          $(".wizard-stp .step:nth-child(1) .wizard-image").attr("src", "/img/WizardImages/GeteSIMcomplete.png");
          $(".wizard-stp .step:nth-child(3) .wizard-image").attr("src", "/img/WizardImages/DevicedetailsComplete.png");
          $(".wizard-stp .step:nth-child(5) .wizard-image").attr("src", "/img/WizardImages/ConfirmationcodeInprogress.png");
          $(".wizard-stp .progress-line:nth-child(2) .progress").addClass('completed');
          $(".wizard-stp .progress-line:nth-child(4) .progress").addClass('waiting');
          $('#pushscenario2').css("display", "block");
          $('#push_confirmation').css("display", "none");
          $('#pull_confirmation').css("display", "none");
          $('#download-activate').css("display", "none");
          $('#download-finish').css("display", "block");
          $('.confirmationCode').css("display","none");
          $('.simActivation').css("display", "none");
        }
      }
      // cc-> false, msisdn+eid+manual check
      else if (confirmationCodeMandatory == false) {
        if ($('#tx_eid').val()) {
          $(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove();});
          $("#deviceDetails").css("display", "none");
          $("#confirmation").css("display", "block");
          $('#successMessageAlert').css('display', 'block');
          $(".wizard-stp .step:nth-child(1) .wizard-image").attr("src", "/img/WizardImages/GeteSIMcomplete.png");
          $(".wizard-stp .step:nth-child(3) .wizard-image").attr("src", "/img/WizardImages/DevicedetailsComplete.png");
          $(".wizard-stp .step:nth-child(5) .wizard-image").attr("src", "/img/WizardImages/ConfirmationcodeInprogress.png");
          $(".wizard-stp .progress-line:nth-child(2) .progress").addClass('completed');
          $(".wizard-stp .progress-line:nth-child(4) .progress").addClass('waiting');
          $('#pull_confirmation').css("display", "none");
          $('#pullscenario2').css("display", "block");
          $('#push_confirmation').css("display", "none");
          $('#download-activate').css("display", "block");
          $('#download-activate2').css("display", "none");
          $('#download-finish').css("display", "none");
          $('.confirmationCode').css("display", "none");
          $('#downloadSimParapull2').css("display", "block");
          $('.code').addClass("code_pull");
          $('#txt_confirm').addClass("txt_confirm_pull");
          $('.simActivation').css("display", "none");
          $('.confirmationCodeHeight').css("margin-right", "-8px");
        }
      }
    } else {
      confCode = request.getResponseHeader('X-ResultStatus-Confirmation_Code');
      activationCode = request.getResponseHeader('X-ResultStatus-Activation_Code');
      $('#actCode').css("display", "block");
      $(".modal-box, .modal-overlay").fadeOut(500, function() {$(".modal-overlay").remove();});
      $("#deviceDetails").css("display", "none");
      $("#confirmation").css("display", "block");
      $('#successMessageAlert').css('display', 'block');
      $(".wizard-stp .step:nth-child(1) .wizard-image").attr("src", "/img/WizardImages/GeteSIMcomplete.png");
      $(".wizard-stp .step:nth-child(3) .wizard-image").attr("src", "/img/WizardImages/DevicedetailsComplete.png");
      $(".wizard-stp .step:nth-child(5) .wizard-image").attr("src", "/img/WizardImages/ConfirmationcodeInprogress.png");
      $(".wizard-stp .progress-line:nth-child(2) .progress").addClass('completed');
      $(".wizard-stp .progress-line:nth-child(4) .progress").addClass('waiting');
      $('#push_confirmation').css("display", "none");
      $('#pull_confirmation').css("display", "block");
      $('#download-activate').css("display", "none");
      $('#download-activate2').css("display", "none");
      $('#download-finish').css("display", "block");
      $('.confirmationCode').css("background-image", "url('/img/Picture3.png')");
      $("#txt_confirm").attr("placeholder", confCode);
      $("#txt_confirm1").attr("placeholder", confCode);
      $("#activationText12").html(activationCode).css("word-wrap", "break-word");
      $("#activationText6").html(activationCode).css("word-wrap", "break-word");
      var qrcode = new QRCode(document.getElementById("qrcodeImage"), {
        width: 200,
        height: 200
      });
      qrcode.makeCode('{"activationVoucher":' + activationCode + '}');
      $("#actCode").hide();
      $(".wizard-stp .step:nth-child(5) .wizard-image").attr("src", "/img/WizardImages/ConfirmationcodeComplete.png");
      $(".wizard-stp .step:nth-child(7) .wizard-image").attr("src", "/img/WizardImages/ActivationcodeInprogress.png");
      $(".wizard-stp .progress-line:nth-child(2) .progress").addClass('completed');
      $(".wizard-stp .progress-line:nth-child(4) .progress").addClass('completed');
      $(".wizard-stp .progress-line:nth-child(6) .progress").addClass('waiting');
    }
	}).error(function(request, textStatus, errorThrown) {
      if(request.status === 0 && !localStorage.jwtToken) {
        logoutClient();
      }else {
		$('#timeout_error_scenario').empty();
		if(request.status === 504 || request.status === 0){
		  $('#timeout_error_scenario').attr('data-i18n','translation.RequestTimeOut');
		  $('#error_timeout').css('display', 'block');
		  $('#error_imei').css('display', 'none');
		} else if(request.status === 500) {
			$('#timeout_error_scenario').attr('data-i18n','translation.dbFailure');
			$('#error_timeout').css('display', 'block');
		    $('#error_imei').css('display', 'none');
		} else {
		  var errorMessage = request.responseJSON.failures[0];
		  if(request.status === 404 && errorMessage.code == "RequestTimeOut"){
		    $('#timeout_error_scenario').attr('data-i18n','translation.RequestTimeOut');
		    $('#error_timeout').css('display', 'block');
		    $('#error_imei').css('display', 'none');
		  } else if(request.status === 404 && (errorMessage.code == "ServerUnreachable")){
		    $('#timeout_error_scenario').attr('data-i18n','translation.ServerUnreachable');
		    $('#error_timeout').css('display', 'block');
		    $('#error_imei').css('display', 'none');
		  } else {
		    $('#timeout_error_scenario').attr('data-i18n', 'translation.'+errorMessage.code.replace(/\./g, '_'));
		    $('#error_timeout').css('display', 'block');
		    $('#error_imei').css('display', 'none');
		  }
	    }
	    $('.successAlert').css('display', 'none');
        $('#next').attr('disabled', 'disabled').addClass('btn_disabled');
	    translationi18();
	  }
	});
}
$("#finish").click(function() {
    $("#confirmation").css("display", "none");
    $("#finalconfirmation").css("display", "none");
    $("#finishActivation").css("display", "block");
    $('#successMessageFinish').css('display', 'block');
    $(".wizard-stp .step:nth-child(5) .wizard-image").attr("src", "/img/WizardImages/ConfirmationcodeComplete.png");
    $(".wizard-stp .progress-line:nth-child(4) .progress").addClass('completed');
  });

$("#tx_msisd").keyup(function(data1) {
  $("#error_timeout").css("display","none");
  if ($(this).val() != "") {} else if ($(this).val().trim() == "") {
    $("#next").attr("disabled", "disabled");
  }
});

$("#tx_imei,#tx_eid").keyup(function() {
	$("#error_timeout").css("display","none");
});

//swap functionality code
$("#sim_swap_proceed").click(function() {
    $(".modal-box, .modal-overlay").fadeOut(0, function() {
      $(".modal-overlay").remove();
    });
    msisdMatchStatus = 0;
    $("#next").click();
  });

$("#download-finish1").click(function() {
    $(".push2-finish").removeClass("btn_disabled");
  });
$("#sim_swap_cancel").click(function() {
  $(".modal-box, .modal-overlay").fadeOut(500, function() {
    $(".modal-overlay").remove();
  });
});
$('#backToHome').click(function() {
  sessionStorage.setItem('icc', '');
  icc = '';
  iccidValue = '';
  sessionStorage.setItem('msisdnValue', '');
});

function getUTCTimezone() {
  var d = new Date();
  var n = d.getTimezoneOffset();
  var sign = n && n / Math.abs(n);
  if (sign < 0) prefix = '+';
  else prefix = '-';
  return ('UTC ' + prefix + Math.floor(Math.abs(n) / 60) + ':' + (Math.abs(n) % 60));
}

function getTimezone() {
  var d = new Date();
  var n = d.getTimezoneOffset();
  var sign = n && n / Math.abs(n);
  if (sign < 0) prefix = '+';
  else prefix = '-';
  return (prefix + '' + Math.abs(n));
}

function convertData(data) {
  const byteString = atob(data);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ia], {
    type: 'application/pdf',
  });
  return blob;
}

function handoutAjaxCall(pdfType) {
  var pdfAjax = sessionStorage.handoutAjax.replace('{iccidValue}', sessionStorage.icc);
  pdfAjax = pdfAjax.replace('{pdfName}', pdfType);
  pdfAjax += getTimezone();
  return $.ajax({
    method: 'GET',
    url: sessionStorage.gatewayurl + pdfAjax,
    headers: {
      Authorization: localStorage.jwtToken,
    },
    crossDomain: true,
    dataType: 'json',
    timeout: 10000,
  });
}

function pdfDownloadFailure() {
  $('#pdf_download_error').css('display', 'block');
  $('#successMessageAlert').css('display', 'none');
  $('#alertTitle3_error').attr('data-i18n', 'errorTranslation.handouts_error');
  errori18();
}

function pdfDownloadSuccess() {
  $('#finish').removeAttr('disabled');
  $('#finish').removeClass('btn_disabled');
  $('#pdf_download_error').css('display', 'none');
  $('#confirmationAlertText').html('<span class="newSubAlertText confirmationDownload" id="subTextAlert"></span>');
  $('#subTextAlert').attr('data-i18n', '[html]translation.successfullyDownload');
  translationi18();
}

$('#download-activate2').click(function () {
  $.when(handoutAjaxCall('Activation'), handoutAjaxCall('Confirmation'), handoutAjaxCall('SimParameter'))
  .done(function (activationData, confirmationData, simParameterData) {
    const data = { 'Activation-': activationData[0], 'Confirmation-': confirmationData[0], 'SimParameter-': simParameterData[0] };
    for (var obj in data) {
      if (base64regex.test(data[obj])) {
        saveAs(convertData(data[obj]), obj + msisdnValue + '.pdf');
      } else {
        pdfDownloadFailure();
      }
    }
    pdfDownloadSuccess();
  })
  .fail(function () {
    pdfDownloadFailure();
  });
});

$('#download-finish').click(function () {
  $.when(handoutAjaxCall('Confirmation'), handoutAjaxCall('SimParameter'))
  .done(function (confirmationData, simParameterData) {
    const data = { 'Confirmation-': confirmationData[0], 'SimParameter-': simParameterData[0] };
    for (var obj in data) {
      if (base64regex.test(data[obj])) {
        saveAs(convertData(data[obj]), obj + msisdnValue + '.pdf');
      } else {
        pdfDownloadFailure();
      }
    }
    pdfDownloadSuccess();
  })
  .fail(function () {
    pdfDownloadFailure();
  });
});
