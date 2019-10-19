// view emailIDlist
var constants = "/properties/leap_properties.json";

$("#accord1").click(function() {
	if($('#low_note_edit_report').css('display') == 'none') {
		$(".css-switch").css("cursor","pointer");
	}else {
		$(".css-switch").css("cursor","auto");
	}
});

$("#email-accordion2").click(function() {
    var timezone = getTimezone();
    $('#errorLowSIM').css('display', 'none');
    $('#successLowSIM').css('display', 'none');
    var reportName = sessionStorage.reportNameLowSIM;
    var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
    $.ajax({
        method: "GET",
        async: false,
        url: ajaxURL,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        $('#emailList').html = "";
        if (data.length !== 0) {
            var emailAddress = data[0].EMAIL_IDS;
            var parseValue = JSON.parse(emailAddress);
            var parselength = parseValue.length;
            if (parseValue === null || parseValue === undefined || parseValue === '[]') {
                $('#email-error-block').css('display', 'block');
                $('#email-success-block').css('display', 'none');
                $('#alertErrorInstant').attr('data-i18n',
                    'errorTranslation.noMailIdAdded');
                $('#popup2').css('display', 'none');
                errori18();
            } else {
                var htmlContent = "";
                for (var i = 0; i < parselength; i++) {
                    htmlContent = htmlContent + '<tr><td id="emailvalue' + i + '">' +
                        parseValue[i].emailId + '</td><td>' + new Date(parseValue[i].modifiedDate).format(
                            "dd/mm/yyyy, HH:MM:ss") +
                        ' ' + timezone +
                        '</td><td>' +
                        '<img class="bin-icon" id="email' + i + '" src="/img/bin.png" onClick="deleteLowSimReportId(this.id)"></td></tr>';
                }
                $('#emailList').html(htmlContent);
            }
        }
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
});

//view low SIM stock notification configuration
$("#settings-accordion2").click(function() {
    var timezone = getTimezone();
    $('#errorLowSIM').css('display', 'none');
    $('#successLowSIM').css('display', 'none');
    var reportName = sessionStorage.reportNameLowSIM;
    var ajaxURL = sessionStorage.gatewayurl + sessionStorage.lowSimViewAjax.replace('{reportName}', reportName);
    $.ajax({
        method: "GET",
        async: false,
        url: ajaxURL,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        var htmlContent = "";
        for (var i = 0; i < data.length; i++) {
            htmlContent = htmlContent + "<tr><td>" + data[i].THRESHOLD_PARAM + "</td><td>" + data[i].THRESHOLD_VALUE + "</td><td>" + data[i].FREQUENCY_TYPE + "</td><td>" + new Date(data[i].MODIFIED_DATE).format("dd/mm/yyyy, HH:MM:ss") + ' ' + timezone + "</td></tr>";
        }
        document.getElementById('lowSIMConfig').innerHTML = htmlContent;
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
});

// populate porfile types for low SIM configuration
$('#lowSIMConfigAnchor').click(function() {
  $('#successLowSIM').hide();
    $('#alertLowSIM_error').empty();
    $('#repFreqTimeOption01').parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $('#repFreqTimeOption01').parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    $('#repFreqTimeOption02').parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $('#repFreqTimeOption02').parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    $("#prof_placeholder_opt").css('pointer-events', 'auto');
    $("#prof_placeholder_opt").removeClass("btn_disabled");
    // $('#repFreqTimeSelect2').removeAttr('data-i18n');
	if($('#low_note_apply_acc2').css('display') == 'none') {
		$(".css-switch").css("cursor","auto");
	}else {
		$(".css-switch").css("cursor","pointer");
	}
    var ajaxURL = sessionStorage.gatewayurl + sessionStorage.profileTypeDropDownUrl;
    $.ajax({
        method: "GET",
        async: false,
        url: ajaxURL,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        var htmlContent = "";
        var j = 1;
        $('#cs-option-ul_profileType').html("");
        $('#cs-option-ul_profileType').append('<li data-option data-value="' + data[0].PROFILE_TYPES + '" class="cs-selected cs-option" id="profileTypeOption0" onclick="chooseProfileType(this.id)"><span>' + data[0].PROFILE_TYPES + '</span></li>');
        for (var j = 1; j < data.length; j++) {
            $('#cs-option-ul_profileType').append('<li data-option data-value="' + data[j].PROFILE_TYPES + '" class="cs-option" id="profileTypeOption' + (j) + '" onclick="chooseProfileType(this.id)"><span>' + data[j].PROFILE_TYPES + '</span></li>');
        }
        bindings.init();
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
    errori18();
});

// dynamically populate values in report and mail
function chooseProfileType(ele) {
    $('#alertLowSIM_error').empty();
    var listId = '#'.concat(ele);
    $(listId).parent().prev(".cs-placeholder").children(".cs-title").text($(listId).attr("data-value"));
    $(listId).parent().prev(".cs-placeholder").children(".cs-title").removeAttr('data-i18n');
    $(listId).parent().hide();
    $(listId).parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $(listId).parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    var option = $(listId).attr("data-value");
    if (listId.search('profileTypeOption') != -1) {
      $('#profile-configuration').removeClass("acc-noshow-acc1").addClass("acc-show-acc1");
        $('#errorLowSIM').css('display', 'none');
        $('#successLowSIM').css('display', 'none');
        $('#repFreqTimeSelect1').removeAttr('data-i18n');
        $('#repFreqTimeSelect2').removeAttr('data-i18n');
        var reportName = sessionStorage.reportNameLowSIM;
        var ajaxURL = sessionStorage.gatewayurl + sessionStorage.lowSimViewAjax.replace('{reportName}', reportName);
        $.ajax({
            method: "GET",
            async: false,
            url: ajaxURL,
            headers: {
                'Authorization': localStorage.jwtToken,
            },
            crossDomain: true,
        }).success(function(data) {
            flag = false;
            for (var i = 0; i < data.length; i++) {
                if (option == data[i].THRESHOLD_PARAM) {
                    flag = false;
                    document.getElementById("thrshld_days").value = data[i].THRESHOLD_VALUE;
                    document.getElementById("Rep_date_1").value = data[i].FREQUENCY_DAY;
                    if (data[i].FREQUENCY_TYPE == sessionStorage.Daily) {
                        $('#repFreqSelect_next').attr("data-value", $('#repFreqNextOption1').attr("data-value"));
						$('#repFreqSelect_next').attr('data-i18n', 'translation.daily');
                        $('#Rep_date_1').css('display', 'none');
                        $("#Rep_time_1").show();
                        $('#Report_date_1').css('display', 'none');
                        $('#Report_time_1').css('display', 'block');
						$('#repFreqTimeSelect2').attr('data-i18n', 'translation.subTypeSelect');
						$('#repFreqTimeSelect1').attr('data-i18n', 'translation.subTypeSelect');
						translationi18();
                        if (data[i].BATCH_RUN_TIME.search(',') != -1) {
                            var temp = data[i].BATCH_RUN_TIME.split(',');
                            if (temp[0] == sessionStorage.nine && temp[1] == sessionStorage.seventeen) {
                                $('#repFreqTimeSelect1').attr("data-value", $('#repFreqTimeOption11').attr("data-value"));
                                $('#repFreqTimeSelect1').attr('data-i18n', 'translation.repFreqTimeOption12');
                                $('#repFreqTimeSelect2').attr("data-value", $('#repFreqTimeOption22').attr("data-value"));
                                $('#repFreqTimeSelect2').attr('data-i18n', 'translation.repFreqTimeOption22');
								translationi18();
                            } else if (temp[0] == sessionStorage.seventeen && temp[1] == sessionStorage.nine) {
                                $('#repFreqTimeSelect1').attr("data-value", $('#repFreqTimeOption21').attr("data-value"));
                                $('#repFreqTimeSelect1').attr('data-i18n', 'translation.repFreqTimeOption22');
                                $('#repFreqTimeSelect2').attr("data-value", $('#repFreqTimeOption12').attr("data-value"));
                                $('#repFreqTimeSelect2').attr('data-i18n', 'translation.repFreqTimeOption12');
								translationi18();
                            }
                        } else {
                            $('#repFreqTimeSelect2').attr('data-i18n', 'translation.subTypeSelect');
                            translationi18();
                            if (data[i].BATCH_RUN_TIME == sessionStorage.nine) {
                                $('#repFreqTimeSelect1').attr("data-value", $('#repFreqTimeOption11').attr("data-value"));
                                $('#repFreqTimeSelect1').attr('data-i18n', 'translation.repFreqTimeOption12');
								translationi18();
                            } else {
                                $('#repFreqTimeSelect1').attr("data-value", $('#repFreqTimeOption21').attr("data-value"));
                                $('#repFreqTimeSelect1').attr('data-i18n', 'translation.repFreqTimeOption22');
								translationi18();
                            }
                        }
                        $("#Report_time_1").attr('data-i18n', 'translation.Report_time_1');
                        $("#Report_time_2").attr('data-i18n', 'translation.Report_time_2');
                        translationi18();
                    } else if (data[i].FREQUENCY_TYPE == sessionStorage.monthly) {
                        $('#repFreqSelect_next').attr("data-value", $('#repFreqNextOption3').attr("data-value"));
						$('#repFreqSelect_next').attr('data-i18n','translation.monthly');
                        $("#Rep_time_1").hide();
                        $('#Report_time_1').css('display', 'none');
                        $('#Report_time_class').css('display', 'block');
                        $('#Rep_date_1').css('display', 'inline-block');
                        $('#Report_date_1').css('display', 'block');
                        $("#Report_time_2").attr('data-i18n', 'translation.Report_time');
                        translationi18();
                        if (data[i].BATCH_RUN_TIME == sessionStorage.nine) {
                            $('#repFreqTimeSelect2').attr("data-value", $('#repFreqTimeOption12').attr("data-value"));
                            $('#repFreqTimeSelect2').attr('data-i18n', 'translation.repFreqTimeOption12');
                        } else {
                            $('#repFreqTimeSelect2').attr("data-value", $('#repFreqTimeOption22').attr("data-value"));
                            $('#repFreqTimeSelect2').attr('data-i18n', 'translation.repFreqTimeOption22');
                        }
                    } else if (data[i].FREQUENCY_TYPE == sessionStorage.weekly) {
                        $('#repFreqSelect_next').attr("data-value", $('#repFreqNextOption2').attr("data-value"));
						$('#repFreqSelect_next').attr('data-i18n','translation.monthly');
                        $("#Rep_time_1").hide();
                        $('#Report_time_1').css('display', 'none');
                        $('#Report_time_class').css('display', 'block');
                        $('#Rep_date_1').css('display', 'inline-block');
                        $('#Report_date_1').css('display', 'block');
                        $("#Report_time_2").attr('data-i18n', 'translation.Report_time');
                        translationi18();
                        if (data[i].BATCH_RUN_TIME == sessionStorage.nine) {
                            $('#repFreqTimeSelect2').attr("data-value", $('#repFreqTimeOption12').attr("data-value"));
                            $('#repFreqTimeSelect2').attr('data-i18n', 'translation.repFreqTimeOption12');
                        } else {
                            $('#repFreqTimeSelect2').attr("data-value", $('#repFreqTimeOption22').attr("data-value"));
                            $('#repFreqTimeSelect2').attr('data-i18n', 'translation.repFreqTimeOption22');
                        }
                    } else {}
                    if (data[i].FLAG.toLowerCase() == sessionStorage.flagTrue) {
                        $('#toggleLabel2').prop('checked', true);
                    } else {
                        $('#toggleLabel2').prop('checked', false);
                    }
                    break;
                } else {
                    flag = true;
                }
            }
            if (flag) {
                $('#errorLowSIM').css('display', 'block');
                $('#successLowSIM').css('display', 'none');
                $('#alertLowSIM_error').attr('data-i18n', 'translation.noParamater');				
				$('#repFreqTimeSelect2').attr('data-i18n', 'translation.subTypeSelect');
				$('#repFreqTimeSelect1').attr('data-i18n', 'translation.subTypeSelect');				
				$('#repFreqSelect_next').attr('data-i18n', 'translation.subTypeSelect');
				$('#thrshld_days').val('');
				$('#repFreqSelect_next').removeAttr("data-value");
				$('#repFreqTimeSelect1').removeAttr("data-value");
				$('#repFreqTimeSelect2').removeAttr("data-value");
				translationi18();
            }
        }).error(function(error) {
		  if(error.status === 0 && !localStorage.jwtToken) {
		    logoutClient();
		  }
		});
    } else if (listId.search('reportTypeOption') != -1) {
        $(".acc-noshow-acc1").removeClass("acc-noshow-acc1").addClass("acc-show-acc1");
        $('#low_note_check1').removeClass("acc-noshow-acc1").addClass("acc-show-acc1");
        $('#stop_notifications1').removeClass("acc-noshow-acc1").addClass("acc-show-acc1");
        $('#stop_notifications1').removeClass("acc-noshow-acc1").addClass("acc-show-acc1");
        $('#errorReport').css('display', 'none');
        $('#successReport').css('display', 'none');
        $('#repTypeSelect').attr('data-i18n', $(listId).children().attr('data-i18n'));
        translationi18();
        var reportName = $(listId).attr("data-value");
        var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewReportingAjax.replace('{reportName}', reportName);
        $.ajax({
            method: "GET",
            async: false,
            url: ajaxURL,
            headers: {
                'Authorization': localStorage.jwtToken,
            },
            crossDomain: true,
        }).success(function(data) {
            document.getElementById("rep_days").value = data[0].DATE_RANGE;
            document.getElementById("Rep_date").value = data[0].FREQUENCY_DAY;
            if (data[0].BATCH_RUN_TIME == sessionStorage.nine) {
                $('#repFreqTimeSelect').attr("data-value", $('#repFreqTimeOption1').attr("data-value"));
				$('#repFreqTimeSelect').attr('data-i18n', 'translation.repFreqTimeOption12');
				translationi18();
            }
            if (data[0].BATCH_RUN_TIME == sessionStorage.seventeen) {
                $('#repFreqTimeSelect').attr("data-value", $('#repFreqTimeOption2').attr("data-value"));
				$('#repFreqTimeSelect').attr('data-i18n', 'translation.repFreqTimeOption22');
				translationi18();
            }
            if (data[0].FREQUENCY_TYPE == sessionStorage.Daily) {
                $('#repFreqSelect').attr("data-value", $('#repFreqOption1').attr("data-value"));
                $('#repFreqSelect').removeAttr('data-i18n');
                $('#repFreqSelect').attr('data-i18n', 'translation.daily');
                $('#r_date').css('display', 'none');
				translationi18();
            } else if (data[0].FREQUENCY_TYPE == sessionStorage.monthly) {
                $('#repFreqSelect').attr("data-value", $('#repFreqOption3').attr("data-value"));
                $('#repFreqSelect').removeAttr('data-i18n');
                $('#repFreqSelect').attr('data-i18n','translation.monthly');
                $('#r_date').css('display', 'block');
				translationi18();
            } else if (data[0].FREQUENCY_TYPE == sessionStorage.weekly) {
                $('#repFreqSelect').attr("data-value", $('#repFreqOption2').attr("data-value"));
                $('#repFreqSelect').removeAttr('data-i18n');
                $('#repFreqSelect').attr('data-i18n','translation.weekly');
                $('#r_date').css('display', 'block');
				translationi18();
            } else {}
            if (data[0].FORMAT.toLowerCase() == sessionStorage.csv) {
                $('#csv-radio').attr('checked', 'checked');
                $("#CSV").addClass("radio-checked");
                $("#both-radio").removeAttr("checked");
                $("#xml-radio").removeAttr("checked");
                $("#XML").removeClass("radio-checked");
                $("#both").removeClass("radio-checked");
            } else if (data[0].FORMAT.toLowerCase() == sessionStorage.xml) {
                $('#xml-radio').attr('checked', 'checked');
                $("#csv-radio").removeAttr("checked");
                $("#both-radio").removeAttr("checked");
                $("#XML").addClass("radio-checked");
                $("#CSV").removeClass("radio-checked");
                $("#both").removeClass("radio-checked");
            } else {
                $('#both-radio').attr('checked', 'checked');
                $("#both").addClass("radio-checked");
                $("#csv-radio").removeAttr("checked");
                $("#xml-radio").removeAttr("checked");
                $("#XML").removeClass("radio-checked");
                $("#CSV").removeClass("radio-checked");
            }
            if (data[0].FLAG.toLowerCase() == sessionStorage.flagTrue) {
                $('#stop_notifications1').removeClass('check-checked');
                $('#toggleLabel1').prop('checked', true);
            } else {
                $('#stop_notifications1').addClass('check-checked');
                $('#toggleLabel1').prop('checked', false);
            }
        }).error(function(error) {
		  if(error.status === 0 && !localStorage.jwtToken) {
		    logoutClient();
		  }else {
		    $('#alertReport_error').attr('data-i18n', 'errorTranslation.reportDataNotAvailable');
            $('#errorReport').css('display', 'block');
            $('#successReport').css('display', 'none');
			errori18();
		  }
		});
    } else {

    }
}

// delete mail ids
function deleteLowSimReportId(ele) {
    var timezone = getTimezone();
    var lastvalue = ele.charAt(ele.length - 1);
    var emailvalue = $('#emailvalue' + lastvalue).text();
    var reportName = sessionStorage.reportNameLowSIM;
    var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
    $.ajax({
        method: "DELETE",
        async: false,
        url: ajaxUrl,
        data: {
            "emailAddress": emailvalue
        },
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        var reportName = sessionStorage.reportNameLowSIM;
        var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
        $.ajax({
            method: "GET",
            async: false,
            url: ajaxURL,
            headers: {
                'Authorization': localStorage.jwtToken,
            },
            crossDomain: true,
        }).success(function(data) {
            var parseData = JSON.parse(data[0].EMAIL_IDS);
            var parseDataLength = parseData.length;
            if (parseData === null || parseData === undefined || parseData === '[]') {
                $('#email-error-block').css('display', 'block');
                $('#email-success-block').css('display', 'none');
                $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.noMailIdAdded');
                $('#popup2').css('display', 'none');
                errori18();
            } else {
                var htmlContent = "";
                $('#emailList').html = "";
                for (var i = 0; i < parseDataLength; i++) {
                    htmlContent = htmlContent + '<tr><td id="emailvalue' + i + '">' +
                        parseData[i].emailId + '</td><td>' + new Date(parseData[i].modifiedDate).format(
                            "dd/mm/yyyy, HH:MM:ss") +
                        ' ' + timezone +
                        '</td><td>' +
                        '<img class="bin-icon" id="email' + i + '" src="/img/bin.png" onClick="deleteLowSimReportId(this.id)"></td></tr>';
                }
                $('#emailList').html(htmlContent);
            }
        }).error(function(error) {
		  if(error.status === 0 && !localStorage.jwtToken) {
		    logoutClient();
		  }
		});
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
    errori18();
}

// validation on day range 
$('#rep_days').change(function() {
    $('#errorReport').css('display', 'none');
    $('#alertReport_error').empty();
    var repDays = document.getElementById('rep_days').value;
    if (isNaN(repDays)) {
        $('#alertReport_error').attr('data-i18n', 'errorTranslation.invalidDays');
        $('#errorReport').css('display', 'block');
        $('#successReport').css('display', 'none');
    } else if (repDays < 1 || repDays > 180) {
        $('#alertReport_error').attr('data-i18n', 'errorTranslation.incorrectDays');
        $('#errorReport').css('display', 'block');
        $('#successReport').css('display', 'none');
    } else {
        $('#errorReport').css('display', 'none');
        $('#successReport').css('display', 'none');
    }
    errori18();
});

// reset all values in report div  
$('#low_note_reset').click(function() {
    $('#errorReport').css('display', 'none');
    $('#successReport').css('display', 'none');
    $('#repFreqOption1').parent().hide();
    $('#repFreqOption1').parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $('#repFreqOption1').parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    $('#repFreqTimeOption1').parent().hide();
    $('#repFreqTimeOption1').parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $('#repFreqTimeOption1').parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    $('#reportTypeOption1').parent().hide();
    $('#reportTypeOption1').parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $('#reportTypeOption1').parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    var reportName = $('#repTypeSelect').attr("data-value");
    var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewReportingAjax.replace('{reportName}', reportName);
    $.ajax({
        method: "GET",
        async: false,
        url: ajaxURL,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        document.getElementById("rep_days").value = data[0].DATE_RANGE;
        if (data[0].BATCH_RUN_TIME == sessionStorage.nine) {
            $('#repFreqTimeSelect').attr("data-value", $('#repFreqTimeOption1').attr("data-value"));
			$('#repFreqTimeSelect').attr('data-i18n', 'translation.repFreqTimeOption12');
			translationi18();
        }
        if (data[0].BATCH_RUN_TIME == sessionStorage.seventeen) {
            $('#repFreqTimeSelect').attr("data-value", $('#repFreqTimeOption2').attr("data-value"));
			$('#repFreqTimeSelect').attr('data-i18n', 'translation.repFreqTimeOption22');
			translationi18();
        }
        if (data[0].FREQUENCY_TYPE == sessionStorage.Daily) {
            $('#repFreqSelect').attr("data-value", $('#repFreqOption1').attr("data-value"));
            $('#r_date').css('display', 'none');
			$('#repFreqSelect').attr('data-i18n', 'translation.daily');
			translationi18();
        } else if (data[0].FREQUENCY_TYPE == sessionStorage.monthly) {
            $('#repFreqSelect').attr("data-value", $('#repFreqOption3').attr("data-value"));
            document.getElementById("Rep_date").value = data[0].FREQUENCY_DAY;
			$('#repFreqSelect').attr('data-i18n','translation.monthly');
            $('#r_date').css('display', 'block');
			translationi18();
        } else if (data[0].FREQUENCY_TYPE == sessionStorage.weekly) {
            $('#repFreqSelect').attr("data-value", $('#repFreqOption2').attr("data-value"));
            document.getElementById("Rep_date").value = data[0].FREQUENCY_DAY;
			$('#repFreqSelect').attr('data-i18n','translation.weekly');
            $('#r_date').css('display', 'block');
			translationi18();
        } else {}
        if (data[0].FORMAT.toLowerCase() == sessionStorage.csv) {
            $('#csv-radio').attr('checked', 'checked');
            $("#CSV").addClass("radio-checked");
            $("#both-radio").removeAttr("checked");
            $("#xml-radio").removeAttr("checked");
            $("#XML").removeClass("radio-checked");
            $("#both").removeClass("radio-checked");
        } else if (data[0].FORMAT.toLowerCase() == sessionStorage.xml) {
            $('#xml-radio').attr('checked', 'checked');
            $("#csv-radio").removeAttr("checked");
            $("#both-radio").removeAttr("checked");
            $("#XML").addClass("radio-checked");
            $("#CSV").removeClass("radio-checked");
            $("#both").removeClass("radio-checked");
        } else {
            $('#both-radio').attr('checked', 'checked');
            $("#both").addClass("radio-checked");
            $("#csv-radio").removeAttr("checked");
            $("#xml-radio").removeAttr("checked");
            $("#XML").removeClass("radio-checked");
            $("#CSV").removeClass("radio-checked");
        }
        if (data[0].FLAG.toLowerCase() == sessionStorage.flagTrue) {
            $('#stop_notifications1').removeClass('check-checked');
        } else {
            $('#stop_notifications1').addClass('check-checked');
        }
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
});

// save report configuration
$('#low_note_apply').click(function() {
    $('#errorReport').css('display', 'none');
    $('#alertReport_error').empty();
    $('#alertReport_success').empty();
    var reportType = $('#repTypeSelect').attr("data-value");
    var date_range = document.getElementById('rep_days').value;
    var frequencyType = $('#repFreqSelect').attr("data-value");
    var frequncyDay = document.getElementById('Rep_date').value;
    var datevalid = new RegExp(sessionStorage.dateRegex);
    var frequencyTime = $('#repFreqTimeSelect').attr("data-value");
    var form, flag;
    var startingDate = $("#Rep_date").val().split("/").reverse().join("-");;
    var temp = frequncyDay.split('-');
    if (isNaN(date_range)) {
        $('#alertReport_error').attr('data-i18n', 'errorTranslation.invalidDays');
        $('#errorReport').css('display', 'block');
        $('#successReport').css('display', 'none');
    } else if (date_range < 1 || date_range > 180) {
        $('#alertReport_error').attr('data-i18n', 'errorTranslation.incorrectDays');
        $('#errorReport').css('display', 'block');
        $('#successReport').css('display', 'none');
    } else if (date_range.indexOf('.') != -1) {
        $('#alertReport_error').attr('data-i18n', 'errorTranslation.incorrectDays');
        $('#errorReport').css('display', 'block');
        $('#successReport').css('display', 'none');
    } else if (frequencyTime == undefined) {
        $('#alertReport_error').attr('data-i18n', 'errorTranslation.incorrectTime');
        $('#errorReport').css('display', 'block');
        $('#successReport').css('display', 'none');
        errori18();
    } else if (frequencyType == undefined) {
        $('#alertReport_error').attr('data-i18n', 'errorTranslation.invalid_frequency_type');
        $('#errorReport').css('display', 'block');
        $('#successReport').css('display', 'none');
    } else if (datevalid.test(frequncyDay) == false && (frequencyType == sessionStorage.monthly || frequencyType == sessionStorage.weekly)) {
        $('#alertReport_error').attr('data-i18n', 'errorTranslation.invaildDate');
        $('#errorReport').css('display', 'block');
        $('#successReport').css('display', 'none');
    } else if (new Date(startingDate) > new Date()) {
        $('#alertReport_error').attr('data-i18n', 'errorTranslation.no_future_date');
        $('#errorReport').css('display', 'block');
        $('#successReport').css('display', 'none');
        errori18();
    } else {
        if (frequencyTime == 'Morning') {
            frequencyTime = sessionStorage.nine;
        }
        if (frequencyTime == 'Evening') {
            frequencyTime = sessionStorage.seventeen;
        }
        if ($('#CSV').hasClass('radio-checked')) {
            form = document.getElementById("CSV").innerHTML;
        } else if ($('#both').hasClass('radio-checked')) {
            form = document.getElementById("both").innerHTML;
        } else if ($('#XML').hasClass('radio-checked')) {
            form = document.getElementById("XML").innerHTML;
        } else {
            form = null;
            $('#alertReport_error').attr('data-i18n', 'errorTranslation.no_report_format');
            $('#errorReport').css('display', 'block');
            $('#successReport').css('display', 'none');
            errori18();
        }
        if ($('#stop_notifications1').hasClass('check-checked')) {
            flag = false;
        } else {
            flag = true;
        }
        if (form) {
            var reportName = $('#repTypeSelect').attr("data-value");
            var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.updateReportingAjax.replace('{reportName}', reportName)
            $.ajax({
                method: "PUT",
                async: false,
                url: ajaxUrl,
                data: JSON.stringify({
                    "frequencyType": frequencyType,
                    "frequencyDay": frequncyDay,
                    "dateRange": date_range,
                    "batchRunTime": frequencyTime,
                    "reportFormat": form,
                    "flag": flag
                }),
                headers: {
                    'Authorization': localStorage.jwtToken,
                },
			    contentType: "application/json; charset=utf-8",
                crossDomain: true,
            }).success(function(data) {
                $('#alertReport_success').empty();
                $('#alertReport_success').attr('data-i18n', 'translation.saveConfiguration');
                $('#errorReport').css('display', 'none');
                $('#successReport').css('display', 'block');
                $('#low_note_cancel_report').hide();
				$("#toggleLabel1").attr("disabled",'disabled');
				$(".css-switch").css("cursor","auto");
				$("#toggleswitch1").css("opacity","0.5");
				translationi18();
                disableEditReport();
            }).error(function(error) {
			  if(error.status === 0 && !localStorage.jwtToken) {
			    logoutClient();
		      }else {
                $('#alertReport_error').attr('data-i18n', 'errorTranslation.genericFailure');
                $('#errorReport').css('display', 'block');
                $('#successReport').css('display', 'none');
			  }
            });
        }
    }
    errori18();
});

$('#Rep_date_1').change(function() {
    $('#alertLowSIM_error').empty();
    var frequncyDay = document.getElementById('Rep_date_1').value;
    var datevalid = new RegExp(sessionStorage.dateRegex);
    if (datevalid.test(frequncyDay) == false) {
        $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.invaildDate');
        $('#errorLowSIM').css('display', 'block');
        $('#successLowSIM').css('display', 'none');
    } else {
        $('#errorLowSIM').css('display', 'none');
        $('#successLowSIM').css('display', 'none');
        $('#alertLowSIM_error').removeAttr('data-i18n', 'errorTranslation.invaildDate');
    }
    errori18();
});
$('#Rep_date').change(function() {
    $('#alertReport_error').empty();
    var frequncyDay = document.getElementById('Rep_date').value;
    var datevalid = new RegExp(sessionStorage.dateRegex);
    if (datevalid.test(frequncyDay) == false) {
        $('#alertReport_error').attr('data-i18n', 'errorTranslation.invaildDate');
        $('#errorReport').css('display', 'block');
        $('#successReport').css('display', 'none');
    } else {
        $('#alertReport_error').removeAttr('data-i18n', 'errorTranslation.invaildDate');
        $('#errorReport').css('display', 'none');
        $('#successReport').css('display', 'none');
    }
    errori18();
});

$('#apply-note-mailSetting').click(function() {

    $('#popup').fadeOut(function() {
        $(".modal-overlay").remove();
    });
    $('#stop_notifications').removeClass('type check-label');
    $('#stop_notifications').addClass('type check-label check-checked');
});

$('#cancel-note-mailSetting').click(function() {

    $('#popup').fadeOut(function() {
        $(".modal-overlay").remove();
    });
    $('#stop_notifications').removeClass('type check-label check-checked');
    $('#stop_notifications').addClass('type check-label');
});

$('#report_yes').click(function() {

    $('#popup12').fadeOut(function() {
        $(".modal-overlay").remove();
    });
});

$('#report_no').click(function() {
    $('#popup12').fadeOut(function() {
        $(".modal-overlay").remove();
    });
    $('#stop_notifications1').removeClass('check-checked');
});

$('#thrshld_days').keyup(function() {
  $("#low_note_apply_acc2").attr("disabled","disabled");
  $("#low_note_apply_acc2").addClass("btn_disabled");
  var thresholdValue = $('#thrshld_days').val();
  if(thresholdValue === "") {
	  $('#errorLowSIM').css('display', 'none');
      $('#successLowSIM').css('display', 'none');
  }
});

$('#thrshld_days').blur(function () {
  $('#alertLowSIM_error').empty();
  $('#low_note_apply_acc2').attr('disabled', 'disabled');
  $('#low_note_apply_acc2').addClass('btn_disabled');
  const thresholdValue = $('#thrshld_days').val();
  if (thresholdValue.trim() === '' || thresholdValue < 0 || thresholdValue.indexOf('.') !== -1 || isNaN(thresholdValue)) {
    $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.invalidthresold');
    $('#errorLowSIM').css('display', 'block');
    $('#successLowSIM').css('display', 'none');
  } else {
    $('#errorLowSIM').css('display', 'none');
    $('#successLowSIM').css('display', 'none');
    const profileType = $('#profTypeSelect').attr('data-value');
    const graphAjaxURL = sessionStorage.gatewayurl + sessionStorage.simGraph;
    $.ajax({
      method: 'GET',
      async: true,
      url: graphAjaxURL,
      headers: {
        Authorization: localStorage.jwtToken,
      },
      jsonpCallback: 'jsonCallback',
      crossDomain: true,
      dataType: 'json',
    }).success(function (data) {
      const profileTypeReq = data.filter(function (profType) {
        return (profType.PROFILE_TYPE === profileType);
      })[0];
      $('#low_note_apply_acc2').removeAttr('disabled');
      $('#low_note_apply_acc2').removeClass('btn_disabled');
      if ((profileTypeReq && Number(profileTypeReq.SIM_COUNT) < Number(thresholdValue)) ||
      (!profileTypeReq && Number(thresholdValue))) {
        $('#lowStock_threshold_warning').css('display', 'block');
      } else {
        $('#lowStock_threshold_warning').css('display', 'none');
      }
      translationi18();
    }).error(function (error) {
      if (error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
      }
      if (error.status === 404) {
        $('#low_note_apply_acc2').removeAttr('disabled');
        $('#low_note_apply_acc2').removeClass('btn_disabled');
        if (Number(thresholdValue) > 0) {
          $('#lowStock_threshold_warning').css('display', 'block');
        } else {
          $('#lowStock_threshold_warning').css('display', 'none');
        }
      }
    });
  }
  errori18();
});

// save low SIM configuration
$('#low_note_apply_acc2').click(function() {
  $('#lowStock_threshold_warning').css('display', 'none');
	$('#lowStockConfig_warning').hide();
	$('#errorLowSIM').css('display', 'none');
    $('#alertLowSIM_error').empty();
    $('#alertLowSIM_success').empty();
	var frequencyTime;
    var profileType = $("#profTypeSelect").attr("data-value");
    var thresoldValue = document.getElementById('thrshld_days').value;
    var frequencyType = $('#repFreqSelect_next').attr("data-value");
    var temp1 = $('#repFreqTimeSelect1').attr("data-value");
    var temp2 = $('#repFreqTimeSelect2').attr("data-value");
    var datevalid = new RegExp(sessionStorage.dateRegex);
    var frequncyDay = document.getElementById('Rep_date_1').value;
    var startingDate = $("#Rep_date_1").val().split("/").reverse().join("-");
    var reportName = sessionStorage.reportNameLowSIM;
	var flag;
	if(thresoldValue.trim() === ''){
		$('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.invalidthresold');
        $('#errorLowSIM').css('display', 'block');
        $('#successLowSIM').css('display', 'none');
	}
    else if (isNaN(thresoldValue)) {
        $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.invalidthresold');
        $('#errorLowSIM').css('display', 'block');
        $('#successLowSIM').css('display', 'none');
    } else if (!thresoldValue) {
        $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.invalidthresold');
        $('#errorLowSIM').css('display', 'block');
        $('#successLowSIM').css('display', 'none');
    } else if (thresoldValue < 0 || thresoldValue.indexOf('.') != -1) {
        $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.invalidthresold');
        $('#errorLowSIM').css('display', 'block');
        $('#successLowSIM').css('display', 'none');
    } else if (temp1 == temp2 && frequencyType == sessionStorage.Daily) {
        $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.incorrectTime');
        $('#errorLowSIM').css('display', 'block');
        $('#successLowSIM').css('display', 'none');
    } else if (frequencyType == undefined) {
        $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.invalid_frequency_type');
        $('#errorLowSIM').css('display', 'block');
        $('#successLowSIM').css('display', 'none');
    } else if ((temp2 == undefined) && (frequencyType == sessionStorage.monthly || frequencyType == sessionStorage.weekly)) {
        $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.invalidTime');
        $('#errorLowSIM').css('display', 'block');
        $('#successLowSIM').css('display', 'none');
    } else if (datevalid.test(frequncyDay) == false && (frequencyType == sessionStorage.monthly || frequencyType == sessionStorage.weekly)) {
        $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.invaildDate');
        $('#errorLowSIM').css('display', 'block');
        $('#successLowSIM').css('display', 'none');
    } else if (new Date(startingDate) > new Date()) {
        $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.no_future_date');
        $('#errorLowSIM').css('display', 'block');
        $('#successLowSIM').css('display', 'none');
        errori18();
    } else {
        if (frequencyType == sessionStorage.Daily) {
            if (temp1 == 'Evening' && (temp2 == undefined)) {
                frequencyTime = sessionStorage.seventeen;
            } else if (temp1 == 'Morning' && (temp2 == undefined)) {
                frequencyTime = sessionStorage.nine;
            } else if (temp2 == 'Evening' && (temp1 == undefined)) {
                frequencyTime = sessionStorage.seventeen;
            } else if (temp2 == 'Morning' && (temp1 == undefined)) {
                frequencyTime = sessionStorage.nine;
            } else if (temp1 == 'Morning' && temp2 == 'Evening') {
                frequencyTime = sessionStorage.nine + ',' + sessionStorage.seventeen;
            } else if (temp1 == 'Evening' && temp2 == 'Morning') {
                frequencyTime = sessionStorage.seventeen + ',' + sessionStorage.nine;
            } else {}
        } else {
            if (temp2 == 'Evening') {
                frequencyTime = sessionStorage.seventeen;
            } else {
                frequencyTime = sessionStorage.nine;
            }
        }
		if($('#toggleLabel2').is(':checked')){
          flag = true;
        } else {
		  flag = false;
        }
        var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.lowSimUpdateAjax.replace('{reportName}', reportName);
        $.ajax({
            method: "PUT",
            async: false,
            url: ajaxUrl,
            data: JSON.stringify({
                "thresoldParam": profileType,
                "thresoldValue": thresoldValue,
                "frequencyType": frequencyType,
                "frequencyDay": frequncyDay,
                "batchRunTime": frequencyTime,
                "flag": flag
            }),
            headers: {
                'Authorization': localStorage.jwtToken,
            },
			contentType: "application/json; charset=utf-8",
            crossDomain: true,
        }).success(function(data) {
            $('#alertLowSIM_success').attr('data-i18n', 'translation.saveConfiguration');
            $('#successLowSIM').css('display', 'block');
            $('#errorLowSIM').css('display', 'none');
			$("#toggleLabel2").attr("disabled",'disabled');
			$(".css-switch").css("cursor","auto");
			$("#toggleswitch2").css("opacity","0.5");
			sessionStorage.lowSimStockProfile = profileType;
			translationi18();
            disableEditLowSIM();
        }).error(function(error) {
		  if(error.status === 0 && !localStorage.jwtToken) {
		    logoutClient();
		  } else {
			if(error.status === 404){
			  $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.recordBelowThreshold');
              $('#errorLowSIM').css('display', 'block');
              $('#successLowSIM').css('display', 'none');	
			}
			else {
			  $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.genericFailure');
              $('#errorLowSIM').css('display', 'block');
              $('#successLowSIM').css('display', 'none');	
			}
		  }
        });
    }
    errori18();
});

$("#Add_email").click(function() {
  $('#alertLowSIM_error').empty();
  $('#alertLowSIM_success').empty();
  $('#successLowSIM').css('display', 'none');
  $('#errorLowSIM').css('display', 'none');
  var fetchedVAlue = document.getElementById("email_notify").value;
  var regexPattern = /^([A-Za-z0-9_\-\.])+\@(vodafone.com)$/;
  if (fetchedVAlue.search(',') > 0) {
    var temp = fetchedVAlue.split(',');
    var flag = false;
    for (var i = 0; i < temp.length; i++) {
      if (regexPattern.test(temp[i]) == false) {
        flag = true;
        break;
      }
    }
    if (flag) {
      $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.invalidEmailId');
      $('#successLowSIM').css('display', 'none');
      $('#errorLowSIM').css('display', 'block');
      $('#email_notify').val('');
      errori18();
    } else {
      var reportName = sessionStorage.reportNameLowSIM;
      var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
      $.ajax({
        method: "POST",
        async: false,
        url: ajaxURL,
        data: JSON.stringify({
          "emailAddresses": fetchedVAlue
        }),
        headers: {
          'Authorization': localStorage.jwtToken,
        },
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
      }).success(function(data) {
        if (data.error === sessionStorage.duplicateEmail) {
          $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.alreadyPresent');
          $('#errorLowSIM').css('display', 'block');
          $('#email_notify').val('');
          errori18();
        } else if (data.error === sessionStorage.duplicateMultipleEmail) {
          $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.mutipleDuplicate');
          $('#errorLowSIM').css('display', 'block');
          $('#email_notify').val('');
          errori18();
        } else {
          $('#alertLowSIM_success').attr('data-i18n', 'translation.updateEmailId');
          $('#successLowSIM').css('display', 'block');
          $('#errorLowSIM').css('display', 'none');
          $('#email_notify').val('');
          translationi18();
        }
      }).error(function(data) {
		if(data.status === 0 && !localStorage.jwtToken) {
		  logoutClient();
		} else {
          var error = JSON.parse(data.responseText).error;
          if (error === sessionStorage.duplicateEmail) {
            $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.alreadyPresent');
            $('#errorLowSIM').css('display', 'block');
            $('#email_notify').val('');
            errori18();
          } else if (error === sessionStorage.duplicateMultipleEmail) {
            $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.mutipleDuplicate');
            $('#errorLowSIM').css('display', 'block');
            $('#email_notify').val('');
            errori18();
          }
	    }
      });
    }
  } else {
    if (regexPattern.test(fetchedVAlue) == true) {
      var reportName = sessionStorage.reportNameLowSIM;
      var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
      $.ajax({
        method: "POST",
        async: false,
        url: ajaxURL,
        data: JSON.stringify({
          "emailAddresses": fetchedVAlue
        }),
        headers: {
          'Authorization': localStorage.jwtToken,
        },
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
      }).success(function(data) {
        if (data.error === sessionStorage.duplicateEmail) {
          $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.alreadyPresent');
          $('#errorLowSIM').css('display', 'block');
          $('#email_notify').val('');
          errori18();
        } else if (data.error === sessionStorage.duplicateMultipleEmail) {
          $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.mutipleDuplicate');
          $('#errorLowSIM').css('display', 'block');
          $('#email_notify').val('');
          errori18();
        } else {
          $('#alertLowSIM_success').attr('data-i18n', 'translation.updateEmailId');
          $('#successLowSIM').css('display', 'block');
          $('#errorLowSIM').css('display', 'none');
          $('#email_notify').val('');
          translationi18();
        }
      }).error(function(data) {
		if(data.status === 0 && !localStorage.jwtToken) {
		  logoutClient();
		} else {
          var error = JSON.parse(data.responseText).error;
          if (error === sessionStorage.duplicateEmail) {
            $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.alreadyPresent');
            $('#errorLowSIM').css('display', 'block');
            $('#email_notify').val('');
            errori18();
          } else if (error === sessionStorage.duplicateMultipleEmail) {
            $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.mutipleDuplicate');
            $('#errorLowSIM').css('display', 'block');
            $('#email_notify').val('');
            errori18();
          }
		}
      });
    } else {
      $('#alertLowSIM_error').attr('data-i18n', 'errorTranslation.invalidEmailId');
      $('#successLowSIM').css('display', 'none');
      $('#errorLowSIM').css('display', 'block');
      $('#email_notify').val('');
      errori18();
    }
  }
});
// report generation intial setting fetching
$('#manageAutomateAnchor').click(function() {
    $('#errorReport').css('display', 'none');
    $('#successReport').css('display', 'none');
});

// edit button click
$('#low_note_edit_report').click(function() {
    $('#low_note_edit_report').data('clicked', 'yes');
    $("#acc-col-1-fre").css('pointer-events', 'auto');
    $("#acc-col-1-fre").removeClass("btn_disabled");
    $("#rep_days").css('pointer-events', 'auto');
    $("#rep_days").removeClass("btn_disabled");
    $("#Rep_date").css('pointer-events', 'auto');
    $("#Rep_date").removeClass("btn_disabled");
    $("#Rep_time").css('pointer-events', 'auto');
    $("#Rep_time").removeClass("btn_disabled");
    $("#csv-radio").css('pointer-events', 'auto');
    $("#csv-radio").removeClass("btn_disabled");
    $("#xml-radio").css('pointer-events', 'auto');
    $("#xml-radio").removeClass("btn_disabled");
    $("#both-radio").css('pointer-events', 'auto');
    $("#both-radio").removeClass("btn_disabled");
	$("#toggleLabel1").removeAttr('disabled');
	$(".css-switch").css("cursor","pointer");
    $("#CSV").css('pointer-events', 'auto');
    $("#XML").css('pointer-events', 'auto');
	$("#toggleswitch1").css("opacity","1");
    $("#both").css('pointer-events', 'auto');
    $('#errorReport').css('display', 'none');
    $('#successReport').css('display', 'none');
    $('#low_note_edit_report').hide();
    $('#low_note_apply').show();
    $('#low_note_reset').show();
    $('#low_note_cancel_report').show();
    $('#low_note_cancel_report').css('display', 'inline-block');
});
// cancel report
$('#low_note_cancel_report').click(function() {
    $('#errorReport').css('display', 'none');
    $('#successReport').css('display', 'none');
	$("#toggleLabel1").attr("disabled",'disabled');
    $(".css-switch").css("cursor","auto");
	$("#toggleswitch1").css("opacity","0.5");
    $('#low_note_cancel_report').hide();
    disableEditReport();
    var reportName = $('#repTypeSelect').attr("data-value");
    var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewReportingAjax.replace('{reportName}', reportName);
    $.ajax({
        method: "GET",
        async: false,
        url: ajaxURL,
        crossDomain: true,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
    }).success(function(data) {
        document.getElementById("rep_days").value = data[0].DATE_RANGE;
        document.getElementById("Rep_date").value = data[0].FREQUENCY_DAY;
        if (data[0].BATCH_RUN_TIME == sessionStorage.nine) {
            $('#repFreqTimeSelect').attr("data-value", $('#repFreqTimeOption1').attr("data-value"));
			$('#repFreqTimeSelect').attr('data-i18n', 'translation.repFreqTimeOption12');
			translationi18();
        }
        if (data[0].BATCH_RUN_TIME == sessionStorage.seventeen) {
            $('#repFreqTimeSelect').attr("data-value", $('#repFreqTimeOption2').attr("data-value"));
			$('#repFreqTimeSelect').attr('data-i18n', 'translation.repFreqTimeOption22');
			translationi18();
        }
        if (data[0].FREQUENCY_TYPE == sessionStorage.Daily) {
            $('#repFreqSelect').attr("data-value", $('#repFreqOption1').attr("data-value"));
			$('#repFreqSelect').attr('data-i18n', 'translation.daily');
            $('#r_date').css('display', 'none');
			translationi18();
        } else if (data[0].FREQUENCY_TYPE == sessionStorage.monthly) {
            $('#repFreqSelect').attr("data-value", $('#repFreqOption3').attr("data-value"));
            $('#r_date').css('display', 'block');
			$('#repFreqSelect').attr('data-i18n','translation.monthly');
			translationi18();
        } else if (data[0].FREQUENCY_TYPE == sessionStorage.weekly) {
            $('#repFreqSelect').attr("data-value", $('#repFreqOption2').attr("data-value"));
            $('#r_date').css('display', 'block');
			$('#repFreqSelect').attr('data-i18n','translation.weekly');
			translationi18();
        } else {}
        if (data[0].FORMAT.toLowerCase() == sessionStorage.csv) {
            $('#csv-radio').attr('checked', 'checked');
            $("#CSV").addClass("radio-checked");
            $("#both-radio").removeAttr("checked");
            $("#xml-radio").removeAttr("checked");
            $("#XML").removeClass("radio-checked");
            $("#both").removeClass("radio-checked");
        } else if (data[0].FORMATtoLowerCase() == sessionStorage.xml) {
            $('#xml-radio').attr('checked', 'checked');
            $("#csv-radio").removeAttr("checked");
            $("#both-radio").removeAttr("checked");
            $("#XML").addClass("radio-checked");
            $("#CSV").removeClass("radio-checked");
            $("#both").removeClass("radio-checked");
        } else {
            $('#both-radio').attr('checked', 'checked');
            $("#both").addClass("radio-checked");
            $("#csv-radio").removeAttr("checked");
            $("#xml-radio").removeAttr("checked");
            $("#XML").removeClass("radio-checked");
            $("#CSV").removeClass("radio-checked");
        }
        if (data[0].FLAG.toLowerCase() == sessionStorage.flagTrue) {
            $('#stop_notifications1').removeClass('check-checked');
        } else {
            $('#stop_notifications1').addClass('check-checked');
        }
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
});

$('#low_note_cancel_acc2').click(function() {
	$('#lowStockConfig_warning').hide();
	$('#lowStock_threshold_warning').css('display', 'none');
    $('#successLowSIM').css('display', 'none');
    $('#errorLowSIM').css('display', 'none');
	$("#toggleLabel2").attr("disabled",'disabled');
    $(".css-switch").css("cursor","auto");
	$("#toggleswitch2").css("opacity","0.5");
    $('#low_note_cancel_acc2').hide();
    disableEditLowSIM();
    var option = $("#profTypeSelect").attr("data-value");
	sessionStorage.lowSimStockProfile = option;
    var reportName = sessionStorage.reportNameLowSIM;
    var ajaxURL = sessionStorage.gatewayurl + sessionStorage.lowSimViewAjax.replace('{reportName}', reportName);
    $.ajax({
        method: "GET",
        async: false,
        url: ajaxURL,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        for (var i = 0; i < data.length; i++) {
            if (option === data[i].THRESHOLD_PARAM) {
                document.getElementById("thrshld_days").value = data[i].THRESHOLD_VALUE;
                document.getElementById("Rep_date_1").value = data[i].FREQUENCY_DAY;
                if (data[i].FREQUENCY_TYPE == sessionStorage.Daily) {
                    $('#repFreqSelect_next').attr("data-value", $('#repFreqNextOption1').attr("data-value"));
					$('#repFreqSelect_next').attr('data-i18n', 'translation.daily');
                    $('#Rep_date_1').css('display', 'none');
                    $("#Rep_time_1").show();
                    $('#Report_date_1').css('display', 'none');
                    $('#Report_time_1').css('display', 'block');
					$('#repFreqTimeSelect2').attr('data-i18n', 'translation.subTypeSelect');
					$('#repFreqTimeSelect1').attr('data-i18n', 'translation.subTypeSelect');
					translationi18();
                    if (data[i].BATCH_RUN_TIME.search(',') != -1) {
                        var temp = data[i].BATCH_RUN_TIME.split(',');
                        if (temp[0] == sessionStorage.nine && temp[1] == sessionStorage.seventeen) {
                            $('#repFreqTimeSelect1').attr("data-value", $('#repFreqTimeOption11').attr("data-value"));
                            $('#repFreqTimeSelect1').attr('data-i18n', 'translation.repFreqTimeOption12');
                            $('#repFreqTimeSelect2').attr("data-value", $('#repFreqTimeOption22').attr("data-value"));
                            $('#repFreqTimeSelect2').attr('data-i18n', 'translation.repFreqTimeOption22');
							translationi18();
                        } else if (temp[0] == sessionStorage.seventeen && temp[1] == sessionStorage.nine) {
                            $('#repFreqTimeSelect1').attr("data-value", $('#repFreqTimeOption21').attr("data-value"));
                            $('#repFreqTimeSelect1').attr('data-i18n', 'translation.repFreqTimeOption22');
                            $('#repFreqTimeSelect2').attr("data-value", $('#repFreqTimeOption12').attr("data-value"));
                            $('#repFreqTimeSelect2').attr('data-i18n', 'translation.repFreqTimeOption12');
							translationi18();
                        }
                    } else {
                        $('#repFreqTimeSelect2').attr('data-i18n', 'translation.subTypeSelect');
                        translationi18();
                        if (data[i].BATCH_RUN_TIME == sessionStorage.nine) {
                            $('#repFreqTimeSelect1').attr("data-value", $('#repFreqTimeOption11').attr("data-value"));
                            $('#repFreqTimeSelect1').attr('data-i18n', 'translation.repFreqTimeOption12');
                        } else {
                            $('#repFreqTimeSelect1').attr("data-value", $('#repFreqTimeOption21').attr("data-value"));
                            $('#repFreqTimeSelect1').attr('data-i18n', 'translation.repFreqTimeOption22');
                        }
                    }
                    $("#Report_time_1").attr('data-i18n', 'translation.Report_time_1');
                    $("#Report_time_2").attr('data-i18n', 'translation.Report_time_2');
                    translationi18();
                } else if (data[i].FREQUENCY_TYPE == sessionStorage.monthly) {
                    $('#repFreqSelect_next').attr("data-value", $('#repFreqNextOption3').attr("data-value"));
					$('#repFreqSelect_next').attr('data-i18n','translation.monthly');
                    $("#Rep_time_1").hide();
                    $('#Report_time_1').css('display', 'none');
                    $('#Report_time_class').css('display', 'block');
                    $('#Rep_date_1').css('display', 'inline-block');
                    $('#Report_date_1').css('display', 'block');
                    $("#Report_time_2").attr('data-i18n', 'translation.Report_time');
                    translationi18();
                    if (data[i].BATCH_RUN_TIME == sessionStorage.nine) {
                        $('#repFreqTimeSelect2').attr("data-value", $('#repFreqTimeOption12').attr("data-value"));
                        $('#repFreqTimeSelect2').attr('data-i18n', 'translation.repFreqTimeOption12');
						translationi18();
                    } else {
                        $('#repFreqTimeSelect2').attr("data-value", $('#repFreqTimeOption22').attr("data-value"));
                        $('#repFreqTimeSelect2').attr('data-i18n', 'translation.repFreqTimeOption22');
						translationi18();
                    }
                } else if (data[i].FREQUENCY_TYPE == sessionStorage.weekly) {
                    $('#repFreqSelect_next').attr("data-value", $('#repFreqNextOption2').attr("data-value"));
					$('#repFreqSelect_next').attr('data-i18n','translation.weekly');
                    $("#Rep_time_1").hide();
                    $('#Report_time_1').css('display', 'none');
                    $('#Report_time_class').css('display', 'block');
                    $('#Rep_date_1').css('display', 'inline-block');
                    $('#Report_date_1').css('display', 'block');
                    $("#Report_time_2").attr('data-i18n', 'translation.Report_time');
                    translationi18();
                    if (data[i].BATCH_RUN_TIME == sessionStorage.nine) {
                        $('#repFreqTimeSelect2').attr("data-value", $('#repFreqTimeOption12').attr("data-value"));
                        $('#repFreqTimeSelect2').attr('data-i18n', 'translation.repFreqTimeOption12');
                    } else {
                        $('#repFreqTimeSelect2').attr("data-value", $('#repFreqTimeOption22').attr("data-value"));
                        $('#repFreqTimeSelect2').attr('data-i18n', 'translation.repFreqTimeOption22');
                    }
                } else {}
                if (data[i].FLAG.toLowerCase() == sessionStorage.flagTrue) {

                    $('#stop_notifications').removeClass('type check-label check-checked');
                    $('#stop_notifications').addClass('type check-label');
                } else {
                    $('#stop_notifications').removeClass('type check-label');
                    $('#stop_notifications').addClass('type check-label check-checked');
                }
                break;
            }
        }
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
      }
	});
});

// enable to frequency type ul
function selectFrequencyType(ele) {
    $('#errorReport').css('display', 'none');
    $('#successReport').css('display', 'none');
    var listId = '#'.concat(ele);
    $(listId).parent().prev(".cs-placeholder").children(".cs-title").text($(listId).attr("data-value"));
    $(listId).parent().hide();
    $(listId).parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $(listId).parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    var option = $(listId).attr("data-value");
    if (option == sessionStorage.Daily) {
        $('#Rep_date_1').css('display', 'none');
        $("#Rep_time_1").show();
        $('#Report_date_1').css('display', 'none');
        $('#Report_time_1').css('display', 'block');
        $('#Report_date_class').css('display', 'block');
    } else {
        $("#Rep_time_1").hide();
        $('#Report_time_1').css('display', 'none');
        $('#Report_time_class').css('display', 'block');
        $('#Rep_date_1').css('display', 'inline-block');
        $('#Report_date_1').css('display', 'block');
    }
}
// enable the fields for low SIM config
$("#low_note_edit_acc2").click(function() {
    $('#successLowSIM').css('display', 'none');
		$('#lowStockConfig_warning').css('display', 'block');
    $('#errorLowSIM').css('display', 'none');
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
	$("#toggleLabel2").removeAttr('disabled');
	$("#toggleswitch2").css("opacity","1");
    $(".css-switch").css("cursor","pointer");
    $('#low_note_edit_acc2').hide();
    $('#low_note_apply_acc2').show();
    $('#low_note_cancel_acc2').show();
    $('#successLowSIM').css('display', 'none');
    $('#errorLowSIM').css('display', 'none');
	$("#low_note_apply_acc2").attr("disabled","disabled");
	$("#low_note_apply_acc2").addClass("btn_disabled");
	translationi18();
});

function disableEditLowSIM() {
    $('#profileTypeOption0').parent().hide();
    $('#profileTypeOption0').parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $('#profileTypeOption0').parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    $('#repFreqNextOption1').parent().hide();
    $('#repFreqNextOption1').parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $('#repFreqNextOption1').parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    $('#repFreqTimeOption01').parent().hide();
    $('#repFreqTimeOption01').parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $('#repFreqTimeOption01').parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    $('#repFreqTimeOption02').parent().hide();
    $('#repFreqTimeOption02').parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $('#repFreqTimeOption02').parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    $("#prof_placeholder_opt").css('pointer-events', 'none');
    $("#prof_placeholder_opt").addClass("btn_disabled");
    $("#thrshld_days").css('pointer-events', 'none');
    $("#thrshld_days").addClass("btn_disabled");
    $("#Report_frequency_opt").css('pointer-events', 'none');
    $("#Report_frequency_opt").addClass("btn_disabled");
    $("#Rep_date_1").css('pointer-events', 'none');
    $("#Rep_date_1").addClass("btn_disabled");
    $("#Rep_time_1").css('pointer-events', 'none');
    $("#Rep_time_1").addClass("btn_disabled");
    $("#Rep_time_2").css('pointer-events', 'none');
    $("#Rep_time_2").addClass("btn_disabled");
    $('#low_note_edit_acc2').show();
    $('#low_note_apply_acc2').hide();
    $('#low_note_cancel_acc2').hide();
}

function disableEditReport() {
    $('#low_note_edit_report').show();
    $('#low_note_apply').hide();
    $('#low_note_reset').hide();
    $("#acc-col-1-fre").css('pointer-events', 'none');
    $("#acc-col-1-fre").addClass("btn_disabled");
    $("#rep_days").css('pointer-events', 'none');
    $("#rep_days").addClass("btn_disabled");
    $("#Rep_date").css('pointer-events', 'none');
    $("#Rep_date").addClass("btn_disabled");
    $("#Rep_time").css('pointer-events', 'none');
    $("#Rep_time").addClass("btn_disabled");
    $("#csv-radio").css('pointer-events', 'none');
    $("#csv-radio").addClass("btn_disabled");
    $("#xml-radio").css('pointer-events', 'remove');
    $("#xml-radio").addClass("btn_disabled");
    $("#both-radio").css('pointer-events', 'auto');
    $("#both-radio").removeClass("btn_disabled");
    $("#both").css('pointer-events', 'none');
    $("#XML").css('pointer-events', 'none');
    $("#CSV").css('pointer-events', 'none');
    $('#repFreqOption1').parent().hide();
    $('#repFreqOption1').parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $('#repFreqOption1').parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    $('#repFreqTimeOption1').parent().hide();
    $('#repFreqTimeOption1').parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $('#repFreqTimeOption1').parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();
    $('#reportTypeOption1').parent().hide();
    $('#reportTypeOption1').parent().prev(".cs-placeholder").children(".cs-arrow-up").hide();
    $('#reportTypeOption1').parent().prev(".cs-placeholder").children(".cs-arrow-dn").show();

}
$('#email-accordion5').click(function() {
    var ajaxURL = sessionStorage.gatewayurl + sessionStorage.failureReportUrl;
    sessionStorage.gatewayurl
    $.ajax({
        method: "GET",
        async: false,
        url: ajaxURL,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        var htmlContent = "<tr><td>" + data[0].REPORT_NAME + "</td><td>" + data[0].FAILURE_REASON + "</td><td>" + data[0].FREQUENCY_DAY + "," + data[0].BATCH_RUN_TIME + "</td></tr>";
        for (var i = 1; i < data.length; i++) {
            htmlContent = htmlContent + "<tr><td>" + data[i].REPORT_NAME + "</td><td>" + data[i].FAILURE_REASON + "</td><td>" + data[i].FREQUENCY_DAY + "," + data[i].BATCH_RUN_TIME + "</td></tr>";
        }
        document.getElementById("failureReport").innerHTML = htmlContent;
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
});

$("#Add_new_email").click(function() {
  $('#email-success-block').css('display', 'none');
  $('#email-error-block').css('display', 'none');
  var fetchedVAlue = document.getElementById("new_profile_email_notify").value;
  var regexPattern = /^([A-Za-z0-9_\-\.])+\@(vodafone.com)$/;
  $('#alertErrorInstant').empty();
  if (fetchedVAlue.search(',') > 0) {
    var temp = fetchedVAlue.split(',');
    var flag = false;
    for (var i = 0; i < temp.length; i++) {
      if (regexPattern.test(temp[i]) == false) {
        flag = true;
        break;
      }
    }
    if (flag) {
      $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.invalidEmailId');
      $('#email-success-block').css('display', 'none');
      $('#email-error-block').css('display', 'block');
      $('#new_profile_email_notify').val('');
      errori18();
    } else {
      var reportName = sessionStorage.reportInstantMail;
      var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
      $.ajax({
        method: "POST",
        async: false,
        url: ajaxURL,
        data: JSON.stringify({
          "emailAddresses": fetchedVAlue
        }),
        headers: {
          'Authorization': localStorage.jwtToken,
        },
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
      }).success(function(data) {
        if (data.error === sessionStorage.duplicateEmail) {
          $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.alreadyPresent');
          $('#email-error-block').css('display', 'block');
          $('#new_profile_email_notify').val('');
          errori18();
        } else if (data.error === sessionStorage.duplicateMultipleEmail) {
          $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.mutipleDuplicate');
          $('#email-error-block').css('display', 'block');
          $('#new_profile_email_notify').val('');
          errori18();
        } else {
          $('#alertSuccessInstant').attr('data-i18n', 'translation.updateEmailId');
          $('#email-success-block').css('display', 'block');
          $('#email-error-block').css('display', 'none');
          $('#new_profile_email_notify').val('');
          translationi18();
        }
      }).error(function(data) {
		if(data.status === 0 && !localStorage.jwtToken) {
		  logoutClient();
		} else {
          var error = JSON.parse(data.responseText).error;
          if (error === sessionStorage.duplicateEmail) {
            $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.alreadyPresent');
            $('#email-error-block').css('display', 'block');
            $('#new_profile_email_notify').val('');
            errori18();
          } else if (error === sessionStorage.duplicateMultipleEmail) {
            $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.mutipleDuplicate');
            $('#email-error-block').css('display', 'block');
            $('#new_profile_email_notify').val('');
            errori18();
          }
	    }
      });
    }
  } else {
    if (regexPattern.test(fetchedVAlue) == true) {
      var reportName = sessionStorage.reportInstantMail;
      var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
      $.ajax({
        method: "POST",
        async: false,
        url: ajaxURL,
        data: JSON.stringify({
          "emailAddresses": fetchedVAlue
        }),
        headers: {
          'Authorization': localStorage.jwtToken,
        },
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
      }).success(function(data) {
        if (data.error === sessionStorage.duplicateEmail) {
          $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.alreadyPresent');
          $('#email-error-block').css('display', 'block');
          $('#new_profile_email_notify').val('');
          errori18();
        } else if (data.error === sessionStorage.duplicateMultipleEmail) {
          $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.mutipleDuplicate');
          $('#email-error-block').css('display', 'block');
          $('#new_profile_email_notify').val('');
          errori18();
        } else {
          $('#alertSuccessInstant').attr('data-i18n', 'translation.updateEmailId');
          $('#email-success-block').css('display', 'block');
          $('#email-error-block').css('display', 'none');
          $('#new_profile_email_notify').val('');
          translationi18();
        }
      }).error(function(data) {
		if(data.status === 0 && !localStorage.jwtToken) {
		  logoutClient();
		} else {
          var error = JSON.parse(data.responseText).error;
          if (error === sessionStorage.duplicateEmail) {
            $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.alreadyPresent');
            $('#email-error-block').css('display', 'block');
            $('#new_profile_email_notify').val('');
            errori18();
          } else if (error === sessionStorage.duplicateMultipleEmail) {
            $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.mutipleDuplicate');
            $('#email-error-block').css('display', 'block');
            $('#new_profile_email_notify').val('');
            errori18();
          }
	    }
      });
    } else {
      $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.invalidEmailId');
      $('#email-success-block').css('display', 'none');
      $('#email-error-block').css('display', 'block');
      $('#new_profile_email_notify').val('');
      errori18();
    }
  }
});
// File Upload 
$("#Add_new_email_upload").click(function() {
  $('#email-success-block-upload').css('display', 'none');
  $('#email-error-block-upload').css('display', 'none');
  var fetchedVAlue = document.getElementById("email_upload_notify").value;
  $('#alertErrorInstant-upload').empty();
  var regexPattern = /^([A-Za-z0-9_\-\.])+\@(vodafone.com)$/;
  if (fetchedVAlue.search(',') > 0) {
    var temp = fetchedVAlue.split(',');
    var flag = false;
    for (var i = 0; i < temp.length; i++) {
      if (regexPattern.test(temp[i]) == false) {
        flag = true;
        break;
      }
    }
    if (flag) {
      $('#alertErrorInstant-upload').attr('data-i18n', 'errorTranslation.invalidEmailId');
      $('#email-success-block-upload').css('display', 'none');
      $('#email-error-block-upload').css('display', 'block');
      $('#email_upload_notify').val('');
      errori18();
    } else {
      var reportName = sessionStorage.reportFileUpload;
      var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
      $.ajax({
        method: "POST",
        async: false,
        url: ajaxURL,
        data: JSON.stringify({
          "emailAddresses": fetchedVAlue
        }),
        headers: {
          'Authorization': localStorage.jwtToken,
        },
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
      }).success(function(data) {
        if (data.error === sessionStorage.duplicateEmail) {
          $('#alertErrorInstant-upload').attr('data-i18n', 'errorTranslation.alreadyPresent');
          $('#email-error-block-upload').css('display', 'block');
          $('#email_upload_notify').val('');
          errori18();
        } else if (data.error === sessionStorage.duplicateMultipleEmail) {
          $('#alertErrorInstant-upload').attr('data-i18n', 'errorTranslation.mutipleDuplicate');
          $('#email-error-block-upload').css('display', 'block');
          $('#email_upload_notify').val('');
          errori18();
        } else {
          $('#alertSuccessInstant-upload').attr('data-i18n', 'translation.updateEmailId');
          $('#email-success-block-upload').css('display', 'block');
          $('#email-error-block-upload').css('display', 'none');
          $('#email_upload_notify').val('');
          translationi18();
        }
      }).error(function(data) {
		if(data.status === 0 && !localStorage.jwtToken) {
		  logoutClient();
		} else {
          var error = JSON.parse(data.responseText).error;
          if (error === sessionStorage.duplicateEmail) {
            $('#alertErrorInstant-upload').attr('data-i18n', 'errorTranslation.alreadyPresent');
            $('#email-error-block-upload').css('display', 'block');
            $('#email_upload_notify').val('');
            errori18();
          } else if (error === sessionStorage.duplicateMultipleEmail) {
            $('#alertErrorInstant-upload').attr('data-i18n', 'errorTranslation.mutipleDuplicate');
            $('#email-error-block-upload').css('display', 'block');
            $('#email_upload_notify').val('');
            errori18();
          }
	    }
      });
    }
  } else {
    if (regexPattern.test(fetchedVAlue) == true) {
      var reportName = sessionStorage.reportFileUpload;
      var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
      $.ajax({
        method: "POST",
        async: false,
        url: ajaxURL,
        data: JSON.stringify({
          "emailAddresses": fetchedVAlue
        }),
        headers: {
          'Authorization': localStorage.jwtToken,
        },
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
      }).success(function(data) {
        if (data.error === sessionStorage.duplicateEmail) {
          $('#alertErrorInstant-upload').attr('data-i18n', 'errorTranslation.alreadyPresent');
          $('#email-error-block-upload').css('display', 'block');
          $('#email_upload_notify').val('');
          errori18();
        } else if (data.error === sessionStorage.duplicateMultipleEmail) {
          $('#alertErrorInstant-upload').attr('data-i18n', 'errorTranslation.mutipleDuplicate');
          $('#email-error-block-upload').css('display', 'block');
          $('#email_upload_notify').val('');
          errori18();
        } else {
          $('#alertSuccessInstant-upload').attr('data-i18n', 'translation.updateEmailId');
          $('#email-success-block-upload').css('display', 'block');
          $('#email-error-block-upload').css('display', 'none');
          $('#email_upload_notify').val('');
          translationi18();
        }
      }).error(function(data) {
		if(data.status === 0 && !localStorage.jwtToken) {
		  logoutClient();
		} else {
          var error = JSON.parse(data.responseText).error;
          if (error === sessionStorage.duplicateEmail) {
            $('#alertErrorInstant-upload').attr('data-i18n', 'errorTranslation.alreadyPresent');
            $('#email-error-block-upload').css('display', 'block');
            $('#email_upload_notify').val('');
            errori18();
          } else if (error === sessionStorage.duplicateMultipleEmail) {
            $('#alertErrorInstant-upload').attr('data-i18n', 'errorTranslation.mutipleDuplicate');
            $('#email-error-block-upload').css('display', 'block');
            $('#email_upload_notify').val('');
            errori18();
          }
	    }
      });
    } else {
      $('#alertErrorInstant-upload').attr('data-i18n', 'errorTranslation.invalidEmailId');
      $('#email-success-block-upload').css('display', 'none');
      $('#email-error-block-upload').css('display', 'block');
      $('#email_upload_notify').val('');
      errori18();
    }
  }
});
/* File Upload */
/* For view Instant emailIDlists */
$("#email-accordion3").click(function() {
    var timezone = getTimezone();
    $('#email-error-block').css('display', 'none');
    $('#email-success-block').css('display', 'none');
    $('#alertErrorInstant').empty();
    var reportName = sessionStorage.reportInstantMail;
    var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
    $.ajax({
        method: "GET",
        async: false,
        url: ajaxURL,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        $('#emailList').html("");
        if (data.length !== 0) {
            var emailAddress = data[0].EMAIL_IDS;
            var parseData = JSON.parse(emailAddress);
            if (parseData === null || parseData === undefined || parseData === '[]') {
                $('#email-error-block').css('display', 'block');
                $('#email-success-block').css('display', 'none');
                $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.noMailIdAdded');
                $('#popup2').css('display', 'none');
                errori18();
            } else {
                var htmlContent = "";
                for (var i = 0; i < parseData.length; i++) {
                    htmlContent = htmlContent + '<tr id="columnVal' + i +
                        '"><td id="emailvalue' + i + '">' + parseData[i].emailId +
                        '</td><td>' + new Date(parseData[i].modifiedDate).format(
                            "dd/mm/yyyy, HH:MM:ss") + ' ' + timezone +
                        '</td><td>' +
                        '<img class="bin-icon" id="email' + i +
                        '"  src="/img/bin.png" onClick="deleteInstantReportId(this.id)"></td></tr>';
                }
                $('#emailList').html(htmlContent);
            }
        }
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
});
/* File Upload */
$("#email-accordion6").click(function() {
  var timezone = getTimezone();
  $('#email-error-block-upload').css('display', 'none');
  $('#email-success-block-upload').css('display', 'none');
  $('#alertErrorInstant').empty();
  var reportName = sessionStorage.reportFileUpload;
  var ajaxURL = sessionStorage.gatewayurl+sessionStorage.viewconfigReport.replace('{reportName}', reportName);
  $.ajax({
    method: "GET",
    async: false,
    url: ajaxURL,
    headers: {
      'Authorization': localStorage.jwtToken,
    },
    crossDomain: true,
  }).success(function(data) {
    $('#emailList').html("");
    if (data.length !== 0) {
      var emailAddress = data[0].EMAIL_IDS;
      var parseData = JSON.parse(emailAddress);
      if (parseData === null || parseData === undefined || parseData === '[]') {
        $('#email-error-block-upload').css('display', 'block');
        $('#email-success-block-upload').css('display', 'none');
        $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.noMailIdAdded');
        $('#popup2').css('display', 'none');
        errori18();
      } else {
        var htmlContent = "";
        for (var i = 0; i < parseData.length; i++) {
          htmlContent = htmlContent + '<tr id="columnVal' + i +
            '"><td id="emailvalue' + i + '">' + parseData[i].emailId +
            '</td><td>' + new Date(parseData[i].modifiedDate).format(
              "dd/mm/yyyy, HH:MM:ss") + ' ' + timezone +
            '</td><td>' +
            '<img class="bin-icon" id="email' + i +
            '" src="/img/bin.png" onClick="fileUploademail(this.id)"></td></tr>';
        }
        $('#emailList').html(htmlContent);
      }
    }
  }).error(function(error) {
    if(error.status === 0 && !localStorage.jwtToken) {
      logoutClient();
	}
  });
});

/* File Upload */
/*For Deleting mail id's for instant mail sending */
function deleteInstantReportId(ele) {
    var timezone = getTimezone();
    var lastvalue = ele.charAt(ele.length - 1);
    var emailvalue = $('#emailvalue' + lastvalue).text();
    $('#alertErrorInstant').empty();
    var reportName = sessionStorage.reportInstantMail;
    var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
    $.ajax({
        method: "DELETE",
        async: false,
        url: ajaxUrl,
        data: {
            "emailAddress": emailvalue
        },
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        var reportName = sessionStorage.reportInstantMail;
        var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
        $.ajax({
            method: "GET",
            async: false,
            url: ajaxUrl,
            headers: {
                'Authorization': localStorage.jwtToken,
            },
            crossDomain: true,
        }).success(function(data) {
            var emailAddress = data[0].EMAIL_IDS;
            var parseData = JSON.parse(emailAddress);
            if (parseData === null || parseData === undefined || parseData === '[]') {
                $('#email-error-block').css('display', 'block');
                $('#email-success-block').css('display', 'none');
                $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.noMailIdAdded');
                $('#popup2').css('display', 'none');
                errori18();
            } else {
                var htmlContent = "";
                $('#emailList').html = "";
                for (var i = 0; i < parseData.length; i++) {
                    htmlContent = htmlContent + '<tr><td id="emailvalue' + i + '">' +
                        parseData[i].emailId + '</td><td>' + new Date(parseData[i].modifiedDate).format(
                            "dd/mm/yyyy, HH:MM:ss") +
                        ' ' + timezone +
                        '</td><td>' +
                        '<img class="bin-icon" id="email' + i +
                        '" src="/img/bin.png" onClick="deleteInstantReportId(this.id)"></td></tr>';
                }
                $('#emailList').html(htmlContent);
            }
        }).error(function(error) {
		  if(error.status === 0 && !localStorage.jwtToken) {
		    logoutClient();
		  }
		});
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
    errori18();
}
/* Deleting email for file upload */
function fileUploademail(ele) {
    var timezone = getTimezone();
    var lastvalue = ele.charAt(ele.length - 1);
    var emailvalue = $('#emailvalue' + lastvalue).text();
    $('#alertErrorInstant').empty();
    var reportName = sessionStorage.reportFileUpload;
    var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
    $.ajax({
        method: "DELETE",
        async: false,
        url: ajaxUrl,
        data: {
            "emailAddress": emailvalue
        },
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        var reportName = sessionStorage.reportFileUpload;
        var ajaxURL = sessionStorage.gatewayurl + sessionStorage.viewconfigReport.replace('{reportName}', reportName);
        $.ajax({
            method: "GET",
            async: false,
            url: ajaxUrl,
            headers: {
                'Authorization': localStorage.jwtToken,
            },
            crossDomain: true,
        }).success(function(data) {
            var emailAddress = data[0].EMAIL_IDS;
            var parseData = JSON.parse(emailAddress);
            if (parseData === null || parseData === undefined || parseData === '[]') {
                $('#email-error-block').css('display', 'block');
                $('#email-success-block').css('display', 'none');
                $('#alertErrorInstant').attr('data-i18n', 'errorTranslation.noMailIdAdded');
                $('#popup2').css('display', 'none');
                errori18();
            } else {
                var htmlContent = "";
                $('#emailList').html("");
                for (var i = 0; i < parseData.length; i++) {
                    htmlContent = htmlContent + '<tr><td id="emailvalue' + i + '">' +
                        parseData[i].emailId + '</td><td>' + new Date(parseData[i].modifiedDate).format(
                            "dd/mm/yyyy, HH:MM:ss") +
                        ' ' + timezone +
                        '</td><td>' +
                        '<img class="bin-icon" src="/img/bin.png" id="email' + i +
                        '" onClick="fileUploademail(this.id)"></td></tr>';
                }
                $('#emailList').html(htmlContent);
            }
        }).error(function(error) {
	      if(error.status === 0 && !localStorage.jwtToken) {
			logoutClient();
		  }
		});
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
    errori18();
}
/* Deleting email for file upload */
$("#new_profile_email_notify").keyup(function() {
    $('#Add_new_email').removeAttr("disabled");
    $("#Add_new_email").removeClass("btn_disabled");

});
$("#email_upload_notify").keyup(function() {
	$('#Add_new_email_upload').removeAttr("disabled");
	$("#Add_new_email_upload").removeClass("btn_disabled");

});

$("#Add_subscription").click(function() {
    $('#new_subSuccess_block').css('display', 'none');
    $('#new_subError_block').css('display', 'none');
    $('#successSub').empty();
    $('#errorSub').empty();
    var timezone = getTimezone();
    var fetchedVAlue = document.getElementById("enter_sub_type").value;
	var trimmedValue = fetchedVAlue.trim();
    var regexpSpecialChar = new RegExp(sessionStorage.regexSubscriptionType); 
    if (regexpSpecialChar.test(trimmedValue) === true) {
        var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.managedSubscriptionsAjax;
        $.ajax({
            method: "POST",
            async: true,
            url: ajaxUrl,
            data: JSON.stringify({
                "subscriptionType": trimmedValue
            }),
            headers: {
                'Authorization': localStorage.jwtToken,
            },
            contentType: "application/json; charset=utf-8",
            crossDomain: true
        }).success(function(data) {
            if (data == 0) {
                $('#successSub').attr('data-i18n', 'errorTranslation.success_addition-sub');
                $('#new_subSuccess_block').css('display', 'block');
                $('#new_subError_block').css('display', 'none');
                $('#enter_sub_type').val('');
                $('#showSubscriptionlist').show();
                getSubscription('false');
            } else {
                $('#errorSub').attr('data-i18n', 'errorTranslation.duplicate_addition_sub');
                $('#new_subSuccess_block').css('display', 'none');
                $('#new_subError_block').css('display', 'block');
                errori18();
                $('#enter_sub_type').val('');
            }
            errori18();
        }).error(function(error) {
		  if(error.status === 0 && !localStorage.jwtToken) {
		    logoutClient();
		  }
		}).done(function() {
            modalDialogFunction();
        });
    } else {
		$('#enter_sub_type').val('');
		$('#showSubscriptionlist').show();
        getSubscription('invalidSubscription');
    }
	errori18();
});

function getSubscription(isProfileAdded) {
    var timezone = getTimezone();
    var ajaxURL = sessionStorage.gatewayurl + sessionStorage.managedSubscriptionsAjax;
    $('#successSub').empty();
    $.ajax({
        method: "GET",
        async: true,
        url: ajaxURL,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true
    }).success(function(data) {
        if (data.length === 0) {
            $('#new_subError_block').css('display', 'block');
            $('#new_subSuccess_block').css('display', 'none');
            $('#errorSub').attr('data-i18n', 'errorTranslation.invalidSubscription');
            $('#popup2').css('display', 'none');
			errori18();
        } else {
            htmlContent = '';
            for (var i = 0; i < data.length; i++) {
                htmlContent += '<tr class="sub-option" id="tr' + i + '"><td class="plus_minus_pos" id="plusclick' + i + '" onClick="openPlus(this.id)">' +
                    '<img class="sub-plus-icon1 sub" id="plus" src="img/plus-icon.png"></td><td class="subWidth"></td><td id="subscriptionvalue' + i +
                    '">' + data[i].SUBSCRIPTION_TYPE + '</td><td>' + new Date(data[i].ADDED_ON).format(
                        "dd/mm/yyyy, HH:MM:ss") + ' ' + timezone + '</td>' +
                    '<td id="subdelete' + i + '">' +
                    '<img class="bin-icon" src="/img/bin.png" data-modal-id="popupSub" id="subdelete' + i + '"></td></tr>';
            }

            $('#showSubscriptionlist').html(htmlContent);
            if (isProfileAdded === 'true') {
                $('#successSub').attr('data-i18n', 'errorTranslation.success_addition_prof');
                $('#new_subSuccess_block').css('display', 'block');
                $('#new_subError_block').css('display', 'none');
                errori18();
            } else if (isProfileAdded === 'deleted') {
                $('#successSub').attr('data-i18n', 'errorTranslation.success_deletion_prof');
                $('#new_subSuccess_block').css('display', 'block');
                $('#new_subError_block').css('display', 'none');
                errori18();
            } else if (isProfileAdded === 'rename') {
                $('#successSub').attr('data-i18n', 'errorTranslation.success_rename_prof');
                $('#new_subSuccess_block').css('display', 'block');
                $('#new_subError_block').css('display', 'none');
                errori18();
            } else if (isProfileAdded === 'sub_deleted') {
                $('#successSub').attr('data-i18n', 'errorTranslation.success_deletion_sub');
                $('#new_subSuccess_block').css('display', 'block');
                $('#new_subError_block').css('display', 'none');
                errori18();
            } else if (isProfileAdded === 'blankSubscription') {
                $('#errorSub').attr('data-i18n', 'errorTranslation.blank_subscription');
                $('#new_subError_block').css('display', 'block');
                $('#new_subSuccess_block').css('display', 'none');
                errori18();
            } 
			else if (isProfileAdded === 'noProfileSelected') {
                $('#errorSub').attr('data-i18n', 'errorTranslation.no_profile_selected');
                $('#new_subError_block').css('display', 'block');
                $('#new_subSuccess_block').css('display', 'none');
                errori18();
            }
			else if (isProfileAdded === 'invalidSubscription') {
                $('#errorSub').attr('data-i18n', 'errorTranslation.invalidSubscription');
                $('#new_subError_block').css('display', 'block');
                $('#new_subSuccess_block').css('display', 'none');
                errori18();
            }
			else if (isProfileAdded === 'subscriptionAlreadyExist') {
                $('#errorSub').attr('data-i18n', 'errorTranslation.subscriptionAlreadyExist');
                $('#new_subError_block').css('display', 'block');
                $('#new_subSuccess_block').css('display', 'none');
                errori18();
            }
			else {
                $('#successSub').attr('data-i18n', 'errorTranslation.success_addition-sub');
                $('#new_subSuccess_block').css('display', 'block');
                $('#new_subError_block').css('display', 'none');
                errori18();
            }
        }
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	}).done(function() {
        modalDialogFunction();
    });
}

$("#email-accordion4").click(function() {
    var htmlContent='';
    var timezone = getTimezone();
    $('#errorSub').empty();
    $('#new_subSuccess_block').css('display', 'none');
    $('#new_subError_block').css('display', 'none');
    $('.plus_minus_pos').closest('tr').removeClass("option_active");
    $('.plus_minus_pos').closest('tr').next().removeClass("next_sub_option_active");
    var ajaxURL = sessionStorage.gatewayurl + sessionStorage.managedSubProfileAjax;
    $.ajax({
        method: "GET",
        async: false,
        url: ajaxURL,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        if (data.length == 0) {
            $('#new_subError_block').css('display', 'block');
            $('#new_subSuccess_block').css('display', 'none');
			$('#errorSub').attr('data-i18n', 'errorTranslation.no_profile_available');
            $('#popup2').css('display', 'none');
			document.getElementById('profilelist').innerHTML = '';
			errori18();
        } else {
			for (var i = 0; i < data.length; i++) {
                htmlContent = htmlContent + '<tr><td id="profilevalue' + i +
                    '">' + data[i].PROFILE_TYPE + '</td><td>' + new Date(data[i].ADDED_ON).format(
                        "dd/mm/yyyy, HH:MM:ss") + ' ' + timezone + '</td></tr>';
            }
            document.getElementById('profilelist').innerHTML = htmlContent;
        }
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
	  }
	});
});


$("#acc-5").click(function() {
    var htmlContent;
    var timezone = getTimezone();
    $('#errorSub').empty();
    $('#new_subSuccess_block').css('display', 'none');
    $('#new_subError_block').css('display', 'none');
    if (!$('#showSubscriptionlist').html().trim()) {
        var ajaxURL = sessionStorage.gatewayurl + sessionStorage.managedSubscriptionsAjax;
        $.ajax({
            method: "GET",
            async: false,
            url: ajaxURL,
            headers: {
                'Authorization': localStorage.jwtToken,
            },
            crossDomain: true,
        }).success(function(data) {
            if (data.length === 0) {
                $('#new_subError_block').css('display', 'block');
                $('#new_subSuccess_block').css('display', 'none');
				$('#errorSub').attr('data-i18n', 'errorTranslation.no_subscription_available');
                $('#popup2').css('display', 'none');
				errori18();
            } else {
                htmlContent = '';
                for (var i = 0; i < data.length; i++) {
                    htmlContent += '<tr class="sub-option" id="tr' + i + '"><td class="plus_minus_pos" id="plusclick' + i + '" onClick="openPlus(this.id)">' +
                        '<img class="sub-plus-icon1 sub" id="plus" src="img/plus-icon.png"></td><td class="subWidth"></td><td id="subscriptionvalue' + i +
                        '">' + data[i].SUBSCRIPTION_TYPE + '</td><td>' + new Date(data[i].ADDED_ON).format(
                            "dd/mm/yyyy, HH:MM:ss") + ' ' + timezone + '</td>' +
                        '<td id="subdelete' + i + '">' +
                        '<img class="bin-icon" src="/img/bin.png" data-modal-id="popupSub" id="subdelete' + i + '"></td></tr>';
                }
                $('#showSubscriptionlist').html(htmlContent);
            }
        }).error(function(error) {
		  if(error.status === 0 && !localStorage.jwtToken) {
		    logoutClient();
		  }
		}).done(function() {
            modalDialogFunction();
        });
    }
});

function calculateIccid(getProfile) {
    var iccidCount;
    $.ajax({
        method: "GET",
        async: false,
        url: sessionStorage.gatewayurl + sessionStorage.simGraph,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        jsonpCallback: 'jsonCallback',
        crossDomain: true,
        dataType: "json"
    }).success(function(datagraph) {
        for (i = 0; i < datagraph.length; i++) {
            if (getProfile === datagraph[i].PROFILE_TYPE) {
                iccidCount = datagraph[i].SIM_COUNT;
            }
        }
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
    return iccidCount;
}

function openPlus(ele) {
    var timezone = getTimezone();
	var numberPattern = /\d+/g;
	var lastvalue = ele.match(numberPattern);
    $('#' + ele).closest('tr').addClass("option_active");
    if (!$("#newrow" + lastvalue).html()) {
        var 	sub_plus_icon = '.sub-plus-icon' + lastvalue;
        var subscription_value = $('#subscriptionvalue' + lastvalue).text();
		var trimmedSubscriptionValue = subscription_value.trim();
		var subscription_val = "'" + trimmedSubscriptionValue + "'";
        var ajaxURL = sessionStorage.gatewayurl + sessionStorage.managedSubProfileValAjax + trimmedSubscriptionValue;
        $.ajax({
            method: "GET",
            async: false,
            url: ajaxURL,
            headers: {
                'Authorization': localStorage.jwtToken,
            },
            crossDomain: true,
        }).success(function(data) {
            var htmlContent = '';
            var htmlTableContent = '';
            htmlContent += '<tr id="newrow' + lastvalue + '" style="display: none;"class="subBackColor next_sub_option">' +
                '<td class="plus_minus_pos">' +
                '<img class="sub-minus-icon' + lastvalue + '" src="/img/minus-icon.png"></td><td class="subWidth"><button class="custombutton setting_addButton" id="addButton' + lastvalue + '" onClick="addProfile(this.id,' + lastvalue + ',' + subscription_val + ')" data-i18n="translation.Add_subscription1" data-modal-id="popup15"></button></td>' +
                '<td colspan="3"> <div class="type setting_subType" id="subType" data-i18n="translation.add_subscription_type"></div>' +
                '<input type="text" class="setting_text" id="sub_text' + lastvalue + '" value="' + trimmedSubscriptionValue + '" readonly="readonly">' +
                '<img class="edit-icon_sub" style="margin-left: -40px;vertical-align: middle;" src="/img/edit-icon.png">' +
                '<img class="tick-icon_sub" src="/img/tick1.png" style="display: none;margin-left: -58px;vertical-align: middle;">' +
                '<img class="cross-icon_sub" id="' + trimmedSubscriptionValue + '" src="/img/cross.png" style="display: none; padding-left: 5px;vertical-align: middle;">' +
                '<table class="dashboard"> <thead> <tr id="bg">' +
                '<th data-i18n="translation.Profile Type2"></th>' +
                '<th data-i18n="translation.Added_profile_type"></th>' +
                '<th data-i18n="translation.action"></th>' +
                '</tr> </thead> <tbody>';
            for (var i = 0; i < data.length; i++) {
                var returnCount = calculateIccid(data[i].PROFILE_TYPE);
				if(returnCount === undefined){
					returnCount = 0;
				}
                htmlContent += '<tr class="sub_table">' +
                    '<td id="profvalue' + lastvalue + '' + i + '">' + data[i].PROFILE_TYPE + '</td>' +
                    '<td>' + returnCount + '</td>' +
                    '<td id="removeprofile' + lastvalue + '' + i + '"><img class="bin-icon" src="/img/bin.png"' +
                    'data-modal-id="popup14" id="openDialogue' + lastvalue + '' + i + '" ></td>' +
                    '</tr>';
            }
            htmlContent += '</tbody></table></td></tr>';
            translationi18();

            $(htmlContent).insertAfter($('#' + ele).closest('tr'));

            $(".sub-minus-icon" + lastvalue).click(function() {
                $('#' + ele).closest('tr').removeClass("option_active");
                $('#' + ele).closest('tr').next().removeClass("next_sub_option_active");
            });
            $(".edit-icon_sub").click(function() {
                $(this).prev().attr('readonly', false);
                $(this).next().show();
                $(this).next().next().show();
                $(this).hide();
				$('.setting_addButton').addClass('btn_disabled');
                $('.setting_addButton').attr("disabled", "disabled");
            });
            $(".tick-icon_sub").click(function() {
				var editValue = $(this).prev().prev().val();
				var oldValue = $(this).next().attr('id');
				if(!(editValue === null || editValue === "")){
					if(editValue === oldValue){
						getSubscription('subscriptionAlreadyExist');
					}
					else{
						saveEditedValue($(this), $(this).prev().prev().val(), $(this).next().attr('id'));
					}
				}
				else{
					getSubscription('blankSubscription');
				}
            });
            $(".cross-icon_sub").click(function() {
                $(this).prev().prev().prev().attr('readonly', true)
                    .val($(this).attr('id'));
                $(this).prev().hide();
                $(this).prev().prev().show();
                $(this).hide();
				$('.setting_addButton').removeClass('btn_disabled');
                $('.setting_addButton').removeAttr("disabled", "disabled");
            });
            translationi18();
        }).error(function(error) {
		  if(error.status === 0 && !localStorage.jwtToken) {
		    logoutClient();
		  }
		}).done(function() {
            modalDialogFunction();

        });
    }
    $('#' + ele).closest('tr').next().addClass("next_sub_option_active");
    $('#' + ele).closest('tr').next().siblings().removeClass("next_sub_option_active option_active");
    $('#' + ele).closest('tr').next().prev().addClass("option_active");

    translationi18();
}

$("#sub_delete_yes").click(function() {
    var deleteProfileTypes = sessionStorage.getItem('deleteId');
    var idLength = deleteProfileTypes.length;
    var value = deleteProfileTypes.charAt(idLength - 1);
    var lastvalue = deleteProfileTypes.charAt(idLength - 2);
    sessionStorage.removeItem('deleteId');
    deleteProfile(deleteProfileTypes, lastvalue, value);
});

$("#subscription_delete_yes").click(function() {
    var deleteSubTypes = sessionStorage.getItem('deleteId');
    sessionStorage.removeItem('deleteId');
    deleteSubscription(deleteSubTypes);
});

function saveEditedValue(ele, editedValue, oldValue) {
    var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.managedSubscriptionsAjax + "/" + oldValue;
    $.ajax({
        method: "PUT",
        async: false,
        url: ajaxUrl,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        data: JSON.stringify({
            "editedSubscriptionValue": editedValue
        }),
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
    }).success(function(data) {
        ele.prev().prev().attr('readonly', true);
        ele.next().hide().attr('id', editedValue);
        ele.prev().show();
        ele.hide();
        getSubscription('rename');
    }).error(function(data) {
		if(data.status === 0 && !localStorage.jwtToken) {
		  logoutClient();
		}
		if(data.status === 404){
		  getSubscription('subscriptionAlreadyExist');
		}
	});
}

function openPopup() {
    $("#newrow0").addClass("next_sub_option_active");
    $("#newrow0").siblings().removeClass("next_sub_option_active option_active");
    $("#newrow0").prev().addClass("option_active");
};

function deleteSubscription(ele) {
    var timezone = getTimezone();
    var lastvalue = ele.charAt(ele.length - 1);
    var listId = '#'.concat(ele);
    var subdelete = $('#subdelete' + lastvalue).text();
    var subscriptionvalue = $('#subscriptionvalue' + lastvalue).text();
    var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.managedSubscriptionsAjax + "/" + encodeURIComponent(subscriptionvalue);
    $.ajax({
            method: "DELETE",
            async: false,
            headers: {
                'Authorization': localStorage.jwtToken,
            },
            url: ajaxUrl,
            crossDomain: true,
        }).success(function(data) {
            var ajaxURL = sessionStorage.gatewayurl + sessionStorage.managedSubscriptionsAjax;
            $.ajax({
                method: "GET",
                async: false,
                url: ajaxURL,
                headers: {
                    'Authorization': localStorage.jwtToken,
                },
                crossDomain: true,
            }).success(function(data) {
                if (data.length === 0) {
                    $('#new_subError_block').css('display', 'block');
                    $('#new_subSuccess_block').css('display', 'none');
                    $('#errorSub').attr('data-i18n', 'translation.subscriptionUnavailable');
                    $('#popup2').css('display', 'none');
                    document.getElementById('showSubscriptionlist').deleteRow(0);
                    translationi18();
                } else {
                    getSubscription('sub_deleted');
                }
            }).error(function(error) {
			  if(error.status === 0 && !localStorage.jwtToken) {
			    logoutClient();
		      }
			});
        }).error(function(error) {
		  if(error.status === 0 && !localStorage.jwtToken) {
		    logoutClient();
		  }
		})
        .done(function() {
            modalDialogFunction();
        });
    errori18();
}

function deleteProfile(ele, lastvalues, i) {
    var timezone = getTimezone();
    var lastvalue = ele.charAt(ele.length - 1);
    var listId = ele;
    var profid = $('#profvalue' + lastvalues + i);
    var profileValue = $('#profvalue' + lastvalues + i).text();
    var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.managedSubProfileAjax + "/" + profileValue;
    $.ajax({
        method: "DELETE",
        async: false,
        url: ajaxUrl,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        getSubscription('deleted');
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
    errori18();
}


$('#Cancel_subscription').click(function() {
	$('#enter_sub_type').val('');
})

function addProfile(ele, lastvalues, subscription_value) {
    var timezone = getTimezone();
    var listId = ele;
    var textvalue = $("#sub_text" + lastvalues).val();
    var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.managedSubProfileAjax;
    $.ajax({
        method: "GET",
        async: false,
        url: ajaxUrl,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
        var htmlContent = '<div class="modal-body">' +
            '<div class="type ovl-header">' +
            '<a href="#" class="js-modal-close close" id="close-popup15">x</a> <span' +
            'id="associate_profile" data-i18n="translation.associate_profile"></span>' +
            '</div>' +
            '<div class="notifications-sim">' +
            '<div class="associate_sub_type">' +
            '<span id="associate_type" data-i18n="translation.associate_type"></span>' +
            '<span id="selected-prof-type">' + textvalue + '</span>' +
            '</div>' +
            '<span id="pro-type-header" class="type"' +
            'data-i18n="translation.pro-type-header"></span>' +
            '<div class="profile_type_content">';
        for (i = 0; i < data.length; i++) {
            htmlContent += '<div class="associate_prof_type">' +
                '<input type="checkbox" onclick = "enableSaveButton(this)" class = "checkprofile" name="associate_profile_type" value="' + data[i].PROFILE_TYPE + '"' +
                'id="associate_profile_type' + i + '" /> <label' +
                'for="associate_profile_type' + i + '" id="">' + data[i].PROFILE_TYPE + '</label><br>' +
                '</div>';
        }
			htmlContent += '</div><div class="content-text" id="select_profile_type">' +
            '<span id="select_associaed_profile"' +
            'data-i18n="translation.select_associaed_profile"></span>' +
            '</div>' +
            '<div class="stopbutton button_popup13">' +
            '<button class="custombutton js-modal-close btn_disabled" name="Apply"' +
            'id="assco_apply" disabled="true" onClick="mapProfile(this.id,' + lastvalues + ')" data-i18n="translation.assco_apply"></button>' +
            '<button class="custombutton negbutton js-modal-close" name="Cancel"' +
            'id="Cancel_subscription" data-i18n="translation.Cancel_subscription"></button>' +
            '</div>';

        $('#popup15').html(htmlContent);

    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	}).done(function() {
        modalDialogFunction();
    });
    translationi18();
}

function enableSaveButton(val) {
	if(val.checked === true) {
		document.getElementById('assco_apply').disabled = false;
		$('#assco_apply').removeClass('btn_disabled');
	} else {
		if($('.checkprofile').filter(':checked').length < 1){
      document.getElementById('assco_apply').disabled = true;
      $('#assco_apply').addClass("btn_disabled");
    }
	}
}

function mapProfile(ele, lastvalues) {
    var timezone = getTimezone();
    var lastvalue = ele.charAt(ele.length - 1);
    var subscriptionType = $("#sub_text" + lastvalues).val();
    var checkedValue = $('.messageCheckbox:checked').val();
    var checkedProfile = [];
    $('.checkprofile:checked').each(function() {
        checkedProfile.push($(this).val());
    });
    var profileTypes = [];
    profileTypes = checkedProfile;
		if(subscriptionType) {
    var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.managedSubscriptionsAjax + '/' + subscriptionType + '/' + profileTypes;
    $.ajax({
        method: "PUT",
        async: false,
        url: ajaxUrl,
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        crossDomain: true,
    }).success(function(data) {
		  if(data == 1){
			  getSubscription('true');
		  }
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
    errori18();
	}
}


var selectedContentText;

$('.cs-placeholder').click(function () {
  $('#cs-option-ul_tempType').css('position', 'relative');
});

$("#cs-option-ul_tempType").click(function() {
    selectedContentText = $("#tempTypeSelect").attr('data-value').trim();

    if (selectedContentText == 'Activation Code') {
        selectedContentText = 'Activation';
    }

    if (selectedContentText == 'Confirmation Code') {
        selectedContentText = 'Confirmation';
    }

    if (selectedContentText == 'SIM Parameters') {
        selectedContentText = 'SimParameter';
    }

    $("#contentError").css('display', 'none');
    $("#contentSuccess").css('display', 'none');
    $("#select_temp").css('display', 'block');
    $(".download_left").css('display', 'block');
    $("#contentManager").css('display', 'block');
    $("#note_2").css('display', 'block');
    $("#select_btns").css('display', 'block');
    $(".acc-noshow-acc3").css('display', 'block');
    $("#instruct_1").css('visibility', 'visible');
    $("#selectedFile-txt_1").val("");
    $("#uploadFile").val("");
    $('#previewbtn_1,#submitbtn_1').addClass("btn_disabled");
    $('#previewbtn_1,#submitbtn_1').attr('disabled', true);
});


$('#manageContentAccordion').click(function() {
    $("#contentError").css('display', 'none');
    $("#contentSuccess").css('display', 'none');
});


$('#manageDown').click(function() {
    $("#contentError").css('display', 'none');
    $("#contentSuccess").css('display', 'none');
});

$('#manageUp').click(function() {
    $("#contentError").css('display', 'none');
    $("#contentSuccess").css('display', 'none');
});

$("#toggleLabel1").click(function() {
    var flag;
    if ($('#toggleLabel1:checkbox:checked').length > 0) {
        flag = true;
    } else {
        flag = false;
    }
    var reportType = $('#repTypeSelect').attr("data-value");
    var reportName = reportType.trim();
    $.ajax({
        method: "PUT",
        async: false,
        data:JSON.stringify({
            "flag": flag,
        }),
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        url: sessionStorage.gatewayurl + sessionStorage.updateFlagAjax.replace('{reportName}', reportName),
		contentType: "application/json; charset=utf-8",
        crossDomain: true
    }).done(function(data) {

	}).fail(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
});

$("#toggleLabel2").click(function() {
    var flag;
    var profileType = $("#profTypeSelect").attr("data-value");
    if ($('#toggleLabel2:checkbox:checked').length > 0) {
        flag = true;
    } else {
        flag = false;
    }
    var reportName = sessionStorage.reportNameLowSIM;
    $.ajax({
        method: "PUT",
        async: false,
        data: JSON.stringify({
            "profileType": profileType,
            "flag": flag
        }),
        headers: {
            'Authorization': localStorage.jwtToken,
        },
        url: sessionStorage.gatewayurl + sessionStorage.updateFlagAjax.replace('{reportName}', reportName),
		contentType: "application/json; charset=utf-8",
        crossDomain: true

    }).done(function(data) {

	}).fail(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
});

$("#toggleLabel3").click(function() {
    var flag;
    if ($('#toggleLabel3:checkbox:checked').length > 0) {
        flag = true;
    } else {
        flag = false;
    }
    $.ajax({
        method: "PUT",
        async: true,
        data:JSON.stringify({
            "flag": flag,
        }),
        headers: {
		  'Authorization': localStorage.jwtToken,
		},
        url: sessionStorage.gatewayurl + sessionStorage.updateFlagAjax.replace('{reportName}', sessionStorage.reportFileUpload),
		contentType: "application/json; charset=utf-8",
        crossDomain: true
    }).done(function(data) {

	}).fail(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }
	});
});


$('#fileUploadConfig').click(function() {
  $(".css-switch").css("cursor","pointer");
  var ajaxURL = sessionStorage.gatewayurl + sessionStorage.lowSimViewAjax.replace('{reportName}', sessionStorage.reportFileUpload);
    $.ajax({
        method: "GET",
        async: true,
        url: ajaxURL,
        headers: {
		  'Authorization': localStorage.jwtToken,
		},
        crossDomain: true,
    }).success(function(data) {
        if (data[0].FLAG.toLowerCase() == sessionStorage.flagTrue) {
            $('#toggleLabel3').prop('checked', true);
        } else {
            $('#toggleLabel3').prop('checked', false);
        }
    }).error(function(error) {
	  if(error.status === 0 && !localStorage.jwtToken) {
	    logoutClient();
	  }else {
      // Setting Notification slider on client side to OFF state
        $('#toggleLabel3').prop('checked', false);
	  }
    });
});

$('#downloadtemplate').click(function () {
  $('#contentError').css('display', 'none');
  $('#contentSuccess').css('display', 'none');
  $.ajax({
    method: 'GET',
    async: false,
    url: sessionStorage.gatewayurl + sessionStorage.downloadfileAjax + selectedContentText,
    headers: {
      Authorization: localStorage.jwtToken,
    },
    crossDomain: true,
    dataType: 'json',
  }).success(function (data) {
    $('#contentError').css('display', 'none');
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if (base64regex.test(data)) {
      var byteString = atob(data);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], {
        type: 'zip'
      });
    } else {
      $('#contentError').css('display', 'block');
      $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.zipDownloadError');
      errori18();
    }
    saveAs(blob, selectedContentText+".zip");
  }).error(function (error) {
    if (error.status === 0 && !localStorage.jwtToken) {
      logoutClient();
    } else {
      $('#contentError').css('display', 'block');
      $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.zipDownloadError');
      errori18();
    }
  });
});

$('#browsebtn_temp').click(function () {
  $('.errorAlert').css('display', 'none');
  $('.successAlert').css('display', 'none');
  $('#uploadFile').trigger('click');
});

$('#uploadbtn_temp').click(function () {
  $('#alertTitlecontent_success').empty();
  $('#alertTitlecontent_error').empty();
  $('#contentSuccess').css('display', 'none');
  $('#contentError').css('display', 'none');
  var temp = true;
  var fileFieldEmptyChk = $('#uploadFile').val();
  if (fileFieldEmptyChk == '') {
    $('#alertTitlecontent_error').empty();
    $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.no_handout');
    $('#contentError').css('display', 'block');
    errori18();
    temp = false;
  } else {
    var fileElement = document.getElementById('uploadFile');
    var file = fileElement.files[0];
    var fileSize = file.size / 5242880; // 5242880 = 5MB
    var exts = ['zip', 'rar'];
    var get_ext = (file.name).split('.');
    var get_name = (file.name).split('.');
    get_name = get_name[0];
    get_ext = get_ext.reverse()[0].toLowerCase();
    if ($.inArray(get_ext, exts) == -1) {
      $('#alertTitlecontent_error').empty();
      $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.invform');
      $('#contentError').css('display', 'block');
      temp = false;
      errori18();
    } else if (!file.type == 'application/x-rar-compressed, application/octet-stream' || !file.type == 'application/zip, application/octet-stream') {
      $('#alertTitlecontent_error').empty();
      $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.invconttype');
      $('#contentError').css('display', 'block');
      temp = false;
      errori18();
    } else if (!(get_name == selectedContentText)) {
      $('#alertTitlecontent_error').empty();
      $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.invfile');
      $('#contentError').css('display', 'block');
      temp = false;
      errori18();
    } else if (fileSize > 1) {
      $('#alertTitlecontent_error').empty();
      $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.exceededZipSize');
      $('#contentError').css('display', 'block');
      temp = false;
      errori18();
    }
  }
  if (temp) {
    $('.errorAlert').hide();
    var file = document.getElementById('uploadFile');
    var zipFileToLoad = file.files[0];
    var fileReader = new FileReader();
    fileReader.onload = function (evt) {
      if (evt.target.readyState == FileReader.DONE) {
        var b64encoded = btoa(evt.target.result);
        $.ajax({
          method: 'POST',
          processData: false,
          contentType: 'application/json',
          headers: {
            Authorization: localStorage.jwtToken,
          },
          url: sessionStorage.gatewayurl + sessionStorage.zipuploadAjax + selectedContentText,
          data: '{"zipFileBase64":"' + b64encoded + '","fileName":"' + selectedContentText + '"}',
        }).success(function (data) {
          $('#alertTitlecontent_success').empty();
          $('#contentError').css('display', 'none');
          $('#previewbtn_1').removeClass('btn_disabled');
          $('#previewbtn_1').removeAttr('disabled');
          $('#alertTitlecontent_success').attr('data-i18n', 'errorTranslation.file_success');
          $('#contentSuccess').css('display', 'block');
          $('#selectedFile-txt_1').val('');
          $('#uploadFile').val('');
          errori18();
        }).error(function (err) {
          if (err.status === 0 && !localStorage.jwtToken) {
            logoutClient();
          } else {
            $('#alertTitlecontent_error').empty();
            if (err.responseJSON['error-codes'][0].$ === '491') {
              var respText = err.responseJSON.descriptions[0].$;
              if (respText.errorCode === 702) {
                $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.inv_data');
              } else if (respText.errorCode === 701) {
                $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.invform');
              }
            } else {
              $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.file_not');
            }
            $('#contentSuccess').css('display', 'none');
            $('#contentError').css('display', 'block');
            $('#previewbtn_1,#submitbtn_1').addClass('btn_disabled');
            $('#previewbtn_1,#submitbtn_1').attr('disabled', true);
            errori18();
          }
        });
      }
    };
    var buffer = fileReader.readAsBinaryString(zipFileToLoad);
  }
  errori18();
});

$('#previewtemplate').click(function () {
  $('#contentSuccess').css('display', 'none');
  $('#contentError').css('display', 'none');
  var d = new Date();
  Number.prototype.padLeft = function (base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
  };
  var date = d.getDate().padLeft();
  var month = (d.getMonth() + 1).padLeft();
  var year = d.getFullYear();
  var dformat = [d.getHours().padLeft(), d.getMinutes().padLeft()].join(':');
  $('#submitbtn_1').removeClass('btn_disabled');
  $('#submitbtn_1').removeAttr('disabled');
  $.ajax({
    method: 'GET',
    async: false,
    url: sessionStorage.gatewayurl + sessionStorage.templatepreviewAjax + selectedContentText,
    headers: {
      Authorization: localStorage.jwtToken,
    },
    crossDomain: true,
    dataType: 'json',
  }).success(function (data) {
    $('#contentError').css('display', 'none');
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if (base64regex.test(data)) {
      var htmlText = '<embed width=100% height=100%' +
      ' type="application/pdf"' +
      ' src="data:application/pdf;base64,' +
      escape(data) +
      '"></embed>';
      var winlogicalname = 'detailPDF';
      var winparams = 'dependent=yes,locationbar=no,scrollbars=yes,menubar=yes,' + 'resizable,screenX=50,screenY=50,width=850,height=1050';
      var detailWindow = window.open(selectedContentText, winlogicalname, winparams);
      detailWindow.document.write(htmlText);
      detailWindow.document.close();
    } else {
      $('#contentError').css('display', 'block');
      $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.templatePreviewError');
      errori18();
    }
  }).error(function (error) {
    if (error.status === 0 && !localStorage.jwtToken) {
      logoutClient();
    } else {
      $('#contentError').css('display', 'block');
      $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.templatePreviewError');
      errori18();
    }
  });
});

$('#shiftfile').click(function () {
  $('#alertTitlecontent_success').empty();
  $('#alertTitlecontent_error').empty();
  $.ajax({
    method: 'GET',
    contentType: false,
    async: true,
    processData: false,
    headers: {
      Authorization: localStorage.jwtToken,
    },
    url: sessionStorage.gatewayurl + sessionStorage.zipshiftAjax + selectedContentText,
  }).done(function (data) {
    $('#contentError').css('display', 'none');
    $('#contentSuccess').css('display', 'block');
    $('#alertTitlecontent_success').attr('data-i18n', 'errorTranslation.temp_success');
    $('#previewbtn_1,#submitbtn_1').addClass('btn_disabled');
    $('#previewbtn_1,#submitbtn_1').attr('disabled', true);
    $('#previewtemplate').removeAttr('href');
    errori18();
  }).fail(function (err) {
    if (err.status === 0 && !localStorage.jwtToken) {
      logoutClient();
    } else {
      $('#contentError').css('display', 'block');
      $('#contentSuccess').css('display', 'none');
      $('#alertTitlecontent_error').attr('data-i18n', 'errorTranslation.temp_error');
      errori18();
    }
  });
  errori18();
});
