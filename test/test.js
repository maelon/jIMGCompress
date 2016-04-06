window.onload = function() {
    var d_input = document.getElementById('file_input');
    var d_source_link = document.getElementById('image_source_link');
    var d_link = document.getElementById('image_link');
    var d_option_width = document.getElementById('option_width');
    var d_option_height = document.getElementById('option_height');
    var d_option_quality = document.getElementById('option_quality');
    var d_option_size = document.getElementById('option_size');
    var d_start = document.getElementById('start');
    var d_clear = document.getElementById('clear');
    var d_image_path = document.getElementById('image_path');
    var d_name = document.getElementById('image_name');
    var d_source_type = document.getElementById('image_source_type');
    var d_source_width = document.getElementById('image_source_width');
    var d_source_height = document.getElementById('image_source_height');
    var d_source_size = document.getElementById('image_source_size');
    var d_type = document.getElementById('image_type');
    var d_width = document.getElementById('image_width');
    var d_height = document.getElementById('image_height');
    var d_size = document.getElementById('image_size');

    var file;
    var input_change = function (e) {
        if(e.target.files.length > 0) {
            file = e.target.files[0];
            console.log(file);
            d_image_path.innerText = d_input.value;
            d_start.disabled = false;
            d_clear.disabled = false;
        } else {
            d_image_path.innerText = '请上传图片';
            d_start.disabled = true;
            d_clear.disabled = true;
        }
    };
    d_input.addEventListener('change', input_change);

    d_start.addEventListener('click', function () {
        var option = {};
        if(d_option_width.value) {
            option['width'] = parseInt(d_option_width.value) || 'auto';
        }
        if(d_option_height.value) {
            option['height'] = parseInt(d_option_height.value) || 'auto';
        }
        if(d_option_quality.value) {
            var qua = parseFloat(d_option_quality.value);
            if(qua <= 1 && qua > 0)
            option['quality'] = qua;
        }
        if(d_option_size.value) {
            option['limitSize'] = parseInt(d_option_size.value) || 1024;
        }
        d_image_path.innerText = '开始压缩';
        window.jIMGCompress.compress(file, option, function (result) {
            console.log(result);
            d_image_path.innerText = '压缩结束';
            d_name.innerText = result.fileName;
            d_source_type.innerText = result.fileType;
            d_source_width.innerText = result.originWidth;
            d_source_height.innerText = result.originHeight;
            d_source_size.innerText = result.originFileSize;
            d_type.innerText = 'image/jpeg';
            d_width.innerText = result.width;
            d_height.innerText = result.height;
            d_size.innerText = result.fileSize;
            d_source_link.href = result.originDataURL;
            d_link.href = result.dataURL;

            var d_preview = document.getElementById('image_preview');
            d_preview.src = result.dataURL;
            var d_source_preview = document.getElementById('image_source_preview');
            d_source_preview.src = result.originDataURL;
        }, function (error) {
            d_image_path.innerText = '压缩出错';
            //console.log(error);
            alert(JSON.stringify(error));
        });
    });

    d_clear.addEventListener('click', function () {
        d_input.outerHTML = d_input.outerHTML;
        d_image_path.innerText = '请上传图片';
        d_start.disabled = true;
        d_clear.disabled = true;
        setTimeout(function () {
            d_input = document.getElementById('file_input');
            d_input.addEventListener('change', input_change);
        }, 0);
    });
};
