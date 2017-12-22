/*===================================================================
#    FileName: jIMGCompress.js
#      Author: Maelon.J
#       Email: maelon.j@gmail.com
#  CreateTime: 2016-04-06 10:22
# Description: 图片压缩工具
===================================================================*/

class IMGCompress {

    constructor() {
        this._option = {
            'width': 600,
            'quality': 0.9
        };
        this._fileName = ''; //文件名
        this._fileType = ''; //文件类型
        this._fileSize = 0; //压缩后文件容量(字节)
        this._width = 0; //压缩后文件宽度
        this._height = 0; //压缩后文件高度
        this._originFileSize = 0; //原始图片容量(字节)
        this._originWidth = 0; //原始图片宽度
        this._originHeight = 0; //原始图片高度
        this._blob = null; //压缩后文件blob对象，可以放在formdata提交
        this._dataURL = ''; //压缩后文件data URL 
        this._originDataURL = ''; //原始文件data URL 

        /**
         * 文件类型枚举
         */
        this._fileTypeEnum = {
            'ffd8ffe*********': 'image/jpeg',
            '89504e470d0a1a0a': 'image/png',
            '474946**********': 'image/gif',
            '424d************': 'image/bmp'
        };

        /**
        * 文件后缀名枚举
        */
        this._fileExtEnum = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/bmp': 'bmp'
        };
    }

    /**
    * @public
    * @param {File} file - 传入input的file对象
    * @param {Object} option - 压缩配置
    * @param {number} option.width - 最大压缩宽度 默认600
    * @param {number} option.height - 最大压缩高度 默认自适应(不设置或者为'auto')
    * @param {number} option.quality - 压缩质量 默认0.9(0~1)
    * @param {number} option.limitSize - 最大图片容量(字节) 默认无限制(最小值为1024)
    * @param {Function} callback - 压缩完成回调
    * @param {Function} errorback - 发生错误回调
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
    compress(file, option, callback, errorback) {
        if(file) {
            if(file instanceof File) {
                if(file.size) {
                    Object.assign(this._option, option);
                    if(this._option['quality'] > 1 || this._option['quality'] < 0) {
                        this._option['quality'] = 0.9;
                    }
                    if(this._option['limitSize'] < 1024) {
                        this._option['limitSize'] = 1024;
                    }
                    const finishCall = () => {
                        const fr = new FileReader();
                        fr.addEventListener('load', e => {
                            this._originDataURL = e.target.result;
                            callback({
                                fileName: this._fileName,
                                fileType: this._fileType,
                                fileSize: this._fileSize,
                                width: this._width,
                                height: this._height,
                                originFileSize: this._originFileSize,
                                originWidth: this._originWidth,
                                originHeight: this._originHeight,
                                blob: this._blob,
                                dataURL: this._dataURL,
                                originDataURL: this._originDataURL
                            });
                        });
                        fr.readAsDataURL(file);
                    };
                    this._checkFileType(file, (type, name) => {
                        this._fileType = type;
                        this._fileName = name;
                        this._originFileSize = file.size;
                        const blob = new Blob([file], { type });
                        this._compress(blob, finishCall, errorback);
                    }, error => {
                        this._throwError(error, errorback);
                    });
                } else {
                    const error ={
                        type: 'emptyfile',
                        msg: 'file error: file content is empty'
                    };
                    this._throwError(error, errorback);
                }
            } else {
                const error ={
                    type: 'notfile',
                    msg: 'argument type error: not a File type'
                };
                this._throwError(error, errorback);
            }
        } else {
            const error = {
                type: 'nofile',
                msg: 'argument error: file is null'
            };
            this._throwError(error, errorback);
        }
    }

    /**
     * @public
     * @description 添加头信息描述
     * @param {string} feature - 16进制头信息，可用*
     * @param {string} type - 类型
     * @param {string} ext - 后缀名
     */
    addFileHeaderEnum(feature, type, ext) {
        if(typeof feature === 'string' && typeof type === 'string' && /image\/\w+/.test(type) && typeof ext === 'string') {
            this._fileTypeEnum[feature] = type;
            this._fileExtEnum[type] = ext;
        }
    }

    /**
     * @private
     * @description 检测文件类型
     */
    _checkFileType(file, callback, errorback) {
        if(file.type !== '') {
            callback(file.type, file.name);
        } else {
            try {
                const fr = new FileReader();
                fr.addEventListener('load', e => {
                    const buffer = e.target.result;

                    //文件头信息判断文件类型，如果直接获取不到文件类型
                    try {
                        const data = new DataView(buffer, 0);
                        const bts = [];
                        //获取文件前8个字节，转成16进制字符串，并与fileTypeEnum匹配
                        for(let i = 0; i < 8; i++) {
                            bts.push(((val = '0' + data.getUint8(i).toString(16)) => val.substring(val.length - 2))());
                        }
                        const typeFeature = bts.join('');
                        let type = '';
                        for(let s in this._fileTypeEnum) {
                            const regexp = new RegExp('^' + s.replace((/\*/gi), '\\w') + '$', 'ig');
                            if(regexp.test(typeFeature)) {
                                type = this._fileTypeEnum[s];
                                break;
                            }
                        }
                        if(type) {
                            callback(type, file.name + '.' + this._fileExtEnum[type]);
                        } else {
                            const error ={
                                type: 'badfiletype',
                                msg: 'file type error: cannot analysis file type'
                            };
                            this._throwError(error, errorback);
                        }
                    } catch (e) {
                        const error = {
                            type: 'apierror',
                            msg: 'api error: not support DataView api'
                        };
                        this._throwError(error, errorback);
                    }
                });
                fr.readAsArrayBuffer(file);
            } catch (e) {
                const error = {
                    type: 'apierror',
                    msg: 'api error: not support FileReader api'
                };
                this._throwError(error, errorback);
            }
        }
    }

    /**
     * @private
     * @description 使用canvas压缩出jpg
     */
    _compress(blob, callback, errorback) {
        try {
            this._originFileSize = blob.size;
            const image = document.createElement('img');
            const url = URL.createObjectURL(blob);
            image.addEventListener('load', e => {
                URL.revokeObjectURL(url);
                const img = e.target;
                this._originWidth = img.naturalWidth;
                this._originHeight = img.naturalHeight;
                let width;
                let height;
                const oWidth = this._option['width'];
                const oHeight = this._option['height'];
                if(oWidth !== undefined && oWidth !== 'auto' && (oHeight === undefined || oHeight === 'auto')) {
                    //如果只设置了宽度
                    width = parseInt(oWidth);
                    (this._originWidth < width) && (width = this._originWidth);
                    height = Math.floor(width * this._originHeight / this._originWidth);
                } else if(oHeight === undefined && oHeight !== 'auto' && (oWidth === undefined || oWidth === 'auto')) {
                    //如果只设置了高度
                    height = parseInt(oHeight);
                    (this._originHeight < height) && (height = this._originHeight);
                    width = Math.floor(height * this._originWidth / this._originHeight);
                } else if(oWidth !== undefined && oWidth !== 'auto' && oHeight !== undefined && oHeight !== 'auto') {
                    //如果设置了宽度、高度
                    width = parseInt(oWidth);
                    height = parseInt(oHeight);
                    if(width * this._originHeight / this._originWidth > height) {
                        width = Math.floor(height * this._originWidth / this._originHeight);
                        if(width > this._originWidth) {
                            width = this._originWidth;
                            height = this._originHeight;
                        }
                    } else {
                        height = Math.floor(width * this._originHeight / this._originWidth);
                        if(height > this._originHeight) {
                            width = this._originWidth;
                            height = this._originHeight;
                        }
                    }
                } else {
                    width = this._originWidth;
                    height = this._originHeight;
                }
                let dataurl = this._compressByCanvas(img, width, height, this._option['quality']);
                let blob = this._dataURL2Blob(dataurl);
                while(blob.size > this._option['limitSize']) {
                    width = Math.floor(0.8 * width);
                    height = Math.floor(0.8 * height);
                    dataurl = this._compressByCanvas(img, width, height, this._option['quality']);
                    blob = this._dataURL2Blob(dataurl);
                }
                //压缩完成
                this._fileSize = blob.size;
                this._width = width;
                this._height = height;
                this._blob = blob;
                this._dataURL = dataurl;
                callback('finish');
            });
            image.src = url;
        } catch(e) {
            const error = {
                type: 'apierror',
                msg: 'api error: not support canvas or URL api'
            };
            this._throwError(error, errorback);
        }
    }

    /**
     * @private
     * @description使用canvas进行压缩
     */
    _compressByCanvas(img, width, height, quality) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.fillStyle = '#FFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataurl = canvas.toDataURL('image/jpeg', quality);
        return dataurl;
    }

    /**
     * @private
     * @description 转data url为blob
     */
    _dataURL2Blob(dataurl)  {
        try {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        } catch(e) {
            const error = {
                type: 'apierror',
                msg: 'api error: not support atob or Unit8Array api'
            };
            this._throwError(error, errorback);
        }
    }

    /**
     * @private
     * @description 抛出异常，或异常回调
     */
    _throwError(error = {}, errorback) {
        if(errorback && typeof errorback === 'function') {
            errorback(error);
        } else {
            throw new Error(error['msg']);
        }
    }
}

export default new IMGCompress();
