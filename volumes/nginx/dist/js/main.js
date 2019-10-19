var decoder = $('#qr-canvas'),
    pr = $('.glyphicon-print'),
    sl = $('.scanner-laser'),
    p2 = $('#eid-scan'),
    si = $('#scanned-img'),
    sQ = $('#scanned-QR'),
    sv = $('#save'),
    sv2 = $('#save1'),
    sp = $('#stop_eid_scan'),
    co = $('#contrast'),
    cov = $('#contrast-value'),
    zo = $('#zoom'),
    zov = $('#zoom-value'),
    br = $('#brightness'),
    brv = $('#brightness-value'),
    tr = $('#threshold'),
    trv = $('#threshold-value'),
    sh = $('#sharpness'),
    shv = $('#sharpness-value'),
    gr = $('#grayscale'),
    grv = $('#grayscale-value');
pr.parent().click(function() {
    printDiv('.img-thumbnail');
});
sl.css('opacity', .5);

sp.click(function(event) {
	        $('#stop_eid_scan').css('display', 'none');
			$('#stop_imei_scan').css('display', 'none');
			$('#stop_imei_scan1').css('display', 'none');
			$('#qr-canvas').css('display', 'none');				
});

p2.click(function() {
    $('#qr-canvas').toggle();
    if ($('#qr-canvas').css('display', 'block')) {
        $('#interactive').css('display', 'none');
		$('#stop_imei_scan').css('display', 'none');
		$('#stop_imei_scan1').css('display', 'none');
		$('#stop_eid_scan').css('display', 'block');
        decoder.data().plugin_WebCodeCam = undefined;
        if (typeof decoder.data().plugin_WebCodeCam === 'undefined') {
            decoder.WebCodeCam({
                videoSource: {
                    id: $('select#cameraId').val(),
                    width: 350,
                    height: 350,
                    maxWidth: 640,
                    maxHeight: 480
                },
                autoBrightnessValue: 100,
                resultFunction: function(text, imgSrc) {
                    si.attr('src', imgSrc);
                    $('#tx_eid').val(text);
                    sessionStorage.setItem('eid', eid);
                    $('#qr-canvas').css('display', 'none');
					$('#stop_eid_scan').css('display', 'none');
                    dropDown();
                    validateEid();

                    sl.fadeOut(150, function() {
                        sl.fadeIn(150);
                    });
                }
            })
        }
    }
})

function getBase64Image(img) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL('image/png');
    return dataURL;
}

function changeZoom(a) {
    if (typeof decoder.data().plugin_WebCodeCam === 'undefined') return;
    var value = typeof a != 'undefined' ? parseFloat(a.toPrecision(2)) : zo.val() / 10;
    zov.text(zov.text().split(':')[0] + ': ' + value.toString());
    decoder.data().plugin_WebCodeCam.options.zoom = parseFloat(value);
    if (typeof a != 'undefined') zo.val(a * 10);
}

var getZomm = setInterval(function() {
    var a;
    try {
        a = decoder.data().plugin_WebCodeCam.optimalZoom();
    } catch (e) {
        a = 0;
    }
    if (a != 0) {
        changeZoom(a);
        clearInterval(getZomm);
    }
}, 500);

function gotSources(sourceInfos) {
    for (var i = 0; i !== sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        var option = document.createElement('option');
        option.value = sourceInfo.id;
        if (sourceInfo.kind === 'video') {
            var face = sourceInfo.facing === '' ? 'unknown' : sourceInfo.facing;
            option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1) + ' (facing: ' + face + ')';
            videoSelect.appendChild(option);
        }
    }
}
if (typeof MediaStreamTrack.getSources !== 'undefined') {
    var videoSelect = document.querySelector('select#cameraId');
    $(videoSelect).change(function(event) {
        if (typeof decoder.data().plugin_WebCodeCam !== 'undefined') {
            decoder.data().plugin_WebCodeCam.options.videoSource.id = $(this).val();
            decoder.data().plugin_WebCodeCam.cameraStop();
            decoder.data().plugin_WebCodeCam.init();
            decoder.data().plugin_WebCodeCam.cameraPlay();
        }
    });
    MediaStreamTrack.getSources(gotSources);
} else {
    document.querySelector('select#cameraId').remove();
}