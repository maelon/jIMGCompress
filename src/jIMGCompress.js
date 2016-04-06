/*===================================================================
#    FileName: jIMGCompress.js
#      Author: Maelon.J
#       Email: maelon.j@gmail.com
#  CreateTime: 2016-04-06 10:22
# Description: 图片压缩工具
===================================================================*/

((scope) => {

    /**
    * public
    * file: 传入input的file对象
    * option: {
    *   width: 最大压缩宽度 默认600
    *   height: 最大压缩高度 默认自适应(不设置或者为'auto')
    *   quality: 压缩质量 默认0.9
    *   limitSize: 最大图片容量(字节) 默认无限制(最小值为1024)
    * }
    * callback: 压缩完成回调
    * errorback: 发生错误回调
    *
    * callback回调结果: {
    *   fileName: 文件名
    *   fileSize: 压缩后文件容量(字节)
    *   fileType: 原始文件类型
    *   width: 压缩后文件宽度
    *   height: 压缩后文件高度
    *   originFileSize: 原始图片容量(字节)
    *   originWidth: 原始图片宽度
    *   originHeight: 原始图片高度
    *   blob: 压缩后文件blob对象，可以放在formdata提交
    *   dataURL: 压缩后文件data URL
    *   originDataURL: 原始文件data URL
    * }
    *
    * !!!!!注意!!!!!
    * 文件最后全部转为image/jpeg格式
    */
    scope.compress = (file, option, callback, errorback) => {
        if(file) {
            if(file instanceof File) {
                if(file.size) {
                    scope._option = option;
                    if(scope._option['quality'] > 1 || scope._option['quality'] < 0) {
                        scope._option['quality'] = 0.9;
                    }
                    if(scope._option['limitSize'] < 1024) {
                        scope._option['limitSize'] = 1024;
                    }
                    let finishCall = () => {
                        let fr = new FileReader();
                        fr.addEventListener('load', (e) => {
                            scope._originDataURL = e.target.result;
                            callback({
                                fileName: scope._fileName,
                                fileType: scope._fileType,
                                fileSize: scope._fileSize,
                                width: scope._width,
                                height: scope._height,
                                originFileSize: scope._originFileSize,
                                originWidth: scope._originWidth,
                                originHeight: scope._originHeight,
                                blob: scope._blob,
                                dataURL: scope._dataURL,
                                originDataURL: scope._originDataURL
                            });
                        });
                        fr.readAsDataURL(file);
                    };
                    scope._checkFileType(file, (type, name) => {
                        scope._fileType = type;
                        scope._fileName = name;
                        scope._originFileSize = file.size;
                        let blob = new Blob([file], { type: type });
                        scope._compress(blob, finishCall, errorback);
                    }, (error) => {
                        scope._throwError(error, errorback);
                    });
                } else {
                    let error ={
                        type: 'emptyfile',
                        msg: 'file error: file content is empty'
                    };
                    scope._throwError(error, errorback);
                }
            } else {
                let error ={
                    type: 'notfile',
                    msg: 'argument type error: not a File type'
                };
                scope._throwError(error, errorback);
            }
        } else {
            let error = {
                type: 'nofile',
                msg: 'argument error: file is null'
            };
            scope._throwError(error, errorback);
        }
    };

    /**
     * public
     * 添加头信息描述
     * feature 16进制头信息，可用*
     * type   类型
     * ext    后缀名
     */
    scope.addFileHeaderEnum = (feature, type, ext) => {
        if(typeof feature === 'string' && typeof type === 'string' && /image\/\w+/.test(type) && typeof ext === 'string') {
            scope._fileTypeEnum[feature] = type;
            scope._fileExtEnum[type] = ext;
        }
    };

    scope._option = {
        'width': 600,
        'quality': 0.9
    };
    scope._fileName = ''; //文件名
    scope._fileType = ''; //文件类型
    scope._fileSize = 0; //压缩后文件容量(字节)
    scope._width = 0; //压缩后文件宽度
    scope._height = 0; //压缩后文件高度
    scope._originFileSize = 0; //原始图片容量(字节)
    scope._originWidth = 0; //原始图片宽度
    scope._originHeight = 0; //原始图片高度
    scope._blob = null; //压缩后文件blob对象，可以放在formdata提交
    scope._dataURL = ''; //压缩后文件data URL 
    scope._originDataURL = ''; //原始文件data URL 

    /**
     * 文件类型枚举
     */
    scope._fileTypeEnum = {
        'ffd8ffe*********': 'image/jpeg',
        '89504e470d0a1a0a': 'image/png',
        '474946**********': 'image/gif',
        '424d************': 'image/bmp'
    };

    /**
    * 文件后缀名枚举
    */
    scope._fileExtEnum = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/bmp': 'bmp'
    };

    /**
     * private
     * 检测文件类型
     */
    scope._checkFileType = (file, callback, errorback) => {
        if(file.type !== '') {
            callback(file.type, file.name);
        } else {
            try {
                let fr = new FileReader();
                fr.addEventListener('load', function (e) {
                    let buffer = e.target.result;

                    //文件头信息判断文件类型，如果直接获取不到文件类型
                    try {
                        var data = new DataView(buffer, 0);
                        var bts = [];
                        //获取文件前8个字节，转成16进制字符串，并与fileTypeEnum匹配
                        for(let i = 0; i < 8; i++) {
                            bts.push(((val = '0' + data.getUint8(i).toString(16)) => val.substring(val.length - 2))());
                        }
                        let typeFeature = bts.join('');
                        let type = '';
                        for(let s in scope._fileTypeEnum) {
                            let regexp = new RegExp('^' + s.replace((/\*/gi), '\\w') + '$', 'ig');
                            if(regexp.test(typeFeature)) {
                                type = scope._fileTypeEnum[s];
                                break;
                            }
                        }
                        if(type) {
                            callback(type, file.name + '.' + scope._fileExtEnum[type]);
                        } else {
                            let error ={
                                type: 'badfiletype',
                                msg: 'file type error: cannot analysis file type'
                            };
                            scope._throwError(error, errorback);
                        }
                    } catch (e) {
                        let error = {
                            type: 'apierror',
                            msg: 'api error: not support DataView api'
                        };
                        scope._throwError(error, errorback);
                    }
                });
                fr.readAsArrayBuffer(file);
            } catch (e) {
                let error = {
                    type: 'apierror',
                    msg: 'api error: not support FileReader api'
                };
                scope._throwError(error, errorback);
            }
        }
    };

    /**
     * private
     * 使用canvas压缩出jpg
     */
    scope._compress = (blob, callback, errorback) => {
        try {
            scope._originFileSize = blob.size;
            let image = document.createElement('img');
            let url = URL.createObjectURL(blob);
            image.addEventListener('load', (e) => {
                URL.revokeObjectURL(url);
                let img = e.target;
                scope._originWidth = img.naturalWidth;
                scope._originHeight = img.naturalHeight;
                let width;
                let height;
                let oWidth = scope._option['width'];
                let oHeight = scope._option['height'];
                if(oWidth !== undefined && oWidth !== 'auto' && (oHeight === undefined || oHeight === 'auto')) {
                    //如果只设置了宽度
                    width = parseInt(oWidth);
                    (scope._originWidth < width) && (width = scope._originWidth);
                    height = Math.floor(width * scope._originHeight / scope._originWidth);
                } else if(oHeight === undefined && oHeight !== 'auto' && (oWidth === undefined || oWidth === 'auto')) {
                    //如果只设置了高度
                    height = parseInt(oHeight);
                    (scope._originHeight < height) && (height = scope._originHeight);
                    width = Math.floor(height * scope._originWidth / scope._originHeight);
                } else if(oWidth !== undefined && oWidth !== 'auto' && oHeight !== undefined && oHeight !== 'auto') {
                    //如果设置了宽度、高度
                    width = parseInt(oWidth);
                    height = parseInt(oHeight);
                    if(width * scope._originHeight / scope._originWidth > height) {
                        width = Math.floor(height * scope._originWidth / scope._originHeight);
                        if(width > scope._originWidth) {
                            width = scope._originWidth;
                            height = scope._originHeight;
                        }
                    } else {
                        height = Math.floor(width * scope._originHeight / scope._originWidth);
                        if(height > scope._originHeight) {
                            width = scope._originWidth;
                            height = scope._originHeight;
                        }
                    }
                } else {
                    width = scope._originWidth;
                    height = scope._originHeight;
                }
                let dataurl = scope._compressByCanvas(img, width, height, scope._option['quality']);
                let blob = scope._dataURL2Blob(dataurl);
                while(blob.size > scope._option['limitSize']) {
                    width = Math.floor(0.8 * width);
                    height = Math.floor(0.8 * height);
                    dataurl = scope._compressByCanvas(img, width, height, scope._option['quality']);
                    blob = scope._dataURL2Blob(dataurl);
                }
                //压缩完成
                scope._fileSize = blob.size;
                scope._width = width;
                scope._height = height;
                scope._blob = blob;
                scope._dataURL = dataurl;
                callback('finish');
            });
            image.src = url;
        } catch(e) {
            let error = {
                type: 'apierror',
                msg: 'api error: not support canvas or URL api'
            };
            scope._throwError(error, errorback);
        }
    };

    /**
     * private
     * 使用canvas进行压缩
     */
    scope._compressByCanvas = (img, width, height, quality) => {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext('2d');
        context.fillStyle = '#FFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        let dataurl = canvas.toDataURL('image/jpeg', quality);
        return dataurl;
    };

    /**
     * private
     * 转data url为blob
     */
    scope._dataURL2Blob = (dataurl) => {
        try {
            let arr = dataurl.split(',');
            let mime = arr[0].match(/:(.*?);/)[1];
            let bstr = atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        } catch(e) {
            let error = {
                type: 'apierror',
                msg: 'api error: not support atob or Unit8Array api'
            };
            scope._throwError(error, errorback);
        }
    };

    /**
     * private
     * 抛出异常，或异常回调
     */
    scope._throwError = (error = {}, errorback) => {
        if(errorback && typeof errorback === 'function') {
            errorback(error);
        } else {
            throw new Error(error['msg']);
        }
    };

})(window.jIMGCompress || (window.jIMGCompress = {}));
