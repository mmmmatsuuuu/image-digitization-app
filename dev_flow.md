# 開発手順

1.  **プロジェクトのセットアップ:**
    *   Viteを使ってReact（TypeScript）プロジェクトの環境を構築します。
    *   設計書にあるMUIなどの必要なライブラリをインストールします。
    *   `design.md`に記載のディレクトリ構成を作成します。

2.  **UIの骨格作成:**
    *   MUIを使い、`App`, `CameraCapture`, `ImageEditor`の各コンポーネントの基本的なレイアウトを作成します。この段階では機能は実装しません。

3.  **カメラ機能の実装:**
    *   `CameraCapture`コンポーネントで、PCやスマートフォンのカメラ映像を表示し、画像をキャプチャする機能を実装します。

4.  **画像編集機能の実装:**
    *   キャプチャした画像を`ImageEditor`に表示します。
    *   HTML Canvas APIを使い、階調やフィルターの調整機能を実装します。

5.  **解像度変更とデータ量計算:**
    *   画像の解像度を変更するUIを実装し、実際にキャンバスサイズが変更されるようにします。
    *   解像度の変更に応じてデータ量を計算し、表示する機能を実装します。

6.  **「元に戻す」機能の実装:**
    *   編集内容（階調・解像度）をすべてリセットし、撮影した直後の状態に戻す機能を実装します。

7.  **仕上げ:**
    *   全体の動作確認、UIの微調整などを行います。
    *   レスポンシブ対応は完了しました。
    *   テーマ設定も完了しました。
    *   すべての開発作業が完了しました。
