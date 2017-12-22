# jIMGCompress

    > html5图片压缩工具
    > 默认支持把`image/jpeg``image/png``image/gif``image/bmp`图片全部转为image/jpeg类型
    > 本工具提供普通压缩功能的同时，也是踩到坑时解决方案（在图片上传时部分android手机无法直接获取文件类型）

## 安装方法
    
    ```
    npm install jimgcompress
    ```

    或者在html中直接引用`dist`目录下的`jIMGCompress.min.js`文件

    当然如果不够用，可以修改源码，代码里面有对应的注释

## test demo

    ```
    npm install
    npm run dev
    ```
    浏览器打开[http://localhost:8000/test/test.html](http://localhost:8000/test/test.html)
    在移动端可进行代理

## api

### jIMGCompress.compress(file, option, callback, errorback)

    压缩图片

    `file` File类型
     文件对象，input中的file

    `option` Object类型
     {
         width: 最大压缩宽度 默认600
         height: 最大压缩高度 默认自适应(不设置或者为'auto')
         quality: 压缩质量 默认0.9
         limitSize: 最大图片容量(字节) 默认无限制(最小值为1024)
     }

    `callback` Function类型
     压缩完回调，回调结果：{
         fileName: 文件名
         fileSize: 压缩后文件容量(字节)
         fileType: 原始文件类型
         width: 压缩后文件宽度
         height: 压缩后文件高度
         originFileSize: 原始图片容量(字节)
         originWidth: 原始图片宽度
         originHeight: 原始图片高度
         blob: 压缩后文件blob对象，可以放在formdata提交
         dataURL: 压缩后文件data URL
         originDataURL: 原始文件data URL
     }

     `errorback` Function类型
      压缩出错回调，回调结果：{
          type: String,
          msg: String
      }
      type: 
         'emptyfile' 输入文件内容为空
         'notfile' 输入的不是File类型对象
         'nofile' 未输入文件
         'badfiletype' 无法解析出文件类型
         'apierror' 某个html5 api不支持

### jIMGCompress.addFileHeaderEnum(feature, type, ext)

    添加文件类型.内置'image/jpeg''image/png''image/gif''image/bmp',如果不够，可以使用此接口动态添加

    `feature` String类型
     文件头信息16进制的字符描述，例如'ffd8ffe*********'表示image/jpeg文件头

    `type` String类型
     文件类型，例如'image/jpeg'

    `ext` String类型
     文件后缀，例如'jpg'
