(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 写真を指定サイズに縮小、あるいは拡大して、DataURIで返すクラス
 */

var PhotoResize = function () {
    function PhotoResize() {
        _classCallCheck(this, PhotoResize);
    }

    _createClass(PhotoResize, [{
        key: "load",

        /** 指定のファイルを読み込む
         * @param File file 読み込むファイル。fileタグなどで指定されたもの
         * @param function callback 読み込みが完了したら呼び出すコールバック関数。引数として、読み込んだデータのDataURIを返す
        */
        value: function load(file, callback) {
            var reader = new FileReader();
            reader.onload = function (e) {
                callback(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }]);

    return PhotoResize;
}();

},{}]},{},[1]);
