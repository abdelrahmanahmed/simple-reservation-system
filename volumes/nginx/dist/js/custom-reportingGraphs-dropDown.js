// List of colors to be used in the Reporting Graphs
var colors = ["#c7dd6c","#daa861","#32baa3","#b52e3d","#c6b8fe","#70ac48","#7d649d","#d76cdd","#ed6048","#98653a","#3ea76d","#4771c3","#5b9bd8","#345e75","#3ea76d","#8a385c","#f6dd84","#ffc000","#ce5252","#ed7d31"];
var blockedColorJson = {};

/*
 * Javascript code to populate the Manual Reports Drop Downs
 *
 * getAvailableFilterDropDown() - For Available Profiles Report Drop Down
 * getUtilizedFilterDropDown() - For Reserved Profiles Report Drop Down
 * getReadyFilterDropDown() - For Unconfirmed Profiles Report Drop Down
 * getStatusFilterDropDown() - For Profile Download Status Report Drop Down
 *
 */
function getAvailableFilterDropDown() {
  // Dropdown population for profile type
  const profileTypeDropDownUrl = sessionStorage.gatewayurl + sessionStorage.profileTypeDropDownUrl;
  $.ajax({
    method: 'GET',
    url: profileTypeDropDownUrl,
    headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_profileType-avl-profile').append('<li data-option data-value="' + data[0].PROFILE_TYPES + '" class="cs-selected cs-option" id="profileTypeOption1-avl-profile"><span>' + data[0].PROFILE_TYPES + '</span></li>');
    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_profileType-avl-profile').append('<li data-option data-value="' + data[j].PROFILE_TYPES + '" class="cs-option" id="profileTypeOption' + (j+1) + '-avl-profile"><span>' + data[j].PROFILE_TYPES + '</span></li>');
    }
    $('#cs-option-ul_profileType-avl-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="profileTypeOption' + (data.length + 1) + '-avl-profile"><span></span></li>');
	bindings.init();
	translationi18();
  }).error(function(error) {
    // Ajax failed or got response other than 200
	if(error.status === 0 && !llocalStorage.jwtToken) {
        logoutClient();
    }else {
    $('#cs-option-ul_profileType-avl-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="profileTypeOption1-avl-profile"><span></span></li>');
	  translationi18();
    }
  });
  // Dropdown population for country
  const countryDropDownUrl = sessionStorage.gatewayurl + sessionStorage.countryDropDownUrl;
  $.ajax({
    method: 'GET',
    url: countryDropDownUrl,
    headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_countryType-avl-profile').append(
      '<li data-option data-value="' + data[0].OPERATOR_ID + '" class="cs-selected cs-option" id="countryTypeOption1-avl-profile"><span>' +
      data[0].OPERATOR_NAME.replace('vodafone', 'vf').toUpperCase() + '</span></li>');

    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_countryType-avl-profile').append(
        '<li data-option  data-value="' + data[j].OPERATOR_ID + '" class="cs-option" id="countryTypeOption' + (j+1) + '-avl-profile"><span>' +
        data[j].OPERATOR_NAME.replace('vodafone', 'vf').toUpperCase() + '</span></li>');
    }
    $('#cs-option-ul_countryType-avl-profile').append(
        '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="countryTypeOption' + (data.length + 1) + '-avl-profile"><span></span></li>');
	bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
      logoutClient();
    }else {
    $('#cs-option-ul_countryType-avl-profile').append(
    '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="countryTypeOption1-avl-profile"><span></span></li>');
	translationi18();
   }
 });
  // Dropdown population for Sim personalization company
  const simCompanyDropDownUrl = sessionStorage.gatewayurl + sessionStorage.simCompanyDropDownUrl;
  $.ajax({
    method: 'GET',
    url: simCompanyDropDownUrl,
	headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_simType-avl-profile').append(
      '<li data-option data-value="' + data[0].SMDP_ID + '" class="cs-selected cs-option" id="simTypeOption0-avl-profile"><span>' +
      data[0].SMDP_NAME + '</span></li>');
    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_simType-avl-profile').append(
        '<li data-option data-value="' + data[j].SMDP_ID + '" class="cs-option" id="simTypeOption' + (j+1) + '-avl-profile"><span>' +
        data[j].SMDP_NAME + '</span></li>');
    }
    $('#cs-option-ul_simType-avl-profile').append(
        '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="simTypeOption' + (data.length + 1) + '-avl-profile"><span></span></li>');
	bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_simType-avl-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="simTypeOption1-avl-profile"><span></span></li>');
	  translationi18();
	}
  });
}

function getUtilizedFilterDropDown() {
  // Dropdown population for profile type
  const profileTypeDropDownUrl = sessionStorage.gatewayurl + sessionStorage.profileTypeDropDownUrl;
  $.ajax({
    method: 'GET',
    url: profileTypeDropDownUrl,
    headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_profileType-util-profile').append(
      '<li data-option data-value="' + data[0].PROFILE_TYPES + '" class="cs-selected cs-option" id="profileTypeOption1-util-profile"><span>' +
      data[0].PROFILE_TYPES + '</span></li>');

    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_profileType-util-profile').append(
        '<li data-option data-value="' + data[j].PROFILE_TYPES + '" class="cs-option" id="profileTypeOption' + (j+1) + '-util-profile"><span>' +
        data[j].PROFILE_TYPES + '</span></li>');
    }
    $('#cs-option-ul_profileType-util-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="profileTypeOption' + (data.length + 1) + '-util-profile"><span></span></li>');
	bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
      $('#cs-option-ul_profileType-util-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="profileTypeOption1-util-profile"><span></span></li>');
	  translationi18();
	}
  });
  // Dropdown population for channel type
  const channelDropDownUrl = sessionStorage.gatewayurl + sessionStorage.channelDropDownUrl;
  $.ajax({
    method: 'GET',
    url: channelDropDownUrl,
	headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_channelType-util-profile').append(
      '<li data-option data-value="' + data[0].CHANNELS + '" class="cs-selected cs-option" id="channelTypeOption1-util-profile"><span>' +
      data[0].CHANNELS + '</span></li>');

    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_channelType-util-profile').append(
        '<li data-option data-value="' + data[j].CHANNELS + '" class="cs-option" id="channelTypeOption' + (j+1) + '-util-profile"><span>' +
        data[j].CHANNELS + '</span></li>');
    }
    $('#cs-option-ul_channelType-util-profile').append(
        '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="channelTypeOption' + (data.length + 1) + '-util-profile"><span></span></li>');
	bindings.init();
    translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_channelType-util-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="channelTypeOption1-util-profile"><span></span></li>');
      translationi18();
	}
  });
  // Dropdown population for country
  const countryDropDownUrl = sessionStorage.gatewayurl + sessionStorage.countryDropDownUrl;
  $.ajax({
    method: 'GET',
    url: countryDropDownUrl,
	headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_countryType-util-profile').append(
      '<li data-option data-value="' + data[0].OPERATOR_ID + '" class="cs-selected cs-option" id="countryTypeOption1-util-profile"><span>' +
       data[0].OPERATOR_NAME.replace('vodafone', 'vf').toUpperCase() + "</span></li>");
    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_countryType-util-profile').append(
        '<li data-option data-value="' + data[j].OPERATOR_ID + '" class="cs-option" id="countryTypeOption' + (j+1) + '-util-profile"><span>' +
         data[j].OPERATOR_NAME.replace('vodafone', 'vf').toUpperCase() + '</span></li>');
    }
    $('#cs-option-ul_countryType-util-profile').append(
        '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="countryTypeOption' + (data.length + 1) + '-util-profile"><span></span></li>');
	bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_countryType-util-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="countryTypeOption1-util-profile"><span></span></li>');
      translationi18();
	}
  });
  // Dropdown population for Sim personalization company
  const simCompanyDropDownUrl = sessionStorage.gatewayurl + sessionStorage.simCompanyDropDownUrl;
  $.ajax({
    method: 'GET',
    url: simCompanyDropDownUrl,
	headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_simType-util-profile').append('<li data-option data-value="' + data[0].SMDP_ID + '" class="cs-selected cs-option" id="simTypeOption1-util-profile"><span>' + data[0].SMDP_NAME + '</span></li>');
    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_simType-util-profile').append(
        '<li data-option data-value="' + data[j].SMDP_ID + '" class="cs-option" id="simTypeOption' + (j+1) + '-util-profile"><span>' +
        data[j].SMDP_NAME + '</span></li>');
    }
    $('#cs-option-ul_simType-util-profile').append(
        '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="simTypeOption' + (data.length + 1) + '-util-profile"><span></span></li>');
	bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_simType-util-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="simTypeOption1-util-profile"><span></span></li>');
	  translationi18();
	}
  });
}

function getReadyFilterDropDown() {
  // Dropdown population for profile type
  const profileTypeDropDownUrl = sessionStorage.gatewayurl + sessionStorage.profileTypeDropDownUrl;
  $.ajax({
    method: 'GET',
    url: profileTypeDropDownUrl,
	headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_profileType-rdy-profile').append('<li data-option data-value="' + data[0].PROFILE_TYPES + '" class="cs-selected cs-option" id="profileTypeOption1-rdy-profile"><span>' + data[0].PROFILE_TYPES + '</span></li>');
    for (var j = 1; j < data.length; j++) {
	  $('#cs-option-ul_profileType-rdy-profile').append('<li data-option data-value="' + data[j].PROFILE_TYPES + '" class="cs-option" id="profileTypeOption'+ (j+1)+'-rdy-profile"><span>' + data[j].PROFILE_TYPES + '</span></li>');
    }
    $('#cs-option-ul_profileType-rdy-profile').append('<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="profileTypeOption'+ (data.length + 1) +'-rdy-profile"><span></span></li>');
    bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_profileType-rdy-profile').append('<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="profileTypeOption1-rdy-profile"><span></span></li>');
      translationi18();
	}
  });
  // Dropdown population for channel type
  const channelDropDownUrl = sessionStorage.gatewayurl + sessionStorage.channelDropDownUrl;
  $.ajax({
    method: 'GET',
    url: channelDropDownUrl,
	headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_channelType-rdy-profile').append(
      '<li data-option data-value="' + data[0].CHANNELS + '" class="cs-selected cs-option" id="channelTypeOption1-rdy-profile"><span>' +
      data[0].CHANNELS + '</span></li>');

    for (var j = 1; j < data.length; j++) {
	  $('#cs-option-ul_channelType-rdy-profile').append(
      '<li data-option data-value="' + data[j].CHANNELS + '" class="cs-option" id="channelTypeOption' + (j+1) + '-rdy-profile"><span>' +
      data[j].CHANNELS + '</span></li>');

    }
    $('#cs-option-ul_channelType-rdy-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="channelTypeOption' + (data.length + 1) + '-rdy-profile"><span></span></li>');
    bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_channelType-rdy-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="channelTypeOption1-rdy-profile"><span></span></li>');
	  translationi18();
	}
  });
  // Dropdown population for device type
  const deviceDropDownUrl = sessionStorage.gatewayurl + sessionStorage.deviceDropDownUrl;
  $.ajax({
    method: 'GET',
    url: deviceDropDownUrl,
	headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_deviceType-rdy-profile').append(
      '<li data-option data-value="' + data[0].DEVICE_TYPES + '" class="cs-selected cs-option" id="deviceTypeOption1-rdy-profile"><span>' +
      data[0].DEVICE_TYPES + '</span></li>');
    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_deviceType-rdy-profile').append(
      '<li data-option data-value="' + data[j].DEVICE_TYPES + '" class="cs-option" id="deviceTypeOption ' + (j+1) + '-rdy-profile"><span>' +
      data[j].DEVICE_TYPES + '</span></li>');
    }
    $('#cs-option-ul_deviceType-rdy-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="deviceTypeOption ' + (data.length + 1) + '-rdy-profile"><span></span></li>');
    bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_deviceType-rdy-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="deviceTypeOption1-rdy-profile"><span></span></li>');
	  translationi18();
	}
  });
  // Dropdown population for Sim personalization company
  const simCompanyDropDownUrl = sessionStorage.gatewayurl + sessionStorage.simCompanyDropDownUrl;
  $.ajax({
    method: 'GET',
    url: simCompanyDropDownUrl,
	headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_simType-rdy-profile').append(
      '<li data-option data-value="' + data[0].SMDP_ID + '" class="cs-selected cs-option" id="simTypeOption1-rdy-profile"><span>' +
      data[0].SMDP_NAME + '</span></li>');
    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_simType-rdy-profile').append(
      '<li data-option data-value="' + data[j].SMDP_ID + '" class="cs-option" id="simTypeOption' + (j+1) + '-rdy-profile"><span>' +
      data[j].SMDP_NAME + '</span></li>');
    }
    $('#cs-option-ul_simType-rdy-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="simTypeOption' + (data.length + 1) + '-rdy-profile"><span></span></li>');
	bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_simType-rdy-profile').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="simTypeOption1-rdy-profile"><span></span></li>');
	  translationi18();
	}
  });
}

function getStatusFilterDropDown() {
  // Dropdown population for status dropdown
  const statusDropDownUrl = sessionStorage.gatewayurl + sessionStorage.statusDropDownUrl;
  $.ajax({
    method: 'GET',
    url: statusDropDownUrl,
	headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_statusType-profile-dwn').append(
      '<li data-option data-value="' + data[0].PROFILE_STATES + '" class="cs-selected cs-option" id="statusTypeOption1-profile-dwn"><span>' +
      data[0].PROFILE_STATES + '</span></li>');
    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_statusType-profile-dwn').append(
      '<li data-option data-value="' + data[j].PROFILE_STATES + '" class="cs-option" id="statusTypeOption'+ (j+1) + '-profile-dwn"><span>' +
      data[j].PROFILE_STATES + '</span></li>');
    }
    $('#cs-option-ul_statusType-profile-dwn').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="statusTypeOption'+ (data.length + 1) + '-profile-dwn"><span></span></li>');
	bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_statusType-profile-dwn').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="statusTypeOption1-profile-dwn"><span></span></li>');
      translationi18();
	}
  });
  // Dropdown population for profile type
  const profileTypeDropDownUrl = sessionStorage.gatewayurl + sessionStorage.profileTypeDropDownUrl;
  $.ajax({
    method: 'GET',
    url: profileTypeDropDownUrl,
	headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_profileType-profile-dwn').append(
      '<li data-option data-value="' + data[0].PROFILE_TYPES + '" class="cs-selected cs-option" id="profileTypeOption1-profile-dwn"><span>' +
      data[0].PROFILE_TYPES + '</span></li>');
    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_profileType-profile-dwn').append(
      '<li data-option data-value="' + data[j].PROFILE_TYPES + '" class="cs-option" id="profileTypeOption' + (j+1) + '-profile-dwn"><span>' +
      data[j].PROFILE_TYPES + '</span></li>');
    }
    $('#cs-option-ul_profileType-profile-dwn').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="profileTypeOption' + (data.length + 1) + '-profile-dwn"><span></span></li>');
    bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_profileType-profile-dwn').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="profileTypeOption1-profile-dwn"><span></span></li>');
      translationi18();
	}
  });
  // Dropdown population for channel type
  const channelDropDownUrl = sessionStorage.gatewayurl + sessionStorage.channelDropDownUrl;
  $.ajax({
    method: 'GET',
    url: channelDropDownUrl,
	headers: {
      'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_channelType-profile-dwn').append(
      '<li data-option data-value="' + data[0].CHANNELS + '" class="cs-selected cs-option" id="channelTypeOption1-profile-dwn"><span>' +
      data[0].CHANNELS + '</span></li>');
    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_channelType-profile-dwn').append(
      '<li data-option data-value="' + data[j].CHANNELS + '" class="cs-option" id="channelTypeOption' + (j+1) + '-profile-dwn"><span>' +
      data[j].CHANNELS + '</span></li>');
    }
    $('#cs-option-ul_channelType-profile-dwn').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="channelTypeOption' + (data.length + 1) + '-profile-dwn"><span></span></li>');
	bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_channelType-profile-dwn').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="channelTypeOption1-profile-dwn"><span></span></li>');
	  translationi18();
	}
  });
  // Dropdown population for device type
  const deviceDropDownUrl = sessionStorage.gatewayurl + sessionStorage.deviceDropDownUrl;
  $.ajax({
    method: 'GET',
    url: deviceDropDownUrl,
	headers: {
	  'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_deviceType-profile-dwn').append(
      '<li data-option data-value="' + data[0].DEVICE_TYPES + '" class="cs-selected cs-option" id="deviceTypeOption1-profile-dwn"><span>' +
      data[0].DEVICE_TYPES + '</span></li>');
    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_deviceType-profile-dwn').append(
      '<li data-option data-value="' + data[j].DEVICE_TYPES + '" class="cs-option" id="deviceTypeOption' + (j+1) + '-profile-dwn"><span>' +
      data[j].DEVICE_TYPES + '</span></li>');
    }
    $('#cs-option-ul_deviceType-profile-dwn').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="deviceTypeOption' + (data.length + 1) + '-profile-dwn"><span></span></li>');
	bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_deviceType-profile-dwn').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="deviceTypeOption1-profile-dwn"><span></span></li>');
	  translationi18();
	}
  });
  // Dropdown population for Sim personalization company
   simCompanyDropDownUrl = sessionStorage.gatewayurl + sessionStorage.simCompanyDropDownUrl;
  $.ajax({
    method: 'GET',
    url: simCompanyDropDownUrl,
	headers: {
      'Authorization': localStorage.jwtToken,
	}
  }).success(function(data) {
    $('#cs-option-ul_simType-profile-dwn').append(
      '<li data-option data-value="' + data[0].SMDP_ID + '" class="cs-selected cs-option" id="simTypeOption1-profile-dwn"><span>' +
      data[0].SMDP_NAME + '</span></li>');
    for (var j = 1; j < data.length; j++) {
      $('#cs-option-ul_simType-profile-dwn').append(
      '<li data-option data-value="' + data[j].SMDP_ID + '" class="cs-option" id="simTypeOption' + (j+1) + '-profile-dwn"><span>' +
      data[j].SMDP_NAME + '</span></li>');
    }
    $('#cs-option-ul_simType-profile-dwn').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="simTypeOption' + (data.length + 1) + '-profile-dwn"><span></span></li>');
    bindings.init();
	translationi18();
  }).error(function(error) {
	if(error.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  $('#cs-option-ul_simType-profile-dwn').append(
      '<li data-option data-i18n=translation.label_all data-value="all" class="cs-option" id="simTypeOption1-profile-dwn"><span></span></li>');
      translationi18();
	}
  });
};

/*
 * Javascript code to display the Graphs on Reporting Page
 *
 * availableReportGraph() - For Available Profiles Report Graph
 * utilizedReportGraph() - For Reserved Profiles Report Graph
 * readyProfileGraph() - For Unconfirmed Profiles Report Graph
 * statusReportGraph() - For Profile Download Status Report Graph
 *
 */

function statusReportGraph() {
  var fromDate = new Date((new Date()).setDate(new Date().getDate() - 6)).format('yyyy-mm-dd');
  var toDate = new Date().format('yyyy-mm-dd');
  $('.fromTime').html(new Date(fromDate).format('dd/mm/yyyy'));
  $('.toTime').html(new Date().format('dd/mm/yyyy')+ ')');
  var url = sessionStorage.gatewayurl + sessionStorage.reports + 'profileDownloadGraph' + '&fromDate='+fromDate+'&toDate='+toDate;
  $.ajax({
    method: 'GET',
    async: false,
    url: url,
    headers: {
	  'Authorization': localStorage.jwtToken,
	},
	jsonpCallback: 'jsonCallback',
    crossDomain: true,
    dataType: 'json'
  }).success(function(data) {
    if (data.length !== 0) {
      var dateArray = [];
      var formatedDate = [];
      var uniqStatus = [];
      var statusJson = {};
      var flagArray = [];
      var sumStatusCount = 0
      for (var i = 0; i < data.length; i++) {
        var graphDate = data[i].RESPONSE_DATE;
        if (dateArray.indexOf(graphDate) === -1) {
          dateArray.push(graphDate);
          formatedDate.push((new Date(graphDate)).format('dd/mm/yyyy'));
        }
        if (uniqStatus.indexOf(data[i].RESPONSE_STATUS) === -1) {
          uniqStatus.push(data[i].RESPONSE_STATUS);
        }
        /*check if the element exists in the json, if yes, then push block_count in array of json element*/
        if (statusJson[data[i].RESPONSE_STATUS]) {
          /*maintain flagArray with Boolean flag true, so that when the element comes again, then we can pop out the last element and add current block_count and insert it back*/
          if (flagArray[data[i].RESPONSE_STATUS + '_' + data[i].RESPONSE_DATE]) {
            sumStatusCount = parseInt(statusJson[data[i].RESPONSE_STATUS].pop());
            statusJson[data[i].RESPONSE_STATUS].push(parseInt(data[i].STATUS_COUNT) + sumStatusCount);
          } else {
            statusJson[data[i].RESPONSE_STATUS].push(parseInt(data[i].STATUS_COUNT));
          }
        } else {
          /*it doesn’t exists in the json object, hence create as an array of json element*/
          statusJson[data[i].RESPONSE_STATUS] = [parseInt(data[i].STATUS_COUNT)];
        }
        flagArray[data[i].RESPONSE_STATUS + '_' + data[i].RESPONSE_DATE] = true;
      }
      /*the date for which data is not present in the input array, lets add elements in it*/
      for (var i = 0; i < uniqStatus.length; i++) {
        for (var j = 0; j < dateArray.length; j++) {
          if (flagArray[uniqStatus[i] + '_' + dateArray[j]]) {
            continue;
          } else {
            statusJson[uniqStatus[i]].splice(j, 0, 0);
          }
        }
      }
      var profileDataPoints = [{
        'type': 'date',
        'values': formatedDate.reverse()
      }];
      var loopLength = Object.keys(statusJson).length > 5 ? 5 : Object.keys(statusJson).length;
      for(i = 0; i < loopLength; i++) {
        var tempJson = {};
		var key = Object.keys(statusJson)[i]
        tempJson['type'] = key;
        tempJson['values'] = statusJson[key].reverse();
		if(blockedColorJson[key]){
          tempJson['colour'] = blockedColorJson[key];
        }else{
          tempJson['colour'] = colors[0];
          blockedColorJson[key] = colors[0];
          colors.shift();
        }
        profileDataPoints.push(tempJson);
      }
      Canvas($('#download_graph'), $('#download_profile-legend'),profileDataPoints, true, 'histogram');
	  localStorage.download_graph_data=JSON.stringify(profileDataPoints);
    }else{
      Canvas($('#download_graph'), $('#download_profile-legend'), data, true, 'histogram');
	  localStorage.download_graph_data=JSON.stringify(data);
    }
  }).error(function(data) {
	//Ajax call failed
	if(data.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
      data = [];
      Canvas($("#download_graph"), $("#download_profile-legend"), data, true, "histogram");
	  localStorage.download_graph_data=JSON.stringify(data);
	}
  });
};

function availableReportGraph() {
  var fromDate = new Date((new Date()).setDate(new Date().getDate() - 6)).format('yyyy-mm-dd');
  var toDate = new Date().format('yyyy-mm-dd');

  $('.fromTime').html(new Date(fromDate).format('dd/mm/yyyy'));
  $('.toTime').html(new Date().format('dd/mm/yyyy')+ ')');

  var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.reports + 'availableReport' + '&fromDate=' + fromDate + '&toDate=' + toDate;

  $.ajax({
    method: "GET",
    async: false,
    url: ajaxUrl,
    headers: {
	  'Authorization': localStorage.jwtToken,
	},
	jsonpCallback: 'jsonCallback',
    crossDomain: true,
    dataType: "json"
  }).success(function(data) {
    if (data.length !== 0) {
      var formatedDate = [];
      var dateArray = [];
      var profileJson = {};
      var flagArray = [];
      var sumAvlCount = 0;
      var uniqprof = [];
      var uniqcountry = [];
      for (var i = 0; i < data.length; i++) {
		var graphDate = data[i].REPORT_DATE;
		var country = data[i].OPERATOR_NAME.replace('vodafone', 'vf').toUpperCase();
        if (dateArray.indexOf(graphDate) === -1) {
          dateArray.push(graphDate);
          formatedDate.push((new Date(graphDate)).format('dd/mm/yyyy'));
        }
        if (sessionStorage.role.indexOf(sessionStorage.groupAdminRole) > -1) {
          if (uniqcountry.indexOf(country) === -1) {
            uniqcountry.push(country);
          }
        } else {
          if (uniqprof.indexOf(data[i].PROFILE_TYPE) === -1) {
            uniqprof.push(data[i].PROFILE_TYPE);
          }
        }
        if (!(sessionStorage.role.indexOf(sessionStorage.groupAdminRole) > -1)) {
          //Admin Block
          /*check if the element exists in the json, if yes, then push avl count in array of json element*/
          if (profileJson[data[i].PROFILE_TYPE]) {
            /*maintain flagArray with Boolean flag true, so that when the element comes again, then we can pop out the last element and add current block_count and insert it back*/
            if (flagArray[data[i].PROFILE_TYPE + '_' + graphDate]) {
              sumAvlCount = profileJson[data[i].PROFILE_TYPE].pop();
              profileJson[data[i].PROFILE_TYPE].push(parseInt(data[i].AVAILABLE_RECORDS) + parseInt(sumAvlCount));
            } else {
              profileJson[data[i].PROFILE_TYPE].push(parseInt(data[i].AVAILABLE_RECORDS));
            }
          } else {
            /*it doesn’t exists in the json object, hence create as an array of json element*/
            profileJson[data[i].PROFILE_TYPE] = [parseInt(data[i].AVAILABLE_RECORDS)];
          }
          flagArray[data[i].PROFILE_TYPE + '_' + graphDate] = true;
        } else {
          //Group Admin Block
          /*check if the element exists in the json, if yes, then push avl count in array of json element*/
          if (profileJson[country]) {
            /*maintain flagArray with Boolean flag true, so that when the element comes again, then we can pop out the last element and add current block_count and insert it back*/
            if (flagArray[country + '_' + graphDate]) {
              sumAvlCount = profileJson[country].pop();
              profileJson[country].push(parseInt(data[i].AVAILABLE_RECORDS) +
                parseInt(sumAvlCount));
            } else {
              profileJson[country].push(parseInt(data[i].AVAILABLE_RECORDS));
            }
          } else {
            /*it doesn’t exists in the json object, hence create as an array of json element*/
            profileJson[country] = [parseInt(data[i].AVAILABLE_RECORDS)];
          }
          flagArray[country + '_' + graphDate] = true;
        }
      }
      if (!(sessionStorage.role.indexOf(sessionStorage.groupAdminRole) > -1)) {
        //Admin Block
        /*the date for which data is not present in the input array, lets add elements in it*/
        for (var i = 0; i < uniqprof.length; i++) {
          for (var j = 0; j < dateArray.length; j++) {
            if (flagArray[uniqprof[i] + '_' + dateArray[j]]) {
              continue;
            } else {
              profileJson[uniqprof[i]].splice(j, 0, 0);
            }
          }
        }
      } else {
        //Group Admin Block
        /*the date for which data is not present in the input array, lets add elements in it*/
        for (var i = 0; i < uniqcountry.length; i++) {
          for (var j = 0; j < dateArray.length; j++) {
            if (flagArray[uniqcountry[i] + '_' + dateArray[j]]) {
              continue;
            } else {
              profileJson[uniqcountry[i]].splice(j, 0, 0);
            }
          }
        }
      }
      var availableDataPoints = [{
        "type": "date",
        "values": formatedDate.reverse()
      }];
	  var loopLength = Object.keys(profileJson).length > 5 ? 5 : Object.keys(profileJson).length;
      for(i = 0; i < loopLength; i++) {
        var tempJson = {};
		var key = Object.keys(profileJson)[i];
        tempJson['type'] = key;
        tempJson['values'] = profileJson[key].reverse();
		if(blockedColorJson[key]){
          tempJson['colour'] = blockedColorJson[key];
        }else{
          tempJson['colour'] = colors[0];
          blockedColorJson[key] = colors[0];
          colors.shift();
        }
        availableDataPoints.push(tempJson);
      }
      Canvas($("#available_graph"), $("#available-legend"), availableDataPoints, true, "lines");
	  localStorage.available_graph_data=JSON.stringify(availableDataPoints);
    }else{
      Canvas($("#available_graph"), $("#available-legend"), data, true, "lines");
	  localStorage.available_graph_data=JSON.stringify(data);
    }
  }).error(function(data) {
    //Ajax call failed
	if(data.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
      data = [];
      Canvas($("#available_graph"), $("#available-legend"), data, true, "lines");
	  localStorage.available_graph_data=JSON.stringify(data);
	}
  });
};

function utilizedReportGraph() {
  var fromDate = new Date((new Date()).setDate(new Date().getDate() - 6)).format('yyyy-mm-dd');
  var toDate = new Date().format('yyyy-mm-dd');

  $('.fromTime').html(new Date(fromDate).format('dd/mm/yyyy'));
  $('.toTime').html(new Date().format('dd/mm/yyyy')+ ')');

  var ajaxUrl = sessionStorage.gatewayurl + sessionStorage.reports + 'reservedReport' + '&fromDate=' + fromDate + '&toDate=' + toDate;

  $.ajax({
    method: "GET",
    async: false,
    url: ajaxUrl,
    headers: {
	  'Authorization': localStorage.jwtToken,
	},
    jsonpCallback: 'jsonCallback',
    crossDomain: true,
    dataType: "json"
  }).success(function(data) {
    if (data.length !== 0) {
      var uniqdate = [];
      var formatedDate = [];
      var profileJson = {};
      var flagArray = [];
      var sumBlockCount = 0;
      var uniqprof = [];
      var uniqcountry = [];
      for (var i = 0; i < data.length; i++) {
        var graphDate = data[i].DATE_RESERVED;
        var country = data[i].OPERATOR_NAME.replace('vodafone', 'vf').toUpperCase();
        /*Lets create uniq array of date and profile, which will be used later for missing entries*/
        if (uniqdate.indexOf(graphDate) === -1) {
          uniqdate.push(graphDate);
          formatedDate.push((new Date(graphDate)).format('dd/mm/yyyy'));
        }
        if (sessionStorage.role.indexOf(sessionStorage.groupAdminRole) > -1) {
          if (uniqcountry.indexOf(country) === -1) {
            uniqcountry.push(country);
          }
        } else {
          if (uniqprof.indexOf(data[i].PROFILE_TYPE) === -1) {
            uniqprof.push(data[i].PROFILE_TYPE);
          }
        }
        if (!(sessionStorage.role.indexOf(sessionStorage.groupAdminRole) > -1)) {
          /*check if the element exists in the json, if yes, then push block_count in array of json element*/
          if (profileJson[data[i].PROFILE_TYPE]) {
            /*maintain flagArray with Boolean flag true, so that when the element comes again, then we can pop out the last element and add current block_count and insert it back*/
            if (flagArray[data[i].PROFILE_TYPE + '_' + graphDate]) {
              sumBlockCount = parseInt(profileJson[data[i].PROFILE_TYPE].pop());
              profileJson[data[i].PROFILE_TYPE].push(parseInt(data[i].BLOCK_COUNT) + sumBlockCount);
            } else {
              profileJson[data[i].PROFILE_TYPE].push(parseInt(data[i].BLOCK_COUNT));
            }
          } else {
            /*it doesn’t exists in the json object, hence create as an array of json element*/
            profileJson[data[i].PROFILE_TYPE] = [parseInt(data[i].BLOCK_COUNT)];
          }
          flagArray[data[i].PROFILE_TYPE + '_' + graphDate] = true;
        } else {
          /*check if the element exists in the json, if yes, then push block_count in array of json element*/
          if (profileJson[country]) {
            /*maintain flagArray with Boolean flag true, so that when the element comes again, then we can pop out the last element and add current block_count and insert it back*/
            if (flagArray[country + '_' + graphDate]) {
              sumBlockCount = parseInt(profileJson[country].pop());
              profileJson[country].push(parseInt(data[i].BLOCK_COUNT) + sumBlockCount);
            } else {
              profileJson[country].push(parseInt(data[i].BLOCK_COUNT));
            }
          } else {
            /*it doesn’t exists in the json object, hence create as an array of json element*/
            profileJson[country] = [parseInt(data[i].BLOCK_COUNT)];
          }
          flagArray[country + '_' + graphDate] = true;
        }
      }
      if (!(sessionStorage.role.indexOf(sessionStorage.groupAdminRole) > -1)) {
        /*the date for which data is not present in the input array, lets add elements in it*/
        for (var i = 0; i < uniqprof.length; i++) {
          for (var j = 0; j < uniqdate.length; j++) {
            if (flagArray[uniqprof[i] + '_' + uniqdate[j]]) {
              continue;
            } else {
              profileJson[uniqprof[i]].splice(j, 0, 0);
            }
          }
        }
      } else {
        /*the date for which data is not present in the input array, lets add elements in it*/
        for (var i = 0; i < uniqcountry.length; i++) {
          for (var j = 0; j < uniqdate.length; j++) {
            if (flagArray[uniqcountry[i] + '_' + uniqdate[j]]) {
              continue;
            } else {
              profileJson[uniqcountry[i]].splice(j, 0, 0);
            }
          }
        }
      }
      var blockDataPoints = [{
        "type": "date",
        "values": formatedDate.reverse()
      }];
      var loopLength = Object.keys(profileJson).length > 5 ? 5 : Object.keys(profileJson).length;
      for (i = 0; i < loopLength; i++) {
        var tempJson = {};
		var key = Object.keys(profileJson)[i];
        tempJson['type'] = key;
        tempJson['values'] = profileJson[key].reverse();
		if(blockedColorJson[key]){
          tempJson['colour'] = blockedColorJson[key];
        }else{
          tempJson['colour'] = colors[0];
          blockedColorJson[key] = colors[0];
          colors.shift();
        }
        blockDataPoints.push(tempJson);
      }
      Canvas($("#utilized_graph"), $("#util-legend"), blockDataPoints, true,"lines");
	  localStorage.utilized_graph_data = JSON.stringify(blockDataPoints);
    }else{
      Canvas($("#utilized_graph"), $("#util-legend"), data, true,"lines");
	  localStorage.utilized_graph_data = JSON.stringify(data);
    }
  }).error(function(data) {
    //Ajax call failed
	if(data.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
      data = [];
      Canvas($("#utilized_graph"), $("#util-legend"), data, true,"lines");
	  localStorage.utilized_graph_data = JSON.stringify(data);
	}
  });
};

function readyProfileGraph() {
  var fromDate = new Date((new Date()).setDate(new Date().getDate() - 6)).format('yyyy-mm-dd');
  var toDate = new Date().format('yyyy-mm-dd');
  $('.fromTime').html(new Date(fromDate).format('dd/mm/yyyy'));
  $('.toTime').html(new Date().format('dd/mm/yyyy')+ ')');
  var url = sessionStorage.gatewayurl + sessionStorage.reports + 'unconfirmedReport'+'&fromDate='+fromDate+'&toDate='+toDate
  $.ajax({
    method: 'GET',
    async: false,
    url: url,
    headers: {
	  'Authorization': localStorage.jwtToken,
	},
	jsonpCallback: 'jsonCallback',
    crossDomain: true,
    dataType: 'json'
  }).success(function(data) {
	  var finalData=data[0];
    if (finalData.length !== 0) {
      var dateArray = [];
      var formatedDate = [];
      var uniqprof = [];
      var profileJson = {};
      var flagArray = [];
      var sumReadyCount = 0;
      for (var i = 0; i < finalData.length; i++) {
		var graphDate = finalData[i].RESPONSE_DATE;
		if (dateArray.indexOf(graphDate) === -1) {
          dateArray.push(graphDate);
          formatedDate.push((new Date(graphDate)).format('dd/mm/yyyy'));
        }
        if (uniqprof.indexOf(finalData[i].PROFILE_TYPE) === -1) {
          uniqprof.push(finalData[i].PROFILE_TYPE);
        }
        /*check if the element exists in the json, if yes, then push block_count in array of json element*/
        if (profileJson[finalData[i].PROFILE_TYPE]) {
          /*maintain flagArray with Boolean flag true, so that when the element comes again, then we can pop out the last element and add current READY_COUNT and insert it back*/
          if (flagArray[finalData[i].PROFILE_TYPE + '_' + finalData[i].RESPONSE_DATE]) {
            sumReadyCount = parseInt(profileJson[finalData[i].PROFILE_TYPE].pop());
            profileJson[finalData[i].PROFILE_TYPE].push(parseInt(finalData[i].READY_COUNT) + sumReadyCount);
          } else {
            profileJson[finalData[i].PROFILE_TYPE].push(parseInt(finalData[i].READY_COUNT));
          }
        } else {
          /*it doesn’t exists in the json object, hence create as an array of json element*/
          profileJson[finalData[i].PROFILE_TYPE] = [parseInt(finalData[i].READY_COUNT)];
        }
        flagArray[finalData[i].PROFILE_TYPE + '_' + finalData[i].RESPONSE_DATE] = true;
      }
      /*the date for which data is not present in the input array, lets add elements in it*/
      for (var i = 0; i < uniqprof.length; i++) {
        for (var j = 0; j < dateArray.length; j++) {
          if (flagArray[uniqprof[i] + '_' + dateArray[j]]) {
            continue;
          } else {
            profileJson[uniqprof[i]].splice(j, 0, 0);
          }
        }
      }
      var readyDataPoints = [{
        'type': 'date',
        'values': formatedDate.reverse()
      }];
      var loopLength = Object.keys(profileJson).length > 5 ? 5 : Object.keys(profileJson).length;
      for(i = 0; i < loopLength; i++) {
        var tempJson = {};
		var key = Object.keys(profileJson)[i];
        tempJson['type'] = key;
        tempJson['values'] = profileJson[key].reverse();
		if(blockedColorJson[key]){
          tempJson['colour'] = blockedColorJson[key];
        }else{
          tempJson['colour'] = colors[0];
          blockedColorJson[key] = colors[0];
          colors.shift();
        }
        readyDataPoints.push(tempJson);
      }
      Canvas($('#ready_profile_graph'), $('#ready_profile-legend'), readyDataPoints, true, 'lines');
	  localStorage.ready_profile_graph_data=JSON.stringify(readyDataPoints);
    } else {
      Canvas($('#ready_profile_graph'), $('#ready_profile-legend'), finalData, true, 'lines');
	  localStorage.ready_profile_graph_data=JSON.stringify(finalData);
    }
  }).error(function(data) {
    // Ajax Call failed
	if(data.status === 0 && !localStorage.jwtToken) {
        logoutClient();
    }else {
	  data = [];
      Canvas($('#ready_profile_graph'), $('#ready_profile-legend'), data, true, 'lines');
	  localStorage.ready_profile_graph_data=JSON.stringify(data);
	}
  });
};