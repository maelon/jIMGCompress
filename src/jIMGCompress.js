/*===================================================================
#    FileName: jIMGCompress.js
#      Author: Maelon.J
#       Email: maelon.j@gmail.com
#  CreateTime: 2016-04-05 18:21
# Description: 图片压缩
===================================================================*/

((scope = {}) => {

    /**
    * public
    * file: 传入input的file对象
    * option: {
    *   width: 最大压缩宽度
    *   height: 最大压缩高度
    *   limitSize: 最大图片容量(字节)
    * }
    * callback: 压缩完成回调
    * errorback: 发生错误回调
    *
    * callback回调结果: {
    *   fileName: 文件名
    *   fileSize: 压缩后文件容量(字节)
    *   width: 压缩后文件宽度
    *   height: 压缩后文件高度
    *   originFileSize: 原始图片容量(字节)
    *   originWidth: 原始图片宽度
    *   originHeight: 原始图片高度
    *   blob: 压缩后文件blob对象，可以放在formdata提交
    *   dataurl: 压缩后文件data URL
    * }
    *
    * !!!!!注意!!!!!
    * 文件最后全部转为image/jpeg格式
    */
    scope.compess = (file, option, callback, errorback) => {
        if(file) {
            if(file instanceof File) {
                if(file.size) {
                    if(file.type !== '') {
                    } else {
                    }
                } else {
                    throw new Error('file error: file content is empty');
                }
            } else {
                throw new Error('argument type error: not a File type');
            }
        } else {
            throw new Error('argument error: file is null');
        }
    };

    scope._fileName = ''; //文件名
    scope._fileSize = 0; //压缩后文件容量(字节)
    scope._width = 0; //压缩后文件宽度
    scope._height = 0; //压缩后文件高度
    scope._originFileSize = 0; //原始图片容量(字节)
    scope._originWidth = 0; //原始图片宽度
    scope._originHeight = 0; //原始图片高度
    scope._blob = null; //压缩后文件blob对象，可以放在formdata提交
    scope._dataurl = ''; //压缩后文件data URL 

    /**
    * 文件类型枚举
    */
    scope._FileTypeEnum = {
        'ffd8 ffe* **** ****': 'image/jpeg',
        '8950 4e47 0d0a 1a0a': 'image/png',
        '4749 46** **** ****': 'image/gif',
        '424d **** **** ****': 'image/bmp'
    };

    /**
    * private
    * 检测文件类型
    */
    scope._checkFileType = (file, callback) => {
        var fr = new FileReader();
        fr.addEventListener('load', function (e) {
            var result = e.target.result;

            //文件头信息判断文件类型，如果直接获取不到文件类型
            var data = new DataView(e.target.result, 0);
            var d = [];
            d.push(data.getUint8(0));
            d.push(data.getUint8(1));
            d.push(data.getUint8(2));
            d.push(data.getUint8(3));
            d.push(data.getUint8(4));
            alert(d.join(','));
            compressIMG(new Blob([e.target.result], {type: 'image/jpeg'})); //type参数与上面判断类型有关
        });
        fr.readAsArrayBuffer(file);
    };

                function compressIMG(blob) {
                try{
                alert('压缩前大小：' + blob.size/1024 + 'K');
                var img = document.createElement('img');
                var url = URL.createObjectURL(blob);
                img.addEventListener('load', function (e) {
                    var im = e.target;
                    URL.revokeObjectURL(url);
                    var canvas = document.createElement('canvas');
                    alert(im.naturalWidth + '|' + im.naturalHeight);
                    canvas.width = 300;
                    canvas.height = 300 * im.naturalHeight / im.naturalWidth;
                    var context = canvas.getContext('2d');
                    context.fillStyle = "#fff";
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                    var base64 = canvas.toDataURL('image/jpeg', 0.9);
                    alert(base64.substring(0, 60));
                    alert('压缩后大小：' + dataURLtoBlob(base64).size / 1024 + 'K');
                    previewIMG(base64);
                });
                img.src = url;
                }catch(e) {
                    alert(e);
                }
            }

            function previewIMG(base64) {
                var img = document.createElement('img');
                img.addEventListener('load', function (e) {
                    img.style="position:absolute;top:0;";
                    document.body.appendChild(img);
                });
                img.src = base64;
            }

            function dataURLtoBlob(dataurl) {
                var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], {type:mime});
            }

})(window.jIMGCompress);
