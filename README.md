# photo-resize-js
写真画像をクライアントサイドでリサイズして、アップロードできるようにするJavaScriptライブラリ。

画像の拡大、縮小にはCanvasを利用して、piexifを使って、EXIFも対応させる。EXIFは残す。

# 機能
- Fileで読み込む画像を渡すか、文字列(data:image/jpeg;base64,)で渡す
- 横方向の最大サイズと横方向の最大サイズを指定
- サムネイルを作成し直す
- サイズが小さい時に拡大しないフラグ

# 提供メソッド
## 公開メソッド
- resize(幅, 高さ, すでに小さい時は処理しないフラグ)
  - 戻り値は画像のバイナリデータ

## ユーティリティメソッド
- load(File)
  - 指定のファイルから画像を読み込んで、Data URI Schemaの形式(data:image/jpeg;base64,・・・)で返す

# 利用ライブラリ
- https://github.com/hMatoba/piexifjs
- 
# 参考URL
- http://qiita.com/geek_duck/items/2db28daa9e27df9b861d
