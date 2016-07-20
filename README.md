# photo-resize-js
写真画像をクライアントサイドでリサイズして、アップロードできるようにするJavaScriptライブラリ。

- 画像の拡大、縮小には[taisel JS-Image-Resizer](https://github.com/taisel/JS-Image-Resizer)を利用
- Exifの読み書きは[hMatoba piexifjs](https://github.com/hMatoba/piexifjs)

# 機能
- Fileで読み込む画像を渡すか、文字列(data:image/jpeg;base64,)で渡す
- 横方向の最大サイズと横方向の最大サイズを指定
- サムネイルを作成し直す
- サイズが小さい時に拡大しないフラグ

# 提供メソッド
## 公開メソッド
- resize(DataURL, 幅, 高さ, すでに小さい時は処理しないフラグ)
  - 戻り値は画像のバイナリデータ

## ユーティリティメソッド
- load(File)
  - 指定のファイルから画像を読み込んで、Data URI Schemaの形式(data:image/jpeg;base64,・・・)で返す

# 利用ライブラリ
- https://github.com/hMatoba/piexifjs
- https://github.com/taisel/JS-Image-Resizer

## JS-Image-Resizerのメモ
- Workerを使う場合も、resize.jsを利用する



- resizeWorker.jsを以下のようにして読み込む
```
var worker = new Worker('./plugins/resizeWorker.js');
```
- resizeWorkerは、setupとresizeの2回のパスで動作する。配列に引数を設定してそれぞれ呼び出す
```
// setup呼び出し
// thisにイメージデータ、this.widthに元の幅、this.heightに元の高さ、dstWidthに変更後の幅、dstHeightに変更後の高さが設定されているものとする
// [0]=元の幅
// [1]=元の高さ
// [2]=変更後の幅
// [3]=変更後の高さ
// [4]=色のバイト数。アルファチャンネルがあれば4。なければ3を指定
// [5]=interpolationPassを使う場合true
worker.process([
    'setup',
    this.width, this.height,


]);
```
function Resize(widthOriginal, heightOriginal, targetWidth, targetHeight, colorChannels, interpolationPass) {

# 参考URL
- http://qiita.com/geek_duck/items/2db28daa9e27df9b861d
