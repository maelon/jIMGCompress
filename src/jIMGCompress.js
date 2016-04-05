/*===================================================================
#    FileName: jIMGCompress.js
#      Author: Maelon.J

((scope = {}) => {

    /**
    * public
    * file: 传入input的file对象
    * option: {
    *   width: 最大压缩宽度 默认600
    *   height: 最大压缩高度 默认自适应
    *   quality: 压缩质量 默认0.9
    *   limitSize: 最大图片容量(字节) 默认无限制
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
                    this._option = option;
                    let finishCall = () {
                    };
                    let errorCall = () {
                    };
                    if(file.type !== '') {
                        this._compress(file, finishCall, errorCall);
                    } else {
                        this._checkFileType(file, (type) => {
                            this._typeType = type;
                            this._fileName = file.filename + this._fileExtEnum[type];
                            let blob = new Blob([file], { type: type });
                            this._compress(blob, finishCall, errorCall);
                        }, (error) => {
                            this._throwError(error, errorback);
                        });
                    }
                } else {
                    let error ={
                        type: 'emptyfile',
                        msg: 'file error: file content is empty'
                    };
                    this._throwError(error, errorback);
                }
            } else {
                let error ={
                    type: 'notfile',
                    msg: 'argument type error: not a File type'
                };
                this._throwError(error, errorback);
            }
        } else {
            let error = {
                type: 'nofile',
                msg: 'argument error: file is null'
            };
            this._throwError(error, errorback);
        }
    };

    /**
    * public
    * 添加头信息描述
    */
    scope.addFileHeaderEnum = () => {
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
    scope._dataurl = ''; //压缩后文件data URL 

    /**
    * 文件类型枚举
    */
    scope._fileTypeEnum = {
        'ffd8ffe*********': 'image/jpeg',
        '89504e470d0a1a0a': 'image/png',
        '474946**********': 'image/gif',
        '424d************': 'image/bmp'
    };

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
                        bts.push((val = '0' + data.getUint8(i).toString(16)) => val.substring(val.length - 2));
                    }
                    let typeFeature = bts.join();
                    let type = '';
                    for(let s in this._fileTypeEnum) {
                        let regexp = new RegExp('^' + s.replace((/\*/gi), '\\w') + '$', 'ig');
                        if(regexp.test(typeFeature)) {
                            type = this._fileTypeEnum[s];
                            break;
                        }
                    }
                    //callback(new Blob([e.target.result], {type: 'image/jpeg'}));
                    if(type) {
                        callback(type);
                    } else {
                        let error ={
                            type: 'badfiletype',
                            msg: 'file type error: cannot analysis file type'
                        };
                        this._throwError(error, errorback);
                    }
                } catch (e) {
                    let error = {
                        type: 'apierror',
                        msg: 'api error: not support DataView api'
                    };
                    this._throwError(error, errorback);
                }
            });
            fr.readAsArrayBuffer(file);
        } catch (e) {
            let error = {
                type: 'apierror',
                msg: 'api error: not support FileReader api'
            };
            this._throwError(error, errorback);
        }
    };

    /**
    * private
    * 使用canvas压缩出jpg
    */
    scope._compress = (blob, callback, errorback) => {
        try {
            this._originFileSize = blob.size;
            let image = document.createElement('img');
            let url = URL.createObjectURL(blob);
            image.addEventListener('load', (e) => {
                URL.revokeObjectURL(url);
                let img = e.target;
                this._originWidth = img.naturalWidth;
                this._originHeight = img.naturalHeight;
                let canvas = document.createElement('canvas');
                //
                canvas.width = 300;
                canvas.height = 300 * im.naturalHeight / im.naturalWidth;
                //
                let context = canvas.getContext('2d');
                context.fillStyle = "#fff";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                let dataurl = canvas.toDataURL('image/jpeg', this._option['quality']);
                let compressSize = dataURLtoBlob(dataurl).size;
            });
            image.src = url;
        } catch(e) {
            let error = {
                type: 'apierror',
                msg: 'api error: not support canvas or URL api'
            };
            this._throwError(error, errorback);
        }
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
            this._throwError(error, errorback);
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

})(window.jIMGCompress);
