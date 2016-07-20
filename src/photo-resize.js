/**
 * 写真を指定サイズに縮小、あるいは拡大して、DataURIで返すクラス
 * 利用先で import PhotoResize from '../src/photo-resize' などで読み込む
 * @copyright 2016 YuTanaka@AmuseOne
 * @license MIT
 */

import piexif from './plugins/piexif';
import {Resize} from './plugins/resize';

export default class PhotoResize {

    constructor() {
        // Workerを利用するかのフラグ。現時点では動いていないのでfalseにしておく
        this.USER_WORKER = false;
    }

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
        this.exifObj = piexif.load(data);
        return this.exifObj;
    }

    /**
     * 画像のサイズを返す。画像が90度回転している時は、それに対応して縦横を入れ替えた状態で返す。
     * ImageWidth/ImageHeightが有効ならそちらを。無効ならExifImageWidthとExifImageHeightを返す。
     * @param ExifObject exifObj 省略した場合、読み込み済みのものを使う
     * @return [0]=幅 / [1]=高さ。読み込めなかった時は、falseを返す
     */
    getImageSize(exifObj) {
        var ret = [0,0];
        exifObj = exifObj || this.exifObj;
        if (exifObj['0th']['ImageWidth'] && exifObj['0th']['ImageLength']) {
            ret[0] = exifObj['0th']['ImageWidth'];
            ret[1] = exifObj['0th']['ImageLength'];
        }
        else if (exifObj['Exif'][piexif.ExifIFD.PixelXDimension] && exifObj['Exif'][piexif.ExifIFD.PixelYDimension]) {
            ret[0] = exifObj['Exif'][piexif.ExifIFD.PixelXDimension];
            ret[1] = exifObj['Exif'][piexif.ExifIFD.PixelYDimension];
        }
        else {
            // 幅も高さも無効だったので何もしない
            return false;
        }
        // 反転チェック
        if (this.isSwapSide()) {
            var temp = ret[0];
            ret[0] = ret[1];
            ret[1] = temp;
        }
        return ret;
    }

    /**
     * 指定の画像の縦横サイズを入れ替える必要があるかを返す
     * @param ExifObject exifObj 省略した場合は、読み込み済みのものを利用
     * @return true=入れ替える必要あり / false=入れ替える必要なし
     */
    isSwapSide(exifObj) {
        const ori = this.getOrientation(exifObj);
        return (ori>=5);
    }

    /**
     * JSImageResizerによる拡大、縮小
     * @param string photo
     */
    JSImageResizer(photo, origw, origh, dstw, dsth, callback) {
        var resize = new Resize(origw, origh, dstw, dsth, true, true, this.USE_WORKER, callback);
        resize.resize(photo);
    }

    /**
     * 幅と高さで指定した矩形におさまる最大サイズに縮小、あるいは拡大する。
     * isUpをtrueにすると、現在のサイズが小さかった場合、拡大する。
     * ここではリサイズのみで、Exifはいじらない
     * @param string photo 変換する元の画像(DataURL)
     * @param int width 指定の幅
     * @param int height 指定の高さ
     * @param function callback(data) 変換後のデータを返すコールバック
     * @param bool isUp 現在のサイズが指定の矩形より小さい時、拡大する時true。falseや省略の場合は処理しない
     * @return string 変換後のDataURL。Exifがないなどの場合、false
     */
    resize(photo, width, height, callback, isUp) {
        var that = this;
        isUp = isUp || false;

        // 処理する
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = function(event) {
            var scale_w = 1;
            var scale_h = 1;
            var scale = 1;
            var scale_w_pixel = width;
            var scale_h_pixel = height;

            // 拡大率を算出
            scale_w = width/this.width;
            scale_h = height/this.height;

            // 小さい方を拡大、縮小率として採用する
            if (scale_w <= scale_h) {
                scale = scale_w;
                scale_w_pixel = width;
                scale_h_pixel = this.height*scale;
            }
            else {
                scale = scale_h;
                scale_w_pixel = this.width*scale;
                scale_h_pixel = height;
            }

            // 拡大の場合で、isUpがfalseであれば何もしない
            if (!isUp && (scale>=1)) {
                callback(photo);
                return;
            }

            canvas.width = this.width;
            canvas.height = this.height;
            ctx.drawImage(this, 0, 0);
            that.JSImageResizer(
                ctx.getImageData(0, 0, this.width, this.height).data,
                this.width, this.height,
                scale_w_pixel, scale_h_pixel,
                (buffer) => {
                    var tempcanvas = document.createElement('canvas');
                    tempcanvas.width = scale_w_pixel;
                    tempcanvas.height = scale_h_pixel;
                    var tempcontext = tempcanvas.getContext('2d');
                    that.updateCanvas(tempcontext, tempcontext.createImageData(scale_w_pixel, scale_h_pixel), buffer);
                    callback(tempcanvas.toDataURL('image/jpeg'));
                });
        }
        image.src = photo;
    }

    /** 縮小、拡大した画像を指定のコンテキストに描画。
     * resizeから利用。
     */
    updateCanvas(contextHandlePassed, imageBuffer, frameBuffer) {
        var data = imageBuffer.data;
        var length = data.length;
        for (var x = 0; x < length; ++x) {
            data[x] = frameBuffer[x] & 0xFF;
        }
        contextHandlePassed.putImageData(imageBuffer, 0, 0);
    }

    /**
     * 指定のDataURL画像を、指定のスケールで拡大・縮小して返す
     * 参考URL: http://qiita.com/geek_duck/items/2db28daa9e27df9b861d
     * @param string photo サイズを変更する画像のDataURL
     * @param number scale 拡大率
     * @param function callback(result) 処理後にデータを渡すコールバック関数
     * @return string 変換後の画像のDataURL
     */
    image_resize(photo, dstWidth, dstHeight, callback) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = function(event) {
            canvas.width = dstWidth;
            canvas.height = dstHeight;
            ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, dstWidth, dstHeight);
            callback(canvas.toDataURL('image/jpeg'));
        }
        image.src = photo;
    }

    /**
     * 画像の回転を返す
     * 1=そのまま
     * 2=上下反転
     * 3=180度回転
     * 4=左右反転
     * 5=上下反転、時計回りに270度回転
     * 6=時計回りに90度回転
     * 7=上下反転、時計回りに90度回転
     * 8=時計回りに270度回転
     *
     * @param ExifObj exifObj 省略したら、読み込み済みのExifObjを利用
     * @return 取得したorientationの値を返す。データがない場合は1(そのまま)を返す
     */
    getOrientation(exifObj) {
        exifObj = exifObj || this.exifObj;
        return exifObj['0th']['Orientation'] || 1;
    }

    /**
     * 渡されたexifObjの中身を列挙したHTML文字列を返す
     * @param ExifObj exifObj
     * @return string 文字列
     */
    exifHTML(exifObj) {
        exifObj = exifObj || this.exifObj;
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
