# photo-resize-js
写真画像をクライアントサイドでリサイズして、アップロードできるようにするJavaScriptライブラリ。

- 画像の拡大、縮小には[taisel JS-Image-Resizer](https://github.com/taisel/JS-Image-Resizer)を利用
- Exifの読み書きは[hMatoba piexifjs](https://github.com/hMatoba/piexifjs)

# 機能
- Fileで読み込む画像を渡すか、文字列(data:image/jpeg;base64,)で渡す
- 横方向の最大サイズと横方向の最大サイズを指定
- サムネイルを作成し直す
- サイズが小さい時に拡大しないフラグ

# 使い方
- public/scripts/photo-resize.min.js をダウンロード
- [hMatoba piexifjs](https://github.com/hMatoba/piexifjs)から、piexif.jsをダウンロード
- [Grant Galitz. JS-Image-Resizer](https://github.com/taisel/JS-Image-Resizer)から、resize.jsとresizeWorker.jsをダウンロード
- 利用するのをindex.htmlファイルとすると、以下のように配置
```
project
|- index.html
|- plugins-piexif.js
|       |- resize.js
|       |- resizeWorker.js
|       |- resize.js
|
|- scripts-photo-resize.min.js
```
- index.htmlの簡単な例
```
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Photo Resize Sample</title>
</head>
<body>
<h1>Photo Resize Sample</h1>
  <input type="file" name="file-photo" id="file-photo">
  <div>
    <textarea id="result" cols="100" rows="5"></textarea>
  </div>
  <img src="" id="image-div" alt="変換後">
  
  <script type="text/javascript" src="plugins/piexif.js"></script>
  <script type="text/javascript" src="plugins/resize.js"></script>
  <script type="text/javascript" src="scripts/photo-resize.min.js"></script>
  <script>
    function handleDone(data) {
      document.getElementById('result').innerText = data;
      document.getElementById('image-div').src=data;
    }
    function convDataURI(evt) {
      var photoResize = new PhotoResize();
      photoResize.loadAndResize(evt.target.files[0], 640,480, handleDone, false);
    }
    document.getElementById('file-photo').addEventListener('change', convDataURI, false);
  </script>
</body>
</html>
```


# 提供メソッド
## 公開メソッド
- コンストラクタ
  - 利用前に生成する
- getImageSize([exifObject])
  - 引数
    - exifObject piexif.load()で読み込んだExifのオブジェクト。省略すると、事前に読み込んだ値を利用する
  - 戻り値
    - 配列で幅と高さを返す。ImageWidthとImageHeightが読めればそちら。なければExifのものを取り出す。回転後の幅と高さに入れ替えて返す
    - [0]=幅。[1]=高さ
- resize(DataURL, 幅, 高さ, すでに小さい時は処理しないフラグ)
  - 戻り値は画像のバイナリデータ
- isSwapSide([exifObject])
  - 引数
    - exifObject piexif.load()で読み込んだExifのオブジェクト。省略すると、事前に読み込んだ値を利用する
  - 戻り値
    - trueの時、90度回転している。falseの時は縦横の入れ替えなし
- resize(photo, 幅, 高さ, callback[,isUp])
  - 画像サイズを、縦横比を維持して、指定の幅と高さに収まる最大サイズに変更する
  - 画像サイズが指示より大きい時、最後のフラグがtrueだと拡大する。falseや省略した場合は縮小しかしない
  - 縦と横が入れ替わっている画像の場合、指定する縦と横をそのままの状態で、画像を回転させた状態が収まるように調整する
  - 引数
    - photo 写真のDataURL形式のデータ
    - 幅 設定する幅
    - 高さ 設定する高さ
    - callback 処理後に呼び出すコールバック関数。変換後の画像データ(DataURL)をコールバックの引数に渡して呼び出す
    - isUp trueにすると、必要に応じて画像を拡大する。falseか省略すると縮小のみで拡大が必要な場合は何もしない
  - 戻り値
    - DataURLの画像データ
- getOrientation([exifObject])
  - 指定のデータの回転情報を返す。
  - 引数
    - exifObject piexif.load()で読み込んだExifのオブジェクト。省略すると、事前に読み込んだ値を利用する
  - 戻り値
    - 1=そのまま
    - 2=上下反転
    - 3=180度回転
    - 4=左右反転
    - 5=上下反転、時計回りに270度回転
    - 6=時計回りに90度回転
    - 7=上下反転、時計回りに90度回転
    - 8=時計回りに270度回転
- exifHTML([exifObject])
  - 指定のデータのExif情報を表示するHTMLを返す。
  - 引数
    - exifObject piexif.load()で読み込んだExifのオブジェクト。省略すると、事前に読み込んだ値を利用する
  - 戻り値
    - exifデータを整形したHTML
- static convDataURL2Binary(data)
  - 指定のDataURL文字列をバイナリーに変換して返す。
  - 引数
    - data DataURL文字列
  - 戻り値
    - 変換したバイナリデータ

  
## ユーティリティメソッド
- load(File)
  - 指定のファイルから画像を読み込んで、Data URI Schemaの形式(data:image/jpeg;base64,・・・)で返す
- _JSImageResizer(photo, origw, origh, dstw, dsth, callback)
  - JSImageResizerのセットアップを呼び出して、resizeを実行する関数。resize()から呼び出す。
- _setSize(beforeexif, data, width, heigth)
  - 指定のデータに、指定のexifの幅と高さを書き込んでExifとして再設定して、設定した画像データを返す。
  - 引数
    - beforeexif 変形前のexif情報
    - data 設定先の画像でーた
    - width 設定する幅
    - height 設定する高さ
  - 戻り値
    - 指定の幅と高さを設定した画像DataURL
- _updateCanvas(contextHandlePassed, imageBuffer, frameBuffer)
  - JSImageResizerで拡大・縮小したデータを指定のcanvasに描画する。
  - 引数
    - contextHandlePassed 描画先のcontext2d
    - imageBuffer 描画先のimage
    - frameBuffer 変換後のデータ
  - 戻り値
    - なし

# 利用ライブラリ
- https://github.com/hMatoba/piexifjs
  - ライセンス：[MIT License](https://github.com/hMatoba/piexifjs/blob/master/LICENSE.txt)
- https://github.com/taisel/JS-Image-Resizer
  - ライセンス：パブリックドメイン



# 参考URL
- http://mae.chab.in/archives/2849
- http://qiita.com/geek_duck/items/2db28daa9e27df9b861d
- https://gist.github.com/Fishrock123/8ea81dad3197c2f84366
