(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.photoResize = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var PhotoResize = function () {
        function PhotoResize(worker) {
            _classCallCheck(this, PhotoResize);

            // Workerを利用するかのフラグ
            this.USE_WORKER = typeof worker === "undefined" ? true : worker;
        }

        /** 指定のファイルを読み込む
         * @param File file 読み込むファイル。fileタグなどで指定されたもの
         * @param function callback 読み込みが完了したら呼び出すコールバック関数。引数として、読み込んだデータのDataURIを返す
        */


        _createClass(PhotoResize, [{
            key: 'loadAndResize',
            value: function loadAndResize(file, width, height, callback, isUp) {
                var that = this;
                var reader = new FileReader();
                reader.onload = function (e) {
                    that.resize(e.target.result, width, height, callback, isUp);
                };
                reader.readAsDataURL(file);
            }
        }, {
            key: '_loadExif',
            value: function _loadExif(data) {
                this.exifObj = piexif.load(data);
                return this.exifObj;
            }
        }, {
            key: 'getImageSize',
            value: function getImageSize(exifObj) {
                var ret = [0, 0];
                exifObj = exifObj || this.exifObj;

                try {
                    ret[0] = exifObj['0th'][piexif.ImageIFD.ImageWidth];
                    ret[1] = exifObj['0th'][piexif.ImageIFD.ImageLength];
                } catch (e) {
                    try {
                        ret[0] = exifObj['Exif'][piexif.ExifIFD.PixelXDimension];
                        ret[1] = exifObj['Exif'][piexif.ExifIFD.PixelYDimension];
                    } catch (ee) {
                        return false;
                    }
                }

                // 反転チェック
                if (this.isSwapSide(exifObj)) {
                    var temp = ret[0];
                    ret[0] = ret[1];
                    ret[1] = temp;
                }
                return ret;
            }
        }, {
            key: 'isSwapSide',
            value: function isSwapSide(exifObj) {
                var ori = this.getOrientation(exifObj);
                return ori >= 5;
            }
        }, {
            key: '_JSImageResizer',
            value: function _JSImageResizer(photo, origw, origh, dstw, dsth, callback) {
                var resize = new Resize(origw, origh, dstw, dsth, true, true, this.USE_WORKER, callback);
                resize.resize(photo);
            }
        }, {
            key: 'resize',
            value: function resize(photo, width, height, callback, isUp) {
                var that = this;
                var temp;
                this._loadExif(photo);

                // フラグ設定
                isUp = isUp || false;

                // 画像の縦横が異なる時、拡大、縮小先のx,yを入れ替える
                if (this.isSwapSide()) {
                    temp = width;
                    width = height;
                    height = temp;
                }

                // 処理する
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var image = new Image();
                image.crossOrigin = "Anonymous";
                image.onload = function (event) {
                    var scale_w = 1;
                    var scale_h = 1;
                    var scale = 1;
                    var scale_w_pixel = width;
                    var scale_h_pixel = height;

                    // 拡大率を算出
                    scale_w = width / this.width;
                    scale_h = height / this.height;

                    // 小さい方を拡大、縮小率として採用する
                    if (scale_w <= scale_h) {
                        scale = scale_w;
                        scale_w_pixel = width;
                        scale_h_pixel = this.height * scale;
                    } else {
                        scale = scale_h;
                        scale_w_pixel = this.width * scale;
                        scale_h_pixel = height;
                    }

                    // 拡大の場合で、isUpがfalseであれば何もしない
                    if (!isUp && scale >= 1) {
                        callback(photo);
                        return;
                    }

                    canvas.width = this.width;
                    canvas.height = this.height;
                    ctx.drawImage(this, 0, 0);
                    that._JSImageResizer(ctx.getImageData(0, 0, this.width, this.height).data, this.width, this.height, scale_w_pixel, scale_h_pixel, function (buffer) {
                        var tempcanvas = document.createElement('canvas');
                        tempcanvas.width = scale_w_pixel;
                        tempcanvas.height = scale_h_pixel;
                        var tempcontext = tempcanvas.getContext('2d');
                        that._updateCanvas(tempcontext, tempcontext.createImageData(scale_w_pixel, scale_h_pixel), buffer);

                        // exifを更新して返す
                        callback(that._setSize(that.exifObj, tempcanvas.toDataURL('image/jpeg'), scale_w_pixel, scale_h_pixel));
                    });
                };
                image.src = photo;
            }
        }, {
            key: '_setSize',
            value: function _setSize(beforeexif, data, width, height) {
                beforeexif['0th'][piexif.ImageIFD.ImageWidth] = width;
                beforeexif['0th'][piexif.ImageIFD.ImageLength] = height;
                beforeexif['Exif'][piexif.ExifIFD.PixelXDimension] = width;
                beforeexif['Exif'][piexif.ExifIFD.PixelYDimension] = height;
                var exifStr = piexif.dump(beforeexif);
                return piexif.insert(exifStr, data);
            }
        }, {
            key: '_updateCanvas',
            value: function _updateCanvas(contextHandlePassed, imageBuffer, frameBuffer) {
                var data = imageBuffer.data;
                var length = data.length;
                for (var x = 0; x < length; ++x) {
                    data[x] = frameBuffer[x] & 0xFF;
                }
                contextHandlePassed.putImageData(imageBuffer, 0, 0);
            }
        }, {
            key: 'getOrientation',
            value: function getOrientation(exifObj) {
                exifObj = exifObj || this.exifObj;
                return exifObj['0th'][piexif.ImageIFD.Orientation] || 1;
            }
        }, {
            key: 'exifHTML',
            value: function exifHTML(exifObj) {
                exifObj = exifObj || this.exifObj;
                var output = "";
                for (var ifd in exifObj) {
                    if (ifd == "thumbnail") {
                        continue;
                    }
                    output += "-" + ifd + "<br>";
                    for (var tag in exifObj[ifd]) {
                        output += "  " + piexif.TAGS[ifd][tag]["name"] + ":" + exifObj[ifd][tag] + "<br>";
                    }
                }

                return output;
            }
        }], [{
            key: 'convDataURL2Binary',
            value: function convDataURL2Binary(data) {
                if (!data.startsWith('data:image/')) {
                    return false;
                }

                var datas = data.split(',');
                return window.atob(datas[1]);
            }
        }]);

        return PhotoResize;
    }();

    exports.default = PhotoResize;

    if (typeof window != "undefined") {
        !window.PhotoResize && (window.PhotoResize = PhotoResize);
    }
});

},{}]},{},[1]);
