var propertiesFile = "/properties/leap_properties.json";
var ajaxUrlFile = "/properties/leap_ajax_urls.json";
var msisdnValue;
var imei = ' ';
var msisdMatchStatus = 0;
var confirmationCodeMandatory;
var callingGemalto;
var validEID;
var asc; // variable for sorting functionality

function AutherizedJwt() {
  var jwtToken = readCookie('jwtToken');
  var pagename = window.location.pathname;
  if (jwtToken === '' && pagename.indexOf('Login.html') < 0 && pagename !== '/') {
    window.location.href = "/";
  } else if (jwtToken && pagename === '/') {
    window.location.href = "html/homepage.html";
  }
}
AutherizedJwt();

//function to get all roles and its associated data to show & hide div on page
function pages() {
  var pagename = window.location.pathname;
  var parts = pagename.split('/');
  parts[2];
  var userRoleStr = sessionStorage.getItem('role');
  /* Changes for different roles for access starts*/
  if (userRoleStr.indexOf(sessionStorage.groupAdminRole) > -1 && parts[2] === 'Admin.html') {
    $("#admin-second-row").removeClass("homeTabContainer");
    $("#reportingTab").addClass("col-sm-offset-3 col-md-offset-3 col-lg-offset-3");
  }
  if (userRoleStr.indexOf(sessionStorage.contentManagerRole) > -1 && parts[2] === 'Admin.html') {
    $("#admin_settings").addClass("col-sm-offset-3 col-md-offset-3 col-lg-offset-3");
    $("#admin-second-row").removeClass("homeTabContainer");
  }
  if (userRoleStr.indexOf(sessionStorage.systemAdminRole) > -1 && parts[2] === 'Admin.html') {
    $("#userAccessTab").removeClass("beg-col").addClass("col-sm-offset-3 col-md-offset-3 col-lg-offset-3");
    $("#admin-second-row").removeClass("homeTabContainer");
  }
  if (userRoleStr.indexOf(sessionStorage.countryAdminRole) > -1 && parts[2] === 'Admin.html') {
    $("#admin_settings").addClass("col-sm-offset-3 col-md-offset-3 col-lg-offset-3");
    $("#admin-second-row").removeClass("homeTabContainer");
  }
  if (userRoleStr.indexOf(sessionStorage.simAdminRole) > -1 && userRoleStr.indexOf(sessionStorage.groupAdminRole) > -1 && parts[2] === 'Admin.html') {
    $("#admin-second-row").addClass("homeTabContainer");
    $("#admin_settings").addClass("col-sm-offset-3 col-md-offset-3 col-lg-offset-3");
    $("#reportingTab").removeClass("col-sm-offset-3 col-md-offset-3 col-lg-offset-3");
  } else if (userRoleStr.indexOf(sessionStorage.simAdminRole) > -1 && parts[2] === 'Admin.html') {
    $("#admin_settings").addClass("col-sm-offset-3 col-md-offset-3 col-lg-offset-3");
  }

  Promise.resolve(() => {
    $("#setting").css('display', 'block');
  })
  /* Changes for different roles for access ends*/
  // var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.PagesAjax + parts[2];
  // $.ajax({
  //   method: "GET",
  //   async: false,
  //   headers: {
  //     'Authorization': localStorage.jwtToken,
  //   },
  //   url: ajaxUrl,
  //   jsonpCallback: 'jsonCallback',
  //   dataType: "json",
  //   crossDomain: true,
  // }).done(function(data) {
  //   if (data.length !== 0) {
  //     for (var i in data) {
  //       $("#" + data[i].FUNCTIONALITY).css('display', 'block');
  //     }
  //   }
  // }).fail(function() {
  //   window.location.href = "/";
  // });
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(cname, cvalue, validityInHrs) {
  var d = new Date();
  // validityInHrs is in no. of hours after which the cookie should expire
  d.setTime(d.getTime() + (validityInHrs * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/html/";
}

function getProfileData() {
  Promise.resolve(() => {
    sessionStorage.setItem("userName", 'carter');
      sessionStorage.setItem("role", 'simAdministrator');
      sessionStorage.setItem("country", 'vodafonede');
      sessionStorage.setItem("operatorName", 'vodafonede');
      pages();
  })

  // var ajaxUrl = 'http://localhost/authenticate/authorize'//sessionStorage.gatewayurl + sessionStorage.profileDataAjax;
  // $.ajax({
  //   method: "GET",
  //   async: false,
  //   headers: {
  //     'Authorization': localStorage.jwtToken,
  //   },
  //   url: ajaxUrl,
  //   dataType: "json",
  // }).done(function(data) {
  //   if (data.length !== 0) {
  //     var userName = data[0].uname;
  //     var channel = data[0].channel;
  //     var country = data[0].country;
  //     var role = data[0].role;
  //     var operatorName = data[0].operatorName;
  //     sessionStorage.setItem("userName", userName);
  //     sessionStorage.setItem("channel", channel);
  //     sessionStorage.setItem("role", role);
  //     sessionStorage.setItem("country", country);
  //     sessionStorage.setItem("operatorName", operatorName);
  //     pages();
  //   }
  // }).fail(function() {
  //   window.location.href = "/";
  // });
}

function getJwtToken(username, password) {
  var authParam = {
    "username": username,
    "password": password
  };
  var ajaxUrl = 'http://localhost/authenticate/' + sessionStorage.authenticateAjax;
  $.ajax({
    method: "POST",
    contentType: "application/json",
    url: ajaxUrl,
    data: JSON.stringify(authParam),
	dataType: 'text',
  }).success(function(data, responseText, request) {
    var rejwtTokens = request.getResponseHeader('x-vf-jwt');
    setCookie('jwtToken', rejwtTokens, sessionStorage.cookieExpiryInHrs);
	localStorage.setItem('jwtToken', rejwtTokens);
    window.location.href = "/html/homepage.html";
  }).error(function(request, textStatus, errorThrown) {
    if (request.status === 401) {
      sessionStorage.setItem('loginAuth', 'Unauthorized');
    }
    window.location.href = "/";
  });
}

$(document).ready(function() {
  var height = Math.max($("#ready_profile").height(), $("#download_profile").height());
  $("#ready_profile").height(height);
  $("#download_profile").height(height);

  var height1 = Math.max($("utilized_profile_graph1").height(), $("utilized_profile_graph2").height());
  $("utilized_profile_graph1").height(height1);
  $("utilized_profile_graph2").height(height1);

  $("#acc-col-1-fre").css('pointer-events', 'none');
  $("#rep_days").css('pointer-events', 'none');
  $("#Rep_date").css('pointer-events', 'none');
  $("#Rep_time").css('pointer-events', 'none');
  $("#prof_placeholder_opt").css('pointer-events', 'none');
  $("#thrshld_days").css('pointer-events', 'none');
  $("#Report_frequency_opt").css('pointer-events', 'none');
  $("#Rep_date_1").css('pointer-events', 'none');
  $("#Rep_time_1").css('pointer-events', 'none');
  $("#Rep_time_2").css('pointer-events', 'none');
  $("#Rep_time_1").hide();
  $('table#subscription_table td.plus_minus_pos').each(function(index) {
    $(this).find('img').attr('id', 'tred' + index);
  });

  var pagename = window.location.pathname;
  var parts = pagename.split('/');
  if ((parts.length > 2) && (pagename.indexOf("/Login.html") == -1)) {
      getProfileData();
      pages();
  }
  if (sessionStorage.getItem('loginAuth')) {
    $('#pullalert2').attr('data-i18n', 'translation.invalid_user');
    $('#login-err').css('display', 'block');
    translationi18();
  }
  sessionStorage.removeItem('loginAuth');
  $('#logoutclient').click(function(e) {
    e.preventDefault();
    sessionStorage.clear();
    localStorage.clear();
    document.cookie = 'jwtToken=' + '' + '; Path=/html/;';
    document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    location.href = '/';
  });
  $("#acc-col-1-fre").css('pointer-events', 'none');
  $("#rep_days").css('pointer-events', 'none');
  $("#Rep_date").css('pointer-events', 'none');
  $("#Rep_time").css('pointer-events', 'none');
  $("#prof_placeholder_opt").css('pointer-events', 'none');
  $("#thrshld_days").css('pointer-events', 'none');
  $("#Report_frequency_opt").css('pointer-events', 'none');
  $("#Rep_date_1").css('pointer-events', 'none');
  $("#Rep_time_1").css('pointer-events', 'none');
  $("#Rep_time_2").css('pointer-events', 'none');
  $("#csv-radio").css('pointer-events', 'none');
  $("#xml-radio").css('pointer-events', 'none');
  $("#both-radio").css('pointer-events', 'none');
  $("#XML").css('pointer-events', 'none');
  $("#CSV").css('pointer-events', 'none');
  $("#both").css('pointer-events', 'none');

  /*Bar-code functionality Starts*/
  $('#imei-scan').click(function() {
    $('#interactive').toggle();
    $('#stop_eid_scan').css('display', 'none');
    if ($('#interactive').css('display', 'block')) {
      $('#qr-canvas').css('display', 'none');
      var App = {
        init: function() {
          Quagga.init(this.state, function(err) {
            if (err) {
              return;
            }
            App.attachListeners();
            Quagga.start();
          });
        },
        attachListeners: function() {
          var self = this;
          $('.controls .reader-config-group').on('change', 'input, select', function(e) {
            e.preventDefault();
            var $target = $(e.target),
              value = $target.attr('type') === 'checkbox' ? $target.prop('checked') : $target.val(),
              name = $target.attr('name'),
              state = self._convertNameToState(name);
            self.setState(state, value);
          });
        },
        _accessByPath: function(obj, path, val) {
          var parts = path.split('.'),
            depth = parts.length,
            setter = (typeof val !== 'undefined') ? true : false;
          return parts.reduce(function(o, key, i) {
            if (setter && (i + 1) === depth) {
              o[key] = val;
            }
            return key in o ? o[key] : {};
          }, obj);
        },
        _convertNameToState: function(name) {
          return name.replace('_', '.').split('-').reduce(function(result, value) {
            return result + value.charAt(0).toUpperCase() + value.substring(1);
          });
        },
        detachListeners: function() {
          $('.controls').off('click', 'button.stop');
          $('.controls .reader-config-group').off('change', 'input, select');
        },
        setState: function(path, value) {
          var self = this;
          if (typeof self._accessByPath(self.inputMapper, path) === 'function') {
            value = self._accessByPath(self.inputMapper, path)(value);
          }
          self._accessByPath(self.state, path, value);
          App.detachListeners();
          Quagga.stop();
          App.init();
        },
        inputMapper: {
          inputStream: {
            constraints: function(value) {
              var values = value.split('x');
              return {
                width: parseInt(values[0]),
                height: parseInt(values[1]),
                facing: 'environment'
              }
            }
          },
          numOfWorkers: function(value) {
            return parseInt(value);
          },
          decoder: {
            readers: function(value) {
              return [value + '_reader'];
            }
          }
        },
        state: {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              width: 320,
              height: 240,
              facing: 'environment' // or user
            }
          },
          locator: {
            patchSize: 'medium',
            halfSample: true
          },
          numOfWorkers: 4,
          decoder: {
            readers: ['code_128_reader']
          },
          locate: true
        },
        lastResult: null
      };
      App.init();
      Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
          drawingCanvas = Quagga.canvas.dom.overlay;
      });
      Quagga.onDetected(function(result) {
        var code = result.codeResult.code;
        if (App.lastResult !== code) {
          $('#tx_imei').val(code);
          validationImei();
          imei = code;
          sessionStorage.setItem('imei', code);
		  $('#stop_imei_scan').css('display', 'none');
          Quagga.stop();
          $('#interactive').css('display', 'none');
        }
      });
    }
  });
  $('#stop_imei_scan').click(function() {
    $('#stop_imei_scan').css('display', 'none');
    $('#stop_imei_scan1').css('display', 'none');
    $('#interactive').css('display', 'none');
    $('#stop_eid_scan').css('display', 'none');
  });
  $('#stop_imei_scan1').click(function() {
    $('#stop_imei_scan').css('display', 'none');
    $('#stop_imei_scan1').css('display', 'none');
    $('#interactive').css('display', 'none');
    $('#stop_eid_scan').css('display', 'none');
  });
  /*Bar-code functionality Ends*/
  $.getJSON(propertiesFile, function(data) {
    sessionStorage.gatewayurl = data.gatewayURL;
    sessionStorage.clientId = data.clientId;
    sessionStorage.operator = data.operator;
    callingGemalto = data.callingGemalto;
    if (callingGemalto == false) {
      confirmationCodeMandatory = data.confirmationCodeMandatory;
    }
    localStorage.searchDropdown = data.searchDropdown
    sessionStorage.msisdnRegex = data['pattern' + sessionStorage.country];
    sessionStorage.basicAuth = data.basicAuth;
    sessionStorage.groupAdminRole = data.groupAdminRole;
    sessionStorage.simAdminRole = data.simAdminRole;
    sessionStorage.countryAdminRole = data.countryAdminRole;
    sessionStorage.contentManagerRole = data.contentManagerRole;
    sessionStorage.systemAdminRole = data.systemAdminRole;
    sessionStorage.reportNameLowSIM = data.reportNameLowSIM;
    sessionStorage.reportInstantMail = data.reportInstantMail;
    sessionStorage.duplicateEmail = data.duplicateEmail;
    sessionStorage.duplicateMultipleEmail = data.duplicateMultipleEmail;
    sessionStorage.nine = data.batchRunTime.nine;
    sessionStorage.seventeen = data.batchRunTime.seventeen;
    sessionStorage.daily = data.frequencyType.daily;
    sessionStorage.Daily = data.frequencyType.Daily;
    sessionStorage.monthly = data.frequencyType.monthly;
    sessionStorage.weekly = data.frequencyType.weekly;
    sessionStorage.flagTrue = data.flag.true;
    sessionStorage.flagFalse = data.flag.false;
    sessionStorage.csv = data.format.csv;
    sessionStorage.xml = data.format.xml;
    sessionStorage.reportFileUpload = data.reportFileUpload;
    sessionStorage.cookieExpiryInHrs = data.cookieExpiryInHrs;
	sessionStorage.fileUploadSize = data.fileUploadSize;
    sessionStorage.CSMContentType = data.CSMContentType;
	sessionStorage.regexSubscriptionType = data.regexSubscriptionType;
  sessionStorage.dateRegex = data.dateRegex;
  });
  $.getJSON(ajaxUrlFile, function(data) {
    sessionStorage.viewconfigReport = data.viewReportConfig;
    sessionStorage.simUpload = data.simUpload;
    sessionStorage.msisdnSearch = data.msisdnSearch;
    sessionStorage.iccidSearch = data.iccidSearch;
    sessionStorage.simGraph = data.simGraph;
    sessionStorage.reports = data.reports;
    sessionStorage.subscriptionTypeDropDownUrl = data.subscriptionTypeDropDownUrl;
    sessionStorage.profileTypeDropDownUrl = data.profileTypeDropDownUrl;
    sessionStorage.countryDropDownUrl = data.countryDropDownUrl;
    sessionStorage.simCompanyDropDownUrl = data.simCompanyDropDownUrl;
    sessionStorage.channelDropDownUrl = data.channelDropDownUrl;
    sessionStorage.deviceDropDownUrl = data.deviceDropDownUrl;
    sessionStorage.statusDropDownUrl = data.statusDropDownUrl;
    sessionStorage.lowSimViewAjax = data.lowSimViewAjax;
    sessionStorage.subscriptionTypeAjax = data.subscriptionTypeAjax;
    sessionStorage.viewReportingAjax = data.viewReportingAjax;
    sessionStorage.updateReportingAjax = data.updateReportingAjax;
    sessionStorage.lowSimUpdateAjax = data.lowSimUpdateAjax;
    sessionStorage.updateEmailIdAjax = data.updateEmailIdAjax;
    sessionStorage.viewFailureAjax = data.viewFailureAjax;
    sessionStorage.updateEmailidAjax = data.updateEmailidAjax;
    sessionStorage.addNewMailAjax = data.addNewMailAjax;
    sessionStorage.reserveICCIDAjax = data.reserveICCIDAjax;
    sessionStorage.msisdnMap = data.msisdnMap;
	sessionStorage.handoutAjax = data.handoutAjax;
    sessionStorage.authenticateAjax = data.authenticateAjax;
    sessionStorage.profileDataAjax = data.profileDataAjax;
    sessionStorage.PagesAjax = data.PagesAjax;
    sessionStorage.failureReportUrl = data.failureReportUrl;
    sessionStorage.managedSubscriptionsAjax = data.managedSubscriptionsAjax;
    sessionStorage.managedSubProfileAjax = data.managedSubProfileAjax;
    sessionStorage.iccidGraphUtilityAjax = data.iccidGraphUtilityAjax;
    sessionStorage.managedSubProfileValAjax = data.managedSubProfileValAjax;
    sessionStorage.zipshiftAjax = data.zipshiftAjax;
    sessionStorage.zipuploadAjax = data.zipuploadAjax;
    sessionStorage.templatepreviewAjax = data.templatepreviewAjax;
    sessionStorage.updateFlagAjax = data.updateFlagAjax;
    sessionStorage.downloadfileAjax = data.downloadfileAjax;
	sessionStorage.cancelOrderUrl = data.cancelOrderUrl;
  });

  /*Internationalization Code*/
  if (window.navigator.userLanguage) {
    language_complete = window.navigator.userLanguage.split("-");
  } else {
    language_complete = window.navigator.language.split("-");
  }
  language = (language_complete[0]);
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  var today = dd + '/' + mm + '/' + yyyy;
  //To append dynamically the username and year of footer
  $('.dynamicYear').html('&copy; &nbsp;' + yyyy + '&nbsp;');
  $('.login_name').html(sessionStorage.getItem('userName'));
  $('.welcome_name').html(sessionStorage.getItem('userName'));
  $('#simStatDate').html(today);
  $('#oval-sim-stock-date').html(today);

  /* Internationalization code starts */
  if (sessionStorage.lang == undefined || sessionStorage.lang == null || sessionStorage.lang == '') {
    sessionStorage.setItem('lang', 'en');
  }
  translationi18();
  errori18();

  $('.languageSelector .cs-option').click(
    function() {
      var pagename = window.location.pathname;
      var parts = pagename.split('/');
      $(this).parent().prev('.cs-placeholder').children('.cs-title').text($(this).text());
      $(this).parent().hide();
      $(this).parent().prev('.cs-placeholder').children('.cs-arrow-up').hide();
      $(this).parent().prev('.cs-placeholder').children('.cs-arrow-dn').show();
      var option = $(this).attr('data-value');
      var value = $(this).parents('.cs-options').next().children('.topnav_lbl:nth-child(' + option + ')').val();
      options = {
        lng: value,
        resGetPath: '/locales/' + value + '/translation.json'
      };
      i18n.init(options, function() {
		var defaultOptions = {defaultValue: i18n.t('translation.unknownError')};
        // save to use translation function as resources are fetched
        $('.translation').i18n(defaultOptions);
      });
      var langErrorOptions = {
        lng: value,
        resGetPath: '/locales/' + value + '/error_msg.json'
      };
      i18n.init(langErrorOptions, function() {
		// save to use translation function as resources are fetched
        $('.errorTranslation').i18n();
      });
      sessionStorage.setItem("lang", value);
      if (parts[2] === 'ReportingSection.html' || parts[2] === 'Settings_Configuration.html') {
        if (value == "en") {
		  $("span.css-switch-label").addClass("eng-class").removeClass("de-class nl-class");
          enCalendar();
        } else if (value == "de") {
		  $("span.css-switch-label").addClass("de-class").removeClass("eng-class nl-class");
          deCalendar();
        } else if (value == "nl") {
		  $("span.css-switch-label").addClass("nl-class").removeClass("de-class eng-class");
          nlCalendar();
        }
      }
    });
  /* Internationalization code ends */
});

var winHeight = $(window).height();
var pathname = window.location.pathname.split('/');
if ((pathname[pathname.length - 1] == "Reporting.html") || (pathname[pathname.length - 1] == "Settings_Configuration.html") || (pathname[pathname.length - 1] ==
    "ReportingSection.html")) {
  $(".wrapper").css("min-height", "746px");
 }

/* menu - for pipe bg */
$(".menu_item")
  .mouseover(
    function() {
      $(this)
        .prev()
        .css("background",
          "-webkit-linear-gradient(right, rgb(189, 0, 0),rgb(189, 0, 0),rgb(230, 0, 0))");
      $(this)
        .next()
        .css("background",
          "-webkit-linear-gradient(right,rgb(230, 0, 0),rgb(189, 0, 0), rgb(189, 0, 0))");
    }).mouseout(function() {
    if ($(this).hasClass("active")) {} else {
      $(this).prev().css("background", "none");
      $(this).next().css("background", "none");
    }
  });
$("#admin").mouseover(function() {
  $(".secondary-menu").show();
  $(this).css("background-color", "rgb(244, 244, 244)");
  $("#adminHover").css("color", "black");
  $("#menu_admin").attr('src', '/img/human-black-new.png');
  $("#drop-arrow").attr('src', '/img/black-arrow.png');
}).mouseout(function() {
  $(".secondary-menu").hide();
  $("#adminHover").css("color", "white");
  $(this).css("background-color", "#E60000");
  $("#menu_admin").attr('src', '/img/Human-black-white-new.png');
  $("#drop-arrow").attr('src', '/img/white-arrow.png');
});
$(".secondary-menu").mouseover(function() {
  $(".secondary-menu").show();
  $("#admin").css("background-color", "rgb(244, 244, 244)");
  $("#menu_admin").attr('src', '/img/human-black-new.png');
  $("#drop-arrow").attr('src', '/img/black-arrow.png');
  $("#adminHover").css("color", "black");
}).mouseout(function() {
  $(".secondary-menu").hide();
  $("#admin").css("background-color", "#E60000");
  $("#adminHover").css("color", "white");
  $("#menu_admin").attr('src', '/img/Human-black-white-new.png');
  $("#drop-arrow").attr('src', '/img/white-arrow.png');
});

function setVisibility(id, visibility) {
  document.getElementById(id).style.display = visibility;
}

function hideVisibility(id, visibility) {
  document.getElementById(id).style.display = visibility;
}

// change the color of the menu elements to dark red on focus
if ($(".breadcrumb").attr('id') == "homepage") {
  $("#home").addClass('active').siblings().removeClass('active');
  $("#home").prev()
    .css("background",
      "-webkit-linear-gradient(right, rgb(189, 0, 0),rgb(189, 0, 0),rgb(230, 0, 0))");
  $("#home").next()
    .css("background",
      "-webkit-linear-gradient(right,rgb(230, 0, 0),rgb(189, 0, 0), rgb(189, 0, 0))");
}
if ($(".breadcrumb").attr('id') == "sub") {
  $("#new").addClass('active').siblings().removeClass('active');
  $("#new").prev()
    .css("background",
      "-webkit-linear-gradient(right, rgb(189, 0, 0),rgb(189, 0, 0),rgb(230, 0, 0))");
  $("#new").next()
    .css("background",
      "-webkit-linear-gradient(right,rgb(230, 0, 0),rgb(189, 0, 0), rgb(189, 0, 0))");
}
if ($(".breadcrumb").attr('id') == "servicePortal") {
  $("#service").addClass('active').siblings().removeClass('active');
}
if ($(".breadcrumb").attr('id') == "adminPortal") {
  $("#admin").addClass('active').siblings().removeClass('active');
}
$(".fm-error").each(function() {
  var width = $(this).next().outerWidth();
  width = width - 2;
  $(this).width(width);
});
$(".check-label").click(function() {
  $(this).toggleClass("check-checked");
});
$(".radio-label").click(function() {
  var isClicked = $('#low_note_edit_report').data('clicked');
  if (!$(this).hasClass("radio-checked")) {
    $(".radio-label").toggleClass("radio-checked");
    var radioName = $(this).prev().attr('name');
    var linkedip = $(this).attr('for');
    $("#" + linkedip).attr('checked', 'checked');
    $(".radioInput").not("#" + linkedip).removeAttr('checked');
    $(".radio-label").not(this).each(function() {
      if ($(this).prev().attr('name') == radioName) {
        $(this).removeClass("radio-checked");
      }
    });
  }
  if(linkedip === 'iccid-radio') {
	  $("#iccid-radio").trigger("click");
  }else if(linkedip === 'msisdn-radio') {
	  $("#msisdn-radio").trigger("click");
  }
});

$(".cs-placeholder").click(function() {
  if ($(this).hasClass("cs-disabled")) {} else {
    $(".cs-option-ul").not($(this).next()).hide();
    $(".cs-arrow-dn").not($(this).children()).show();
    $(".cs-arrow-up").not($(this).children()).hide();
    $(this).next(".cs-option-ul").toggle();
    $(".available_profile-tt,.utilized_profile-tt,.ready_profile-tt,.download_profile-tt").css('display', 'none');
  }
});

$("#username,#password").keyup(function(data1) {
  if (($("#username").val() != "") && ($("#password").val() != "")) {
    $(".voda-btn").removeAttr("disabled");
    $(".voda-btn").removeClass("btn_disabled");
  } else {
    $(".voda-btn").addClass("btn_disabled");
    $(".voda-btn").attr("disabled", "disabled");
  }
});

$('img.downloadservice , img.printservice').click(function() {
  window.location.href = '#';
});

$(".cs-placeholder").click(function() {
  $("#cs-option-ul_reportType").css('position', 'relative');
});

$(".cs-placeholder").click(function() {
  if ($(this).hasClass("cs-disabled")) {} else {
    $(".cs-option").toggleClass(".cs-option-seen");
    $(this).children(".cs-arrow-dn").toggle();
    $(this).children(".cs-arrow-up").toggle();
    var width = $(this).outerWidth() - 1;
    $(this).next(".cs-option-ul").width('inherit');
  }
});

$(".cs-option").mouseover(function() {
  $(this).addClass('cs-selected');
  $(this).siblings(".cs-option").removeClass('cs-selected');
});

// Code for select box selection
$(".cs-option").click(
  function() {
    $(this).parent().prev(".cs-placeholder").children(".cs-title").text($(this).text());
    $(this).parent().hide();
    $(this).parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $(this).parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    var option = $(this).attr("data-value");
    var i18n = $(this).attr("data-i18n");
    $(this).parent().prev(".cs-placeholder").children(".cs-title").attr("data-value", option);
    $(this).parent().prev(".cs-placeholder").children(".cs-title").attr("data-i18n", i18n);
    $(this).parent().prev(".cs-placeholder").attr("data-value", option);
  });

$("div").not(".cs-option-ul").click(function() {
  $(".cs-option").removeClass(".cs-option-seen");
});

$(".fm-error").each(function() {
  var width = $(this).next().outerWidth();
  width = width - 2;
  $(this).width(width);
});

$("#login").click(function() {
  var userName = $("#username").val();
  var passWord = $("#password").val();
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("channel");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("country");
  sessionStorage.removeItem("operatorName");
  getJwtToken(userName, passWord);
});

$("#simbtn").click(function() {
  $("#selectedFile").trigger("click");
  $("#file1").css("display", "none");
});

//Code to display File name
$('.custom-file-input input[type="file"]').change(function(e) {
  $(this).siblings('input[type="text"]').val(e.target.files[0].name);
  $('#import-success-block-show').css('display', 'none');
  $(".errorAlert").hide();
});
//Code to display File name ends

/*Reporting logic*/
$("#viewMore_util").click(function() {
  sessionStorage.setItem("reporting_section", 'reserveReport');
});

$("#viewMore_av").click(function() {
  sessionStorage.setItem("reporting_section", 'availableReport');
});

$("#viewMore_rdy").click(function() {
  sessionStorage.setItem("reporting_section", 'unconfirmedReport');
});

$("#viewMore_dp").click(function() {
  sessionStorage.setItem("reporting_section", 'profileDownloadReport');
});

function identical(array) {
  for (var i = 0; i < array.length - 1; i++) {
    if (array[i] !== array[i + 1]) {
      return false;
    }
  }
  return true;
}

function reInstateArrows(){
  $('.sorting-option').html('<img class="sorting-arrow" src="/img/sorting-arrow.png">'+
  '<img class="sorting-arrow1" src="/img/sorting-arrow-part-1.png">'+
  '<img class="sorting-arrow2" src="/img/sorting-arrow-part-2.png">');
  $(".sorting-option").css('padding-top', '2px');
}
//Sorting
function sortTableColumns() {
  $('th').click(function(e) {
    e.preventDefault();
    var list = [];
    var elementClass = $(this).attr("class");
    var element = 'tr td.' + elementClass.split(" ")[0];
    $(element).each(function() {
      list.push($(this).text());
    });
    if (!identical(list)) {
      var table = $(this).parents('table').eq(0);
      var rows;
      if ($(this).hasClass('dateHeader')) {
        rows = table.find('tr:gt(0)').toArray().sort(dateComparer($(this).index()));
      } else if ($(this).hasClass('dateTimeHeader')) {
        rows = table.find('tr:gt(0)').toArray().sort(dateTimeComparer($(this).index()));
      } else if ($(this).hasClass('esim_status_iccid')) {
        rows = table.find('tr:gt(0)').toArray().sort(iccidComparer($(this).index()));
      } else {
        rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
      }
      asc = !asc
      if (!asc) {
        rows = rows.reverse();
		$(".sorting-arrow2").css("display","inline");
		$(".sorting-arrow1").css("display","none");
		$(".sorting-arrow").css("display","none");
		$(".sorting-option").css('padding-top', '0px');
      }else {
		$(".sorting-arrow1").css("display","inline");
		$(".sorting-arrow2").css("display","none");
		$(".sorting-arrow").css("display","none");
		$(".sorting-option").css('padding-top', '0px');
	  }
      for (var i = 0; i < rows.length; i++) {
        table.append(rows[i])
      }
      table.children('tbody').children().css('display', 'none');
      var index = table.parent().siblings('.pagination').children('select').val();
      table.children('tbody').children().slice(0, index).css('display', 'table-row');
    }
	e.stopImmediatePropagation();
  })
}

function comparer(index) {
  return function(a, b) {
    var valA = getCellValue(a, index),
      valB = getCellValue(b, index)
    return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
  }
}

function iccidComparer(index) {
  return function(a, b) {
    var valA = getCellValue(a, index),
      valB = getCellValue(b, index)
    return valA.localeCompare(valB)
  }
}

function dateComparer(index) {
  return function(a, b) {
    var valA = dateModifier(getCellValue(a, index));
    var valB = dateModifier(getCellValue(b, index));
    return new Date(valA) - new Date(valB);
  }
}

function dateTimeComparer(index) {
  return function(a, b) {
    var valA = getCellValue(a, index).split(',');
    var valB = getCellValue(b, index).split(',');
    var date1 = dateModifier(valA[0]) + 'T' + (valA[1].substring(0, valA[1].indexOf('UTC'))).trim() + 'Z';
    var date2 = dateModifier(valB[0]) + 'T' + (valB[1].substring(0, valB[1].indexOf('UTC'))).trim() + 'Z';
    return new Date(date1) - new Date(date2);
  }
}

function dateModifier(date) {
  return date.split('/').reverse().join('-')
}

function getCellValue(row, index) {
  return $(row).children('td').eq(index).html()
}

/* Modal for overlays */
function modalDialogFunction() {
  $(function() {
    var appendthis = ("<div class='modal-overlay js-modal-close'></div>");
    $('img[data-modal-id]').click(function(e) {
        sessionStorage.setItem('deleteId', ($(this).attr('id')));
        e.stopImmediatePropagation();
        e.preventDefault();
        $("body").append(appendthis);
        $(".modal-overlay").fadeTo(500, 0.3);
        var modalBox = $(this).attr('data-modal-id');
        $('#' + modalBox).fadeIn($(this).data());
        var screenTop = parseInt($(document).scrollTop(), 10) +parseInt("175px", 10) + "px";
        $('#' + modalBox).css("top", screenTop);
		$('.scroll-note').scrollTop(0);
      });
    $('input[data-modal-id]').click(function(e) {
        if ($(this).attr('data-modal-id') == 'popup' || $(this).attr('data-modal-id') == 'popup12') {
          if ($('#stop_notifications').hasClass('check-checked') || $('#stop_notifications1').hasClass('check-checked')) {
            e.stopImmediatePropagation();
            e.preventDefault();
            $("body").append(appendthis);
            $(".modal-overlay").fadeTo(500, 0.9);
            var modalBox = $(this).attr('data-modal-id');
            $('#' + modalBox).fadeIn($(this).data());
            var screenTop = parseInt($(document).scrollTop(), 10) +
              parseInt("60px", 10) + "px";
            $('#' + modalBox).css("top", screenTop);
          }
        } else {
          e.stopImmediatePropagation();
          e.preventDefault();
          $("body").append(appendthis);
          $(".modal-overlay").fadeTo(500, 0.9);
          var modalBox = $(this).attr('data-modal-id');
          $('#' + modalBox).fadeIn($(this).data());
          var screenTop = parseInt($(document).scrollTop(), 10) +
            parseInt("175px", 10) + "px";
          $('#' + modalBox).css("top", screenTop);
        }
      });
    $('button[data-modal-id]').click(function(e) {
        if (msisdMatchStatus == 0 && $(this).attr('data-modal-id') == 'popup10') {} else if ($('#tx_eid').val()) {
          if (sessionStorage.getItem('validEID')) {
            if ((this.id) == "tx_msisd") {} else {
              e.stopImmediatePropagation();
              e.preventDefault();
              $("body").append(appendthis);
              $(".modal-overlay").fadeTo(500, 0.9);
              var modalBox = $(this).attr('data-modal-id');
              $('#' + modalBox).fadeIn($(this).data());
              var screenTop = parseInt($(document).scrollTop(), 10) +
                parseInt("60px", 10) + "px";
              $('#' + modalBox).css("top", screenTop);
            }
          }
        } else {
          e.stopImmediatePropagation();
          e.preventDefault();
          $("body").append(appendthis);
          $(".modal-overlay").fadeTo(500, 0.9);
          var modalBox = $(this).attr('data-modal-id');
          $('#' + modalBox).fadeIn($(this).data());
          var screenTop = parseInt($(document).scrollTop(), 10) +
            parseInt("60px", 10) + "px";
          $('#' + modalBox).css("top", screenTop);
        }
        if ($(this).attr('data-modal-id') == 'popup' ||
          $(this).attr('data-modal-id') == 'popup12') {
          if ($('#stop_notifications').hasClass('check-checked') ||
            $('#stop_notifications1').hasClass(
              'check-checked')) {
            e.stopImmediatePropagation();
            e.preventDefault();
            $("body").append(appendthis);
            $(".modal-overlay").fadeTo(500, 0.9);
            var modalBox = $(this).attr('data-modal-id');
            $('#' + modalBox).fadeIn($(this).data());
            var screenTop = parseInt($(document).scrollTop(), 10) +
              parseInt("175px", 10) + "px";
            $('#' + modalBox).css("top", screenTop);
          }
        }
      });
    $('div[data-modal-id]').click(function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        $("body").append(appendthis);
        $(".modal-overlay").fadeTo(500, 0.9);
        var modalBox = $(this).attr('data-modal-id');
        $('#' + modalBox).fadeIn($(this).data());
        var screenTop = parseInt($(document).scrollTop(), 10) +
          parseInt("175px", 10) + "px";
        $('#' + modalBox).css("top", screenTop);
      });
	  $('span[data-modal-id]').click(function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        $("body").append(appendthis);
        $(".modal-overlay").fadeTo(500, 0.9);
        var modalBox = $(this).attr('data-modal-id');
        $('#' + modalBox).fadeIn($(this).data());
        var screenTop = parseInt($(document).scrollTop(), 10) +
          parseInt("175px", 10) + "px";
        $('#' + modalBox).css("top", screenTop);
		$('.scroll-note').scrollTop(0);
      });
    $(".js-modal-close, .modal-overlay").click(function() {
      $(".modal-box, .modal-overlay").fadeOut(500, function() {
        $(".modal-overlay").remove();
      });
    });
    $('#imagepreview').attr('src');
  });
}
modalDialogFunction();

$("#tempTypeOption1").click(
  function() {
    $("#inst_activation").css('display', 'block');
    $("#inst_confirmation").css('display', 'none');
    $("#inst_esimDetails").css('display', 'none');
  });

$("#tempTypeOption2").click(
  function() {
    $("#inst_activation").css('display', 'none');
    $("#inst_confirmation").css('display', 'block');
    $("#inst_esimDetails").css('display', 'none');
  });

$("#tempTypeOption3").click(function() {
  $("#inst_activation").css('display', 'none');
  $("#inst_esimDetails").css('display', 'block');
  $("#inst_confirmation").css('display', 'none');
});

$("#repFreqOption1").click(function() {
  $("#r_date").css('display', 'none');

});

$("#repFreqOption2").click(function() {
  $("#r_date").show();
});

$("#repFreqOption3").click(function() {
  $("#r_date").show();
});

$("#acc-template-dd").change(
  function() {
    $(".acc-noshow-acc3").removeClass("acc-noshow-acc3").addClass(
      "acc-show-acc3");
  });
  
// To display contents of accordion 1
$("#acc-profile-dd").change(
  function() {
    $(".acc-noshow-acc1").removeClass("acc-noshow-acc1").addClass(
      "acc-show-acc1");
    $("#note-stop1_tab").css("display", "inline-block");
    $("#toggleswitch1").css("display", "inline-block");
    $("#low_note_edit").css("display", "inline-block");

  });

$("#repFreqOption1").click(function() {
  $("#r_date").hide();
});

$("#repFreqOption2").click(function() {
  $("#r_date").show();
});

$("#repFreqOption3").click(function() {
  $("#r_date").show();
});

$("#repFreqNextOption1").click(function() {
  $("#Rep_date_1").hide();
  $("#Report_date_1").hide();
  $("#Rep_time_1").show();
  $("#Report_time_1").show();
  $("#Report_time_1").attr('data-i18n', 'translation.Report_time_1');
  $("#Report_time_2").attr('data-i18n', 'translation.Report_time_2');
  translationi18();
});

$("#repFreqNextOption2,#repFreqNextOption3").click(function() {
  $("#Rep_date_1").show();
  $("#Report_date_1").show();
  $("#Rep_time_1").hide();
  $("#Report_time_1").hide();
  $("#Report_time_2").attr('data-i18n', 'translation.Report_time');
  $("#Report_date_class").show();
  translationi18();
});

$('#low_note_edit_report').click(function() {
  $('#low_note_edit_report').hide();
  $('#low_note_apply').show();
  $('#low_note_reset').show();
  $('#low_note_cancel_report').show();
});

$('#low_note_edit_acc2').click(function() {
  $(this).hide();
  $('#low_note_apply_acc2').show();
  $('#low_note_cancel_acc2').show();
});

bindings = {
  init: function() {
    $(".device-column").mouseover(function() {
      var text = $(this).prev(".eid-col").text();
      $(".device-dis-tt").text(text);
      $(".device-dis-tt").css("display", "block");
      $(".device-dis-arrow").css("display", "block");
      var offset = $(this).position();
      var topOffset = offset.top - 25;
      var leftOffset = offset.left;
      $(".device-dis-tt").css("top", topOffset).css("left", leftOffset);
      $(".device-dis-arrow").css("top", topOffset + $(".device-dis-tt").height() + 9).css("left", leftOffset + 10);
    });
	
    $(".device-column").click(function() {
      $(".device-dis-tt").css("display", "block");
      $(".device-dis-arrow").css("display", "block");
      var offset = $(this).position();
      var topOffset = offset.top - 25;
      var leftOffset = offset.left;
      $(".device-dis-tt").css("top", topOffset).css("left", leftOffset);
      $(".device-dis-arrow").css("top", topOffset + $(".device-dis-tt").height() + 9).css("left", leftOffset + 20);
    });
	
    $(".status-col").mouseover(function() {
      var status = $(this).text();
      if (status === 'Unsuccessful') {
        var text = $(this).prev(".fail-col").text();
        var text_fail = $(this).prevAll(".fail-reason").text();
        $(".status-col-tt").html(text + "<br>" + text_fail);
        $(".status-col-tt").css("display", "block");
        $(".status-col-arrow").css("display", "block");
        var offset = $(this).position();
        var topOffset = offset.top - 25;
        var leftOffset = offset.left;
        $(".status-col-tt").css("top", topOffset).css("left", leftOffset);
        $(".status-col-arrow").css("top", topOffset + $(".status-col-tt").height() + 9).css("left", leftOffset + 20);
      }
    });
	
    $(".status-col").click(function() {
      var status = $(this).text();
      if (status === 'Unsuccessful') {
        var text = $(this).prev(".fail-col").text();
        var text_fail = $(this).prevAll(".fail-reason").text();
        $(".status-col-tt").html(text + "<br>" + text_fail);
        $(".status-col-tt").css("display", "block");
        $(".status-col-arrow").css("display", "block");
        var offset = $(this).position();
        var topOffset = offset.top - 25;
        var leftOffset = offset.left;
        $(".status-col-tt").css("top", topOffset).css("left", leftOffset);
        $(".status-col-arrow").css("top", topOffset + $(".status-col-tt").height() + 9).css("left", leftOffset + 20);
      }
    });
	
    $("td").not(".device-column").mouseover(function() {
      $(".device-dis-tt").css("display", "none");
      $(".device-dis-arrow").css("display", "none");
    });
	
    $("td").not(".device-column").click(function() {
      $(".device-dis-tt").css("display", "none");
      $(".device-dis-arrow").css("display", "none");
    });
	
    $("td").not(".status-col").mouseover(function() {
      $(".status-col-tt").css("display", "none");
      $(".status-col-arrow").css("display", "none");
    });
	
    $("td").not(".status-col").click(function() {
      $(".status-col-tt").css("display", "none");
      $(".status-col-arrow").css("display", "none");
    });
	
    //Below drop down logic is used for the dynamic drop down i.e. for dynamic bindings
    $(".cs-option").mouseover(function() {
      $(this).addClass('cs-selected');
      $(this).siblings(".cs-option").removeClass('cs-selected');
    });
	
    // Code for select box selection
    $(".cs-option").click(function() {
        $(this).parent().prev(".cs-placeholder").children(".cs-title").text($(this).text());
        $(this).parent().hide();
        $(this).parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
        $(this).parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
        var option = $(this).attr("data-value");
        var i18n = $(this).attr("data-i18n");
        $(this).parent().prev(".cs-placeholder").children(".cs-title").attr("data-value", option);
        $(this).parent().prev(".cs-placeholder").children(".cs-title").attr("data-i18n", i18n);
        $(this).parent().prev(".cs-placeholder").attr("data-value", option);
      });

    $("div").not(".cs-option-ul").click(function() {
      $(".cs-option").removeClass(".cs-option-seen");
    });
	
	$(".table-action").click(function(event) {
	  $(this).toggleClass("table-action-clicked");
	  var offset = $(this).position();
	  var height = $(this).height();
	  var width = $(".action-ovl").width();
	  var thisWidth = $(this).width();
	  var topOffset = offset.top + height + 6;
	  var leftOffset = offset.left - width + thisWidth + 6;
	  $(".action-ovl").toggle();
	  $(".action-ovl").css("top", topOffset).css("left", leftOffset);
	  $(".action-ovl").css("z-index", "100");
	  event.stopPropagation();
	});
	$(".agent-col").mouseover(function() {
	  if($(this).text()) {
		var text = $(this).prev(".col-hide").text();
		$(".agentName-tt").text(text);
		$(".agentName-tt").css("display", "block");
		$(".agentName-dis-arrow").css("display", "block");
		$(".agent-col").css("cursor","pointer");
		var offset = $(this).position();
		var topOffset = offset.top - 25;
		var leftOffset = offset.left;
		$(".agentName-tt").css("top", topOffset).css("left", leftOffset);
		$(".agentName-dis-arrow").css("top", topOffset + $(".agentName-tt").height() + 9).css("left", leftOffset + 5);
	  }else {
		$(".agentName-tt").css("display", "none");
		$(".agentName-dis-arrow").css("display", "none");
		$(".agent-col").css("cursor","auto");
	  }
	});
	$(".agent-col").click(function() {
	  if($(this).text()) {
		var text = $(this).prev(".col-hide").text();
		$(".agentName-tt").text(text);
		$(".agentName-tt").css("display", "block");
		$(".agentName-dis-arrow").css("display", "block");
		$(".agent-col").css("cursor","pointer");
		var offset = $(this).position();
		var topOffset = offset.top - 25;
		var leftOffset = offset.left;
		$(".agentName-tt").css("top", topOffset).css("left", leftOffset);
		$(".agentName-dis-arrow").css("top", topOffset + $(".agentName-tt").height() + 9).css("left", leftOffset + 5);
	  }else {
		$(".agentName-tt").css("display", "none");
		$(".agentName-dis-arrow").css("display", "none");
		$(".agent-col").css("cursor","auto");
	  }
	});
	$(".device-col").mouseover(function() {
	  var text = $(this).prev(".imei-col").text();
	  $(".imei-tt").text(text);
	  $(".imei-tt").css("display", "block");
	  $(".imei-dis-arrow").css("display", "block");
	  var offset = $(this).position();
	  var topOffset = offset.top - 25;
	  var leftOffset = offset.left;
	  $(".imei-tt").css("top", topOffset).css("left", leftOffset);
	  $(".imei-dis-arrow").css("top", topOffset + $(".imei-tt").height() + 9).css("left", leftOffset + 2);
	});
	$(".device-col").click(function() {
	  var text = $(this).prev(".imei-col").text();
	  $(".imei-tt").text(text);
	  $(".imei-tt").css("display", "block");
	  $(".imei-dis-arrow").css("display", "block");
	  var offset = $(this).position();
	  var topOffset = offset.top - 25;
	  var leftOffset = offset.left;
	  $(".imei-tt").css("top", topOffset).css("left", leftOffset);
	  $(".imei-dis-arrow").css("top", topOffset + $(".imei-tt").height() + 9).css("left", leftOffset + 2);
	});
	$("td").not(".agent-col").mouseover(function() {
	  $(".agentName-tt").css("display", "none");
	  $(".agentName-dis-arrow").css("display", "none");
	});
	$("td").not(".agent-col").click(function() {
	  $(".agentName-tt").css("display", "none");
	  $(".agentName-dis-arrow").css("display", "none");
	});
	$("td").not(".device-col").mouseover(function() {
	  $(".imei-tt").css("display", "none");
	  $(".imei-dis-arrow").css("display", "none");
	});
	$("td").not(".device-col").click(function() {
	  $(".imei-tt").css("display", "none");
	  $(".imei-dis-arrow").css("display", "none");
	});
  }
};

//bindings function ends
$("th").mouseover(function() {
  $("th").css("cursor", "default");
  $(".status-col-tt").css("display", "none");
  $(".device-dis-tt").css("display", "none");
  $(".status-col-arrow").css("display", "none");
  $(".device-dis-arrow").css("display", "none");
  $(".agentName-tt").css("display", "none");
  $(".agentName-dis-arrow").css("display", "none");
  $(".imei-tt").css("display", "none");
  $(".imei-dis-arrow").css("display", "none");
});

$("th").click(function() {
  $(".status-col-tt").css("display", "none");
  $(".device-dis-tt").css("display", "none");
  $(".status-col-arrow").css("display", "none");
  $(".device-dis-arrow").css("display", "none");
  $(".agentName-tt").css("display", "none");
  $(".agentName-dis-arrow").css("display", "none");
  $(".imei-tt").css("display", "none");
  $(".imei-dis-arrow").css("display", "none");
});

$("#note-stop,#note-stop1").click(function(e) {
  e.preventDefault();
  e.stopPropagation();
});

$("#low_note_edit_report").click(
  function() {
    $(".radio-noclick").removeClass("radio-noclick");
    $("#acc-col-1-fre, #rep_days,#Rep_date,#Rep_time,#CSV,#XML,#both")
      .css('pointer-events', 'auto');
    $("#acc-col-1-fre,#rep_days,#Rep_date,#Rep_time,#CSV,#XML,#both")
      .removeClass("btn_disabled");
  });
  
$("#low_note_edit_acc2").click(function() {
  $("#prof_placeholder_opt").css('pointer-events', 'auto');
  $("#prof_placeholder_opt").removeClass("btn_disabled");
  $("#thrshld_days").css('pointer-events', 'auto');
  $("#thrshld_days").removeClass("btn_disabled");
  $("#Report_frequency_opt").css('pointer-events', 'auto');
  $("#Report_frequency_opt").removeClass("btn_disabled");
  $("#Rep_date_1").css('pointer-events', 'auto');
  $("#Rep_date_1").removeClass("btn_disabled");
  $("#Rep_time_1").css('pointer-events', 'auto');
  $("#Rep_time_1").removeClass("btn_disabled");
  $("#Rep_time_2").css('pointer-events', 'auto');
  $("#Rep_time_2").removeClass("btn_disabled");
});

$(".cs-placeholder").click(function() {
  $("#cs-option-ul_tempType").css('position', 'relative');
});

//Tab_functionality for sim_Inventory
$('.tabs .tab-links a').on('click', function(e) {
  e.preventDefault();
  var currentAttrValue = $(this).attr('href');
  // Show/Hide Tabs
  $('.tabs ' + currentAttrValue).show().siblings().hide();
  // Change/remove current tab to active
  $(this).parent('li').addClass('activeTab').siblings().removeClass('activeTab');
  if (currentAttrValue === '#tab2') {
	reInstateArrows();
    getFileUploadReport();
  } else {
    if ($(".tabs .tab-links").is("#tabBorder")) {
      $('#import-success-block-show').css('display', 'none');
      $(".errorAlert").hide();
	  $("#selectedFile-txt").val("");
	  $("#selectedFile").val("");
      simGraphCall();
    }
  }
});

//show/hide activation mode section
$("#tx_eid").keyup(function() {
  dropDown();
});

function dropDown() {
  if ($("#tx_eid").val() != "") {
    $('.select-activation-confirmation').slideDown("slow", function() {
      $('.select-activation-confirmation').css("display", "block");
    });
  } else {
    $('.select-activation-confirmation').slideUp("slow", function() {
      $('.select-activation-confirmation').css("display", "none");
    });
  }
}

/* Javascript Code For Date Formating */
/*
 * Date Format 1.2.3
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
 
var dateFormat = function() {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function(val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };
  // Regexes and supporting functions are cached through closure
  return function(date, mask, utc) {
    var dF = dateFormat;
    //date = new Date();
    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }
    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date)) throw SyntaxError("invalid date");
    mask = String(dF.masks[mask] || mask || dF.masks["default"]);
    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }
    var _ = utc ? "getUTC" : "get",
      d = date[_ + "Date"](),
      D = date[_ + "Day"](),
      m = date[_ + "Month"](),
      y = date[_ + "FullYear"](),
      H = date[_ + "Hours"](),
      M = date[_ + "Minutes"](),
      s = date[_ + "Seconds"](),
      L = date[_ + "Milliseconds"](),
      o = utc ? 0 : date.getTimezoneOffset(),
      flags = {
        d: d,
        dd: pad(d),
        ddd: dF.i18n.dayNames[D],
        dddd: dF.i18n.dayNames[D + 7],
        m: m + 1,
        mm: pad(m + 1),
        mmm: dF.i18n.monthNames[m],
        mmmm: dF.i18n.monthNames[m + 12],
        yy: String(y).slice(2),
        yyyy: y,
        h: H % 12 || 12,
        hh: pad(H % 12 || 12),
        H: H,
        HH: pad(H),
        M: M,
        MM: pad(M),
        s: s,
        ss: pad(s),
        l: pad(L, 3),
        L: pad(L > 99 ? Math.round(L / 10) : L),
        t: H < 12 ? "a" : "p",
        tt: H < 12 ? "am" : "pm",
        T: H < 12 ? "A" : "P",
        TT: H < 12 ? "AM" : "PM",
        Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
        o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
      };
    return mask.replace(token, function($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
}();
// Some common format strings
dateFormat.masks = {
  "default": "ddd mmm dd yyyy HH:MM:ss",
  shortDate: "m/d/yy",
  mediumDate: "mmm d, yyyy",
  longDate: "mmmm d, yyyy",
  fullDate: "dddd, mmmm d, yyyy",
  shortTime: "h:MM TT",
  mediumTime: "h:MM:ss TT",
  longTime: "h:MM:ss TT Z",
  isoDate: "yyyy-mm-dd",
  isoTime: "HH:MM:ss",
  isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};
// Internationalization strings
dateFormat.i18n = {
  dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
};

Date.prototype.format = function(mask, utc) {
  return dateFormat(this, mask, utc);
};
/* Javascript Code For Date Formating */
function getSessionValue() {
  $(".login_name").text(sessionStorage.getItem("userName"));
  $(".welcome_name").text(sessionStorage.userName);
  var loginusername = sessionStorage.getItem("userName");
}

function data() {
  if (sessionStorage.msisdnValue == null || sessionStorage.msisdnValue == '') {
    $("#searchservice").attr("disabled");
    $("#searchservice").addClass("btn_disabled");
  } else {
    $('#txt_msisdn').val(sessionStorage.msisdnValue);
    $("#searchservice").removeAttr("disabled");
    $("#searchservice").removeClass("btn_disabled");
    $("#searchservice").trigger("click");
    sessionStorage.removeItem('msisdnValue');
  }
};

// To remove the lang parameter from sessionStorage
$(".logoutLink").click(function() {
  sessionStorage.removeItem("lang");
});

$("#utilized_profile-img").click(function() {
	if((sessionStorage.role).indexOf(sessionStorage.groupAdminRole) > -1 ) {
	  $(".utilized_profile-tt").attr('data-i18n', 'translation.group_utilized_profile-tt'); 
	} else {
	  $(".utilized_profile-tt").attr('data-i18n', 'translation.utilized_profile-tt');
	}
    translationi18();
    if ($('.utilized_profile-tt').is(':visible')) {
      $(".utilized_profile-tt").css("display", "none");
    } else {
      $(".utilized_profile-tt").css("display", "block");
    }
    $(".available_profile-tt").css("display", "none");
    $(".ready_profile-tt").css("display", "none");
    $(".download_profile-tt").css("display", "none");
  });
  
$("#available_profile-img").click(function() {
	if((sessionStorage.role).indexOf(sessionStorage.groupAdminRole) > -1 ) {
	  $(".available_profile-tt").attr('data-i18n', 'translation.group_available_profile-tt'); 
	} else {
	  $(".available_profile-tt").attr('data-i18n', 'translation.available_profile-tt');
	}
    translationi18();
    if ($('.available_profile-tt').is(':visible')) {
      $(".available_profile-tt").css("display", "none");
    } else {
      $(".available_profile-tt").css("display", "block");
    }
    $(".utilized_profile-tt").css("display", "none");
    $(".ready_profile-tt").css("display", "none");
    $(".download_profile-tt").css("display", "none");
  });
  
$("#ready_profile-img").click(function() {
  $(".ready_profile-tt").attr('data-i18n', 'translation.ready_profile-tt');
  translationi18();
  if ($('.ready_profile-tt').is(':visible')) {
    $(".ready_profile-tt").css("display", "none");
  } else {
    $(".ready_profile-tt").css("display", "block");
  }
  $(".utilized_profile-tt").css("display", "none");
  $(".available_profile-tt").css("display", "none");
  $(".download_profile-tt").css("display", "none");
});

$("#download_profile-img").click(
  function() {
    $(".download_profile-tt").attr('data-i18n',
      'translation.download_profile-tt');
    translationi18();
    if ($('.download_profile-tt').is(':visible')) {
      $(".download_profile-tt").css("display", "none");
    } else {
      $(".download_profile-tt").css("display", "block");
    }
    $(".utilized_profile-tt").css("display", "none");
    $(".available_profile-tt").css("display", "none");
    $(".ready_profile-tt").css("display", "none");
  });
  
$("#new_profile_email_notify").keyup(function() {
  $("#Add_new_email").removeClass("btn_disabled");
});

$("#Add_new_email").click(function() {
  if ($("#Add_new_email").hasClass('btn_disabled')) {} else {
    $("#email-success-block").css("display", "block");
  }
});

$("#new_subscription_type").click(function() {
  $(".insert_sub_type").css("display", "block");
  $("#new_subSuccess_block").css("display", "none");
  $("#new_subError_block").css("display", "none");
  $('.plus_minus_pos').closest('tr').removeClass("option_active");
  $('.plus_minus_pos').closest('tr').next().removeClass("next_sub_option_active");
});

$("#enter_sub_type").keyup(function() {
  $("#Add_subscription").removeClass("btn_disabled");
});

$("#Add_subscription").click(function() {
  if ($("#Add_subscription").hasClass('btn_disabled')) {} else {
    $(".insert_sub_type").css("display", "none");
    $("#new_subSuccess_block").css("display", "block");
  }
});

// Associate profile type popup
$("#associate_profile_type1").click(function() {
  if ($(this).is(':checked')) {
    $("#association_warning").css("display", "block");
    $("#popup15").css("height", "400px");
  } else {
    $("#association_warning").css("display", "none");
    $("#popup15").css("height", "340px");
  }
});

$("#assco_apply,#assco_cancel,#close-popup15").click(function() {
  $("#association_warning").css("display", "none");
  $("#popup15").css("height", "340px");
});

$("#Cancel_subscription").click(function() {
  $(".insert_sub_type").css("display", "none");
});

// Method for translation to be called everytime whenever document.ready does
// not load
function translationi18() {
  var pagename = window.location.pathname;
  var parts = pagename.split('/');
  if ((sessionStorage.getItem("lang") === null) || (sessionStorage.getItem("lang") === 'en')) {
    if (parts[2] === 'ReportingSection.html' || parts[2] === 'Settings_Configuration.html') {
      $("span.css-switch-label").addClass("eng-class").removeClass("de-class nl-class");
	  enCalendar();
    }
    var options = {
      lng: 'en',
      resGetPath: '/locales/' + 'en' + '/translation.json'
    }
  } else {
    if (parts[2] === 'ReportingSection.html' || parts[2] === 'Settings_Configuration.html') {
      if (sessionStorage.getItem("lang") === 'nl') {
        $("span.css-switch-label").addClass("nl-class").removeClass("de-class eng-class");
		nlCalendar();
      }
      if (sessionStorage.getItem("lang") === 'de') {
		$("span.css-switch-label").addClass("de-class").removeClass("eng-class nl-class");
        deCalendar();
      }
    }
    options = {
      lng: sessionStorage.getItem("lang"),
      resGetPath: '/locales/' + sessionStorage.getItem("lang") + '/translation.json'
    }
  }
  i18n.init(options, function() {
	var defaultOptions = {defaultValue: i18n.t('translation.unknownError')};
    // save to use translation function as resources are fetched
    $('.translation').i18n(defaultOptions);
    if (parts[2] === 'ReportingSection.html' || parts[2] === 'Settings_Configuration.html') {
      if (options.lng == 'nl') {
		$("span.css-switch-label").addClass("nl-class").removeClass("de-class eng-class");
        nlCalendar();
      }
      if (options.lng == 'en') {
		$("span.css-switch-label").addClass("eng-class").removeClass("de-class nl-class");
        enCalendar();
      }
      if (options.lng == 'de') {
		$("span.css-switch-label").addClass("de-class").removeClass("eng-class nl-class");
        deCalendar();
      }
    }
  });
}
// Method for error translation to be called everytime whenever document.ready
// does not load
function errori18() {
  var errorOptions;
  if (sessionStorage.getItem("lang") === null) {
    errorOptions = {
      lng: 'en',
      resGetPath: '/locales/' + 'en' + '/error_msg.json'
    };
  } else {
    errorOptions = {
      lng: sessionStorage.getItem("lang"),
      resGetPath: '/locales/' + sessionStorage.getItem("lang") + '/error_msg.json'
    }
  }
  i18n.init(errorOptions, function() {
    // save to use error translation function as resources are fetched
    $('.errorTranslation').i18n();
  });
}

// edit button functionality in setting & configuration
$('.dashboard .tabChange a').on(
  'click',
  function(e) {
    e.preventDefault();
    var currentAttrValue = $(this).attr('href');
    // Show/Hide Tabs
    $('.tabs ' + currentAttrValue).show().siblings().hide();
    // Change/remove current tab to active
    $('.tabs .tab-links a').parent('li').addClass('activeTab')
      .siblings().removeClass('activeTab');
    $('#edit_tag').addClass('activeTab');
    $('canvas').remove();
    $('.hist-scale-list').remove();
  });

function reportingCall() {
  sessionStorage.setItem("setting_flag", "false");
  window.location.href = "Settings_Configuration.html";
}

function simInventoryCall() {
  sessionStorage.setItem("setting_flag", "false");
  window.location.href = "Settings_Configuration.html";
}
//Code to return the timezone
function getTimezone() {
  var d = new Date();
  var n = d.getTimezoneOffset();
  //Check if the time is ahead or behind
  var sign = n && n / Math.abs(n);
  //if it is behind, make it +, else make it -, yes you read it correctly!!
  if (sign < 0) prefix = '+';
  else prefix = '-';
  //Actual timezone value
  return ('UTC ' + prefix + Math.floor(Math.abs(n) / 60) + ':' + (Math.abs(n) % 60));
};

$('#service').click(function() {
  sessionStorage.setItem('msisdnValue', '');
});

$(window).click(function() {
  //Hide the menus if visible
  if ($('.utilized_profile-tt').is(':visible')) {
    $(".utilized_profile-tt").css("display", "none");
  }
  if ($('.available_profile-tt').is(':visible')) {
    $(".available_profile-tt").css("display", "none");
  }
  if ($('.ready_profile-tt').is(':visible')) {
    $(".ready_profile-tt").css("display", "none");
  }
  if ($('.download_profile-tt').is(':visible')) {
    $(".download_profile-tt").css("display", "none");
  }

});

$('.title_profile').click(function(event) {
  event.stopPropagation();
});

$(document).click(function(){
        $(".cs-option-ul").hide();
        $(".cs-arrow-dn").show();
        $(".cs-arrow-up").hide();
		$(".action-ovl").css("display","none");
		$("img").removeClass("table-action-clicked");
});

$(".cs-placeholder").click(function(e){
    e.stopPropagation();
});

function logoutClient() {
  location.href = '/';
}

$('.action-item').click(function(event){
    $(".action-ovl").css("display","none");
    $("img").removeClass("table-action-clicked");
});

$('.regenarate_code_action').click(function(event){
	event.stopPropagation();
});
