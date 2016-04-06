!function(i){function e(r){if(t[r])return t[r].exports;var o=t[r]={exports:{},id:r,loaded:!1};return i[r].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var t={};return e.m=i,e.c=t,e.p="",e(0)}([function(i,e,t){i.exports=t(1)},function(i,e){"use strict";!function(i){i.compress=function(e,t,r,o){if(e)if(e instanceof File)if(e.size)!function(){i._option=t,(i._option.quality>1||i._option.quality<0)&&(i._option.quality=.9),i._option.limitSize<1024&&(i._option.limitSize=1024);var n=function(){var t=new FileReader;t.addEventListener("load",function(e){i._originDataURL=e.target.result,r({fileName:i._fileName,fileType:i._fileType,fileSize:i._fileSize,width:i._width,height:i._height,originFileSize:i._originFileSize,originWidth:i._originWidth,originHeight:i._originHeight,blob:i._blob,dataURL:i._dataURL,originDataURL:i._originDataURL})}),t.readAsDataURL(e)};i._checkFileType(e,function(t,r){i._fileType=t,i._fileName=r,i._originFileSize=e.size;var a=new Blob([e],{type:t});i._compress(a,n,o)},function(e){i._throwError(e,o)})}();else{var n={type:"emptyfile",msg:"file error: file content is empty"};i._throwError(n,o)}else{var a={type:"notfile",msg:"argument type error: not a File type"};i._throwError(a,o)}else{var g={type:"nofile",msg:"argument error: file is null"};i._throwError(g,o)}},i.addFileHeaderEnum=function(e,t,r){"string"==typeof e&&"string"==typeof t&&/image\/\w+/.test(t)&&"string"==typeof r&&(i._fileTypeEnum[e]=t,i._fileExtEnum[t]=r)},i._option={width:600,quality:.9},i._fileName="",i._fileType="",i._fileSize=0,i._width=0,i._height=0,i._originFileSize=0,i._originWidth=0,i._originHeight=0,i._blob=null,i._dataURL="",i._originDataURL="",i._fileTypeEnum={"ffd8ffe*********":"image/jpeg","89504e470d0a1a0a":"image/png","474946**********":"image/gif","424d************":"image/bmp"},i._fileExtEnum={"image/jpeg":"jpg","image/png":"png","image/gif":"gif","image/bmp":"bmp"},i._checkFileType=function(e,t,r){if(""!==e.type)t(e.type,e.name);else try{var o=new FileReader;o.addEventListener("load",function(o){var n=o.target.result;try{for(var a=new DataView(n,0),g=[],l=function(i){g.push(function(){var e=arguments.length<=0||void 0===arguments[0]?"0"+a.getUint8(i).toString(16):arguments[0];return e.substring(e.length-2)}())},p=0;8>p;p++)l(p);var _=g.join(""),h="";for(var f in i._fileTypeEnum){var s=new RegExp("^"+f.replace(/\*/gi,"\\w")+"$","ig");if(s.test(_)){h=i._fileTypeEnum[f];break}}if(h)t(h,e.name+"."+i._fileExtEnum[h]);else{var d={type:"badfiletype",msg:"file type error: cannot analysis file type"};i._throwError(d,r)}}catch(o){var u={type:"apierror",msg:"api error: not support DataView api"};i._throwError(u,r)}}),o.readAsArrayBuffer(e)}catch(n){var a={type:"apierror",msg:"api error: not support FileReader api"};i._throwError(a,r)}},i._compress=function(e,t,r){try{!function(){i._originFileSize=e.size;var r=document.createElement("img"),o=URL.createObjectURL(e);r.addEventListener("load",function(e){URL.revokeObjectURL(o);var r=e.target;i._originWidth=r.naturalWidth,i._originHeight=r.naturalHeight;var n=void 0,a=void 0,g=i._option.width,l=i._option.height;void 0===g||"auto"===g||void 0!==l&&"auto"!==l?void 0!==l||"auto"===l||void 0!==g&&"auto"!==g?void 0!==g&&"auto"!==g&&void 0!==l&&"auto"!==l?(n=parseInt(g),a=parseInt(l),n*i._originHeight/i._originWidth>a?(n=Math.floor(a*i._originWidth/i._originHeight),n>i._originWidth&&(n=i._originWidth,a=i._originHeight)):(a=Math.floor(n*i._originHeight/i._originWidth),a>i._originHeight&&(n=i._originWidth,a=i._originHeight))):(n=i._originWidth,a=i._originHeight):(a=parseInt(l),i._originHeight<a&&(a=i._originHeight),n=Math.floor(a*i._originWidth/i._originHeight)):(n=parseInt(g),i._originWidth<n&&(n=i._originWidth),a=Math.floor(n*i._originHeight/i._originWidth));for(var p=i._compressByCanvas(r,n,a,i._option.quality),_=i._dataURL2Blob(p);_.size>i._option.limitSize;)n=Math.floor(.8*n),a=Math.floor(.8*a),p=i._compressByCanvas(r,n,a,i._option.quality),_=i._dataURL2Blob(p);i._fileSize=_.size,i._width=n,i._height=a,i._blob=_,i._dataURL=p,t("finish")}),r.src=o}()}catch(o){var n={type:"apierror",msg:"api error: not support canvas or URL api"};i._throwError(n,r)}},i._compressByCanvas=function(i,e,t,r){var o=document.createElement("canvas");o.width=e,o.height=t;var n=o.getContext("2d");n.fillStyle="#FFF",n.fillRect(0,0,o.width,o.height),n.drawImage(i,0,0,o.width,o.height);var a=o.toDataURL("image/jpeg",r);return a},i._dataURL2Blob=function(e){try{for(var t=e.split(","),r=t[0].match(/:(.*?);/)[1],o=atob(t[1]),n=o.length,a=new Uint8Array(n);n--;)a[n]=o.charCodeAt(n);return new Blob([a],{type:r})}catch(g){var l={type:"apierror",msg:"api error: not support atob or Unit8Array api"};i._throwError(l,errorback)}},i._throwError=function(){var i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],e=arguments[1];if(!e||"function"!=typeof e)throw new Error(i.msg);e(i)}}(window.jIMGCompress||(window.jIMGCompress={}))}]);
//# sourceMappingURL=jIMGCompress.js.map