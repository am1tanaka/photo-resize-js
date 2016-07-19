/**
 * 写真を指定サイズに縮小、あるいは拡大して、DataURIで返すクラス
 * 利用先で import PhotoResize from '../src/photo-resize' などで読み込む
 * @copyright 2016 YuTanaka@AmuseOne
 * @license MIT
 */

import piexif from './plugins/piexif';
//var piexif = require('./plugins/piexif');

export default class PhotoResize {
    /** 指定のファイルを読み込む
     * @param File file 読み込むファイル。fileタグなどで指定されたもの
     * @param function callback 読み込みが完了したら呼び出すコールバック関数。引数として、読み込んだデータのDataURIを返す
    */
    static _load(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            callback(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    /**
     * @param string data DataURLの文字列
     * 渡されたデータから、EXIFデータを取り出す
     */
    loadExif(data) {
        return piexif.load(data);
    }

    /**
     * 渡されたexifObjの中身を列挙したHTML文字列を返す
     * @param ExifObj exifObj
     * @return string 文字列
     */
    exifHTML(exifObj) {
        var output = "";
        for (var ifd in exifObj) {
            if (ifd == "thumbnail") {
                continue;
            }
            output += "-" + ifd + "<br>";
            for (var tag in exifObj[ifd]) {
                output += "  " + piexif.TAGS[ifd][tag]["name"] + ":" + exifObj[ifd][tag]+"<br>";
            }
        }

        return output;
    }
}
