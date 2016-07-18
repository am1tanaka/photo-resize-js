/**
 * 写真を指定サイズに縮小、あるいは拡大して、DataURIで返すクラス
 * 利用先で import PhotoResize from '../src/photo-resize' などで読み込む
 * @copyright 2016 YuTanaka@AmuseOne
 * @license MIT
 */

export default class PhotoResize {
    /** 指定のファイルを読み込む
     * @param File file 読み込むファイル。fileタグなどで指定されたもの
     * @param function callback 読み込みが完了したら呼び出すコールバック関数。引数として、読み込んだデータのDataURIを返す
    */
    load(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        }
        reader.readAsDataURL(file);
    }
}
