//Below function is used for Pagination
function pagination(id, totalRec) {
  $('.pagination-arrows').empty();
  var index = id;
  var noOfRecords = totalRec;
  var noOfPages = Math.floor(noOfRecords / index);
  if (noOfRecords % index != 0) {
    noOfPages = noOfPages + 1;
  }

  if (noOfPages > 1) {
    // pagination arrows
    $(".pagination-arrows").html(
      '<span id="first_page_arrow"><img class="pagination_btn pagination_first btn_disabled" id="pagination_first" src="/img/pagination/2-arw.png"></img></span>' +
      '<span class="pagination_arrows pagination_right"><img class="pagination_btn pagination_prev btn_disabled" id="1" src="/img/pagination/4-arw.png"></img></span>' +
      '<span class="current-page pagination_arrows" id="page-no">1</span><span class="pagination_arrows pagination_right"><img class="pagination_btn pagination_next" id="2" src="/img/pagination/3--arw.png"></img></span>' +
      '<span class="pagination_arrows"><img class="pagination_btn pagination_last" id="pagination_last" src="/img/pagination/1-arw.png"></img></span>');
    $('#table-body').children().css('display', 'none');
    $('#table-body').children().slice(0, index).css('display', 'table-row');


    // display per page
    $(".pagination_next").click(function() {

      var value = this.id;
      if (value <= noOfPages) {
        var startPoint = index * (value - 1);
        var endPoint = index * value;
        $('#table-body').children().css('display', 'none');
        $('#table-body').children().slice(startPoint, endPoint).css('display', 'table-row');
        var pageNo = $("#page-no").text();
        $(".current-page").text(parseInt(pageNo) + 1);
        $(this).attr("id", parseInt(value) + 1);
        $(".pagination_prev").attr("id", parseInt(value));
        $(".pagination_first").removeClass('btn_disabled');
        $(".pagination_prev").removeClass('btn_disabled');
        if (parseInt(value) === noOfPages) {
          $(".pagination_last").addClass('btn_disabled');
          $(".pagination_next").addClass('btn_disabled');
        }
      }
    });

    $(".pagination_prev").click(function() {

      var value = this.id;
      if (value != 1) {
        var startPoint = index * (value - 2);
        var endPoint = index * (value - 1);
        $('#table-body').children().css('display', 'none');
        $('#table-body').children().slice(startPoint, endPoint).css('display', 'table-row');
        var pageNo = $("#page-no").text();
        $(".current-page").text(parseInt(pageNo) - 1);
        $(this).attr("id", parseInt(value) - 1);
        $(".pagination_next").attr("id", parseInt(value));
        $(".pagination_last").removeClass('btn_disabled');
        $(".pagination_next").removeClass('btn_disabled');
        if (parseInt(value) - 1 === 1) {
          $(".pagination_prev").addClass('btn_disabled');
          $(".pagination_first").addClass('btn_disabled');
        }
      } else {
        $(".pagination_prev").addClass('btn_disabled');
        $(".pagination_first").addClass('btn_disabled');
      }
    });

    $("#pagination_first").click(function() {

      $('#table-body').children().css('display', 'none');
      $('#table-body').children().slice(0, index).css('display', 'table-row');
      $(".current-page").text(1);
      $(".pagination_prev").attr("id", 1);
      $(".pagination_next").attr("id", 2);
      $(".pagination_first").addClass('btn_disabled');
      $(".pagination_last").removeClass('btn_disabled');
      $(".pagination_next").removeClass('btn_disabled');
      $(".pagination_prev").addClass('btn_disabled');

    });


    $("#pagination_last").click(function() {

      var startPoint = (noOfPages * index) - index;
      var endPoint = noOfPages * index;

      $('#table-body').children().css('display', 'none');
      $('#table-body').children().slice(startPoint, endPoint).css('display', 'table-row');
      $(".current-page").text(noOfPages);
      $(".pagination_prev").attr("id", noOfPages);
      $(".pagination_next").attr("id", noOfPages + 1);
      $(".pagination_last").addClass('btn_disabled');
      $(".pagination_first").removeClass('btn_disabled');
      $(".pagination_prev").removeClass('btn_disabled');
      $(".pagination_next").addClass('btn_disabled');

    });
  } else {
    $('#table-body').children().css('display', 'table-row');
  }

};
//Code for Pagination logic ends
//Code for Pagination of Available report
function paginationAvl(id, totalRec) {
  $('.pagination-arrows').empty();
  var index = id;
  var noOfRecords = totalRec;
  var noOfPages = Math.floor(noOfRecords / index);
  if (noOfRecords % index != 0) {
    noOfPages = noOfPages + 1;
  }

  if (noOfPages > 1) {
    // pagination arrows
    $(".pagination-arrows").html('<span id="first_page_arrow"><img class="pagination_btn pagination_first btn_disabled" src="/img/pagination/2-arw.png"></img></span>' +
      '<span class="pagination_arrows pagination_right"><img class="pagination_btn pagination_prev btn_disabled" id="1" src="/img/pagination/4-arw.png"></img></span>' +
      '<span class="pagination_arrows current-page" id="avl-page-no">1</span><span class="pagination_arrows pagination_right"><img class="pagination_btn pagination_next" id="2" src="/img/pagination/3--arw.png"></img></span>' +
      '<span class="pagination_arrows"><img class="pagination_btn pagination_last" src="/img/pagination/1-arw.png"></img></span>');


    $('#avl-table-body').children().css('display', 'none');
    $('#avl-table-body').children().slice(0, index).css('display', 'table-row');


    // display per page
    $(".pagination_next").click(function() {

      var value = this.id;
      if (value <= noOfPages) {
        var startPoint = index * (value - 1);
        var endPoint = index * value;
        $('#avl-table-body').children().css('display', 'none');
        $('#avl-table-body').children().slice(startPoint, endPoint).css('display', 'table-row');
        var pageNo = $("#avl-page-no").text();
        $(".current-page").text(parseInt(pageNo) + 1);
        $(this).attr("id", parseInt(value) + 1);
        $(".pagination_prev").attr("id", parseInt(value));
        $(".pagination_first").removeClass('btn_disabled');
        $(".pagination_prev").removeClass('btn_disabled');
        if (parseInt(value) === noOfPages) {
          $(".pagination_last").addClass('btn_disabled');
          $(".pagination_next").addClass('btn_disabled');
        }
      }
    });

    $(".pagination_prev").click(function() {

      var value = this.id;
      if (value != 1) {
        var startPoint = index * (value - 2);
        var endPoint = index * (value - 1);
        $('#avl-table-body').children().css('display', 'none');
        $('#avl-table-body').children().slice(startPoint, endPoint).css('display', 'table-row');
        var pageNo = $("#avl-page-no").text();
        $(".current-page").text(parseInt(pageNo) - 1);
        $(this).attr("id", parseInt(value) - 1);
        $(".pagination_next").attr("id", parseInt(value));
        $(".pagination_last").removeClass('btn_disabled');
        $(".pagination_next").removeClass('btn_disabled');
        if (parseInt(value) - 1 === 1) {
          $(".pagination_prev").addClass('btn_disabled');
          $(".pagination_first").addClass('btn_disabled');
        }
      } else {
        $(".pagination_prev").addClass('btn_disabled');
        $(".pagination_first").addClass('btn_disabled');
      }
    });

    $(".pagination_first").click(function() {

      $('#avl-table-body').children().css('display', 'none');
      $('#avl-table-body').children().slice(0, index).css('display', 'table-row');
      $(".current-page").text(1);
      $(".pagination_prev").attr("id", 1);
      $(".pagination_next").attr("id", 2);
      $(".pagination_first").addClass('btn_disabled');
      $(".pagination_last").removeClass('btn_disabled');
      $(".pagination_next").removeClass('btn_disabled');
      $(".pagination_prev").addClass('btn_disabled');

    });


    $(".pagination_last").click(function() {

      var startPoint = (noOfPages * index) - index;
      var endPoint = noOfPages * index;

      $('#avl-table-body').children().css('display', 'none');
      $('#avl-table-body').children().slice(startPoint, endPoint).css('display', 'table-row');
      $(".current-page").text(noOfPages);
      $(".pagination_prev").attr("id", noOfPages);
      $(".pagination_next").attr("id", noOfPages + 1);
      $(".pagination_last").addClass('btn_disabled');
      $(".pagination_first").removeClass('btn_disabled');
      $(".pagination_prev").removeClass('btn_disabled');
      $(".pagination_next").addClass('btn_disabled');

    });
  } else {
    $('#avl-table-body').children().css('display', 'table-row');
  }

};
//Code for Pagination of Success/Unsuccess report
function paginationStatus(id, totalRec) {
  $('.pagination-arrows').empty();
  var index = id;
  var noOfRecords = totalRec;
  var noOfPages = Math.floor(noOfRecords / index);
  if (noOfRecords % index != 0) {
    noOfPages = noOfPages + 1;
  }

  if (noOfPages > 1) {
    // pagination arrows
    $(".pagination-arrows").html('<span id="first_page_arrow"><img class="pagination_btn pagination_first btn_disabled" src="/img/pagination/2-arw.png"></img></span>' +
      '<span class="pagination_arrows pagination_right"><img class="pagination_btn pagination_prev btn_disabled" id="1" src="/img/pagination/4-arw.png"></img></span>' +
      '<span class="current-page pagination_arrows" id="status-page-no">1</span><span class="pagination_arrows pagination_right"><img class="pagination_btn pagination_next" id="2" src="/img/pagination/3--arw.png"></img></span>' +
      '<span class="pagination_arrows"><img class="pagination_btn pagination_last" src="/img/pagination/1-arw.png"></img></span>');


    $('#status-table-body').children().css('display', 'none');
    $('#status-table-body').children().slice(0, index).css('display', 'table-row');


    // display per page
    $(".pagination_next").click(function() {

      var value = this.id;
      if (value <= noOfPages) {
        var startPoint = index * (value - 1);
        var endPoint = index * value;
        $('#status-table-body').children().css('display', 'none');
        $('#status-table-body').children().slice(startPoint, endPoint).css('display', 'table-row');
        var pageNo = $("#status-page-no").text();
        $(".current-page").text(parseInt(pageNo) + 1);
        $(this).attr("id", parseInt(value) + 1);
        $(".pagination_prev").attr("id", parseInt(value));
        $(".pagination_first").removeClass('btn_disabled');
        $(".pagination_prev").removeClass('btn_disabled');
        if (parseInt(value) === noOfPages) {
          $(".pagination_last").addClass('btn_disabled');
          $(".pagination_next").addClass('btn_disabled');
        }
      }
    });

    $(".pagination_prev").click(function() {

      var value = this.id;
      if (value != 1) {
        var startPoint = index * (value - 2);
        var endPoint = index * (value - 1);
        $('#status-table-body').children().css('display', 'none');
        $('#status-table-body').children().slice(startPoint, endPoint).css('display', 'table-row');
        var pageNo = $("#status-page-no").text();
        $(".current-page").text(parseInt(pageNo) - 1);
        $(this).attr("id", parseInt(value) - 1);
        $(".pagination_next").attr("id", parseInt(value));
        $(".pagination_last").removeClass('btn_disabled');
        $(".pagination_next").removeClass('btn_disabled');
        if (parseInt(value) - 1 === 1) {
          $(".pagination_prev").addClass('btn_disabled');
          $(".pagination_first").addClass('btn_disabled');
        }
      } else {
        $(".pagination_prev").addClass('btn_disabled');
        $(".pagination_first").addClass('btn_disabled');
      }
    });

    $(".pagination_first").click(function() {

      $('#status-table-body').children().css('display', 'none');
      $('#status-table-body').children().slice(0, index).css('display', 'table-row');
      $(".current-page").text(1);
      $(".pagination_prev").attr("id", 1);
      $(".pagination_next").attr("id", 2);
      $(".pagination_first").addClass('btn_disabled');
      $(".pagination_last").removeClass('btn_disabled');
      $(".pagination_next").removeClass('btn_disabled');
      $(".pagination_prev").addClass('btn_disabled');

    });


    $(".pagination_last").click(function() {

      var startPoint = (noOfPages * index) - index;
      var endPoint = noOfPages * index;

      $('#status-table-body').children().css('display', 'none');
      $('#status-table-body').children().slice(startPoint, endPoint).css('display', 'table-row');
      $(".current-page").text(noOfPages);
      $(".pagination_prev").attr("id", noOfPages);
      $(".pagination_next").attr("id", noOfPages + 1);
      $(".pagination_last").addClass('btn_disabled');
      $(".pagination_first").removeClass('btn_disabled');
      $(".pagination_prev").removeClass('btn_disabled');
      $(".pagination_next").addClass('btn_disabled');

    });
  } else {
    $('#status-table-body').children().css('display', 'table-row');
  }

};

//Code for Pagination of Ready report
function paginationReady(id, totalRec) {
  $('.pagination-arrows').empty();
  var index = id;
  var noOfRecords = totalRec;
  var noOfPages = Math.floor(noOfRecords / index);
  if (noOfRecords % index != 0) {
    noOfPages = noOfPages + 1;
  }

  if (noOfPages > 1) {
    // pagination arrows
    $(".pagination-arrows").html('<span id="first_page_arrow"><img class="pagination_btn pagination_first btn_disabled" src="/img/pagination/2-arw.png"></img></span>' +
      '<span class="pagination_arrows pagination_right"><img class="pagination_btn pagination_prev btn_disabled" id="1" src="/img/pagination/4-arw.png"></img></span>' +
      '<span class="current-page pagination_arrows" id="rdy-page-no">1</span><span class="pagination_arrows pagination_right"><img class="pagination_btn pagination_next" id="2" src="/img/pagination/3--arw.png"></img></span>' +
      '<span class="pagination_arrows"><img class="pagination_btn pagination_last" src="/img/pagination/1-arw.png"></img></span>');


    $('#rdy-table-body').children().css('display', 'none');
    $('#rdy-table-body').children().slice(0, index).css('display', 'table-row');


    // display per page
    $(".pagination_next").click(function() {

      var value = this.id;
      if (value <= noOfPages) {
        var startPoint = index * (value - 1);
        var endPoint = index * value;
        $('#rdy-table-body').children().css('display', 'none');
        $('#rdy-table-body').children().slice(startPoint, endPoint).css('display', 'table-row');
        var pageNo = $("#rdy-page-no").text();
        $(".current-page").text(parseInt(pageNo) + 1);
        $(this).attr("id", parseInt(value) + 1);
        $(".pagination_prev").attr("id", parseInt(value));
        $(".pagination_first").removeClass('btn_disabled');
        $(".pagination_prev").removeClass('btn_disabled');
        if (parseInt(value) === noOfPages) {
          $(".pagination_last").addClass('btn_disabled');
          $(".pagination_next").addClass('btn_disabled');
        }
      }
    });

    $(".pagination_prev").click(function() {

      var value = this.id;
      if (value != 1) {
        var startPoint = index * (value - 2);
        var endPoint = index * (value - 1);
        $('#rdy-table-body').children().css('display', 'none');
        $('#rdy-table-body').children().slice(startPoint, endPoint).css('display', 'table-row');
        var pageNo = $("#rdy-page-no").text();
        $(".current-page").text(parseInt(pageNo) - 1);
        $(this).attr("id", parseInt(value) - 1);
        $(".pagination_next").attr("id", parseInt(value));
        $(".pagination_last").removeClass('btn_disabled');
        $(".pagination_next").removeClass('btn_disabled');
        if (parseInt(value) - 1 === 1) {
          $(".pagination_prev").addClass('btn_disabled');
          $(".pagination_first").addClass('btn_disabled');
        }
      } else {
        $(".pagination_prev").addClass('btn_disabled');
        $(".pagination_first").addClass('btn_disabled');
      }
    });

    $(".pagination_first").click(function() {

      $('#rdy-table-body').children().css('display', 'none');
      $('#rdy-table-body').children().slice(0, index).css('display', 'table-row');
      $(".current-page").text(1);
      $(".pagination_prev").attr("id", 1);
      $(".pagination_next").attr("id", 2);
      $(".pagination_first").addClass('btn_disabled');
      $(".pagination_last").removeClass('btn_disabled');
      $(".pagination_next").removeClass('btn_disabled');
      $(".pagination_prev").addClass('btn_disabled');

    });


    $(".pagination_last").click(function() {

      var startPoint = (noOfPages * index) - index;
      var endPoint = noOfPages * index;

      $('#rdy-table-body').children().css('display', 'none');
      $('#rdy-table-body').children().slice(startPoint, endPoint).css('display', 'table-row');
      $(".current-page").text(noOfPages);
      $(".pagination_prev").attr("id", noOfPages);
      $(".pagination_next").attr("id", noOfPages + 1);
      $(".pagination_last").addClass('btn_disabled');
      $(".pagination_first").removeClass('btn_disabled');
      $(".pagination_prev").removeClass('btn_disabled');
      $(".pagination_next").addClass('btn_disabled');

    });
  } else {
    $('#rdy-table-body').children().css('display', 'table-row');
  }

};

//Code for Pagination of File Upload report
function uploadPagination(id, totalRec) {
  $('.pagination-arrows').empty();
  var index = id;
  var noOfRecords = totalRec;
  var noOfPages = Math.floor(noOfRecords / index);
  if (noOfRecords % index != 0) {
    noOfPages = noOfPages + 1;
  }

  if (noOfPages > 1) {
    // pagination arrows
    $(".pagination-arrows").html('<span id="first_page_arrow"><img class="pagination_btn btn_disabled pagination_first" src="/img/pagination/2-arw.png"></img></span>' +
      '<span class="pagination_arrows pagination_right"><img class="pagination_btn btn_disabled pagination_prev" id="1" src="/img/pagination/4-arw.png"></img></span>' +
      '<span class="current-page pagination_arrows" id="upload-page-no">1</span><span class="pagination_arrows pagination_right"><img class="pagination_btn pagination_next" id="2" src="/img/pagination/3--arw.png"></img></span>' +
      '<span class="pagination_arrows"><img class="pagination_btn pagination_last" src="/img/pagination/1-arw.png"></img></span>');

    $('#upload-body').children().css('display', 'none');
    $('#upload-body').children().slice(0, index).css('display', 'table-row');


    // display per page
    $(".pagination_next").click(function() {

      var value = this.id;
      if (value <= noOfPages) {
        var startPoint = index * (value - 1);
        var endPoint = index * value;
        $('#upload-body').children().css('display', 'none');
        $('#upload-body').children().slice(startPoint, endPoint).css('display', 'table-row');
        var pageNo = $("#upload-page-no").text();
        $(".current-page").text(parseInt(pageNo) + 1);
        $(this).attr("id", parseInt(value) + 1);
        $(".pagination_prev").attr("id", parseInt(value));
        $(".pagination_first").removeClass('btn_disabled');
        $(".pagination_prev").removeClass('btn_disabled');
        if (parseInt(value) === noOfPages) {
          $(".pagination_last").addClass('btn_disabled');
          $(".pagination_next").addClass('btn_disabled');
        }

      }
    });

    $(".pagination_prev").click(function() {

      var value = this.id;
      if (value != 1) {
        var startPoint = index * (value - 2);
        var endPoint = index * (value - 1);
        $('#upload-body').children().css('display', 'none');
        $('#upload-body').children().slice(startPoint, endPoint).css('display', 'table-row');
        var pageNo = $("#upload-page-no").text();
        $(".current-page").text(parseInt(pageNo) - 1);
        $(this).attr("id", parseInt(value) - 1);
        $(".pagination_next").attr("id", parseInt(value));
        $(".pagination_last").removeClass('btn_disabled');
        $(".pagination_next").removeClass('btn_disabled');
        if (parseInt(value) - 1 === 1) {
          $(".pagination_prev").addClass('btn_disabled');
          $(".pagination_first").addClass('btn_disabled');
        }
      } else {
        $(".pagination_prev").addClass('btn_disabled');
        $(".pagination_first").addClass('btn_disabled');
      }
    });

    $(".pagination_first").click(function() {

      $('#upload-body').children().css('display', 'none');
      $('#upload-body').children().slice(0, index).css('display', 'table-row');
      $(".current-page").text(1);
      $(".pagination_prev").attr("id", 1);
      $(".pagination_next").attr("id", 2);
      $(".pagination_first").addClass('btn_disabled');
      $(".pagination_last").removeClass('btn_disabled');
      $(".pagination_next").removeClass('btn_disabled');
      $(".pagination_prev").addClass('btn_disabled');

    });


    $(".pagination_last").click(function() {

      var startPoint = (noOfPages * index) - index;
      var endPoint = noOfPages * index;

      $('#upload-body').children().css('display', 'none');
      $('#upload-body').children().slice(startPoint, endPoint).css('display', 'table-row');
      $(".current-page").text(noOfPages);
      $(".pagination_prev").attr("id", noOfPages);
      $(".pagination_next").attr("id", noOfPages + 1);
      $(".pagination_last").addClass('btn_disabled');
      $(".pagination_first").removeClass('btn_disabled');
      $(".pagination_prev").removeClass('btn_disabled');
      $(".pagination_next").addClass('btn_disabled');

    });
  } else {
    $('#upload-body').children().css('display', 'table-row');
  }

};

//Below code is used for displaying the Dropdown for records filtering
function showDropdown(arg) {
  var drpdwn = (localStorage.searchDropdown).split(",");
  var len = drpdwn.length;
  if (arg <= 5) {
    var ele = '<option value="' + arg + '">' + arg + '</option>';
    $('.optionselector').html(ele);
  } else if (arg > 5) {
    var ele = '';
    for (i = 0; i < (len + 1); i++) {
      if (i !== len) {
        ele += '<option value="' + drpdwn[i] + '">' + drpdwn[i] + '</option>';
      } else {
        ele += '<option value="' + arg + '" data-i18n=translation.label_all></option>'
      }
    }

    $('.optionselector').html(ele);
  }
  translationi18();
};

//Below code is used for displaying the Dropdown for records filtering in Sim Inventory page
function showUploadDropdown(arg) {

  if (arg <= 10) {
    var ele = '<option value="' + arg + '">' + arg + '</option>';
    $('#optionselector_upload').html(ele);
  } else if (arg > 10) {
    var ele = '<option value="10">10</option><option value="20">20</option>' +
      '<option value="50">50</option><option value="' + arg + '" data-i18n=translation.label_all></option>';
    $('#optionselector_upload').html(ele);
  }
  translationi18();
};

function showRecords(rec) {
  var drpValue = rec.value;
  pagination(drpValue, localStorage.totalRow);
};
//Code Dropdown ends
function showRecordsAvl(rec) {
  var drpValue = rec.value;
  paginationAvl(drpValue, localStorage.totalRow);
};

function showRecordsStatus(rec) {
  var drpValue = rec.value;
  paginationStatus(drpValue, localStorage.totalRow);
};

function showRecordsReady(rec) {
  var drpValue = rec.value;
  paginationReady(drpValue, localStorage.totalRow);
};

function showUploadRecords(rec) {
  var drpValue = rec.value;
  uploadPagination(drpValue, localStorage.totalRow);
};
