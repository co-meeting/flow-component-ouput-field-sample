# Flow Component OuputField Sample

レコードと項目を指定するだけで標準の Lightning と同じ形式で出力できる画面フロー用のコンポーネントサンプルです。

## 構築手順

以下の対応は事前に行なっているものとする

- DevHub 組織の設定
  - [ロック解除済みパッケージと第二世代管理パッケージを有効化](https://developer.salesforce.com/docs/atlas.ja-jp.230.0.sfdx_dev.meta/sfdx_dev/sfdx_setup_enable_secondgen_pkg.htm)

### 1.ソースコードを clone

```
git clone git@github.com:co-meeting/flow-component-ouput-field-sample.git
cd flow-component-ouput-field-sample
```

### 2.DevHub 組織認証

スクラッチ組織が作成できるように DevHub 組織を認証

```
sfdx force:auth:web:login --setdefaultdevhubusername -a sample-devhub
```

制限チェック用

```
sfdx force:limits:api:display -u sample-devhub
```

npm パッケージのインストール

```
npm install
```

## 開発 Tips

### スクラッチ組織新規作成

```
npm run org:create
```

※スクラッチ組織の作成に失敗したら、devhub 組織の作成可能な有効なスクラッチ組織数を確認してみること。不要なスクラッチ組織があったら削除する

### unofficialsf のソース取り込み

スクラッチ組織の作成直後は、スクラッチ組織へソースをデプロイ(Push)する前に、以下のコマンドを実行して、unofficialsf のソースコードを取り込む。

```
npm run srccopy:unofficialsf:pickup
```

### スクラッチ組織へソースをデプロイ(Push)

```
npm run src:push
```

### 作成したスクラッチ組織を Web ページで開く

```
npm run org:open
```

### ロック解除済みパッケージの作成

```
sfdx force:package:create --name "Flow Component OuputField Sample" --path force-app --packagetype Unlocked
```

### 作成したロック解除済みパッケージリストの確認

```
sfdx force:package:list
```

### ロック解除済みパッケージバージョンの作成

```
sfdx force:package:version:create --package "Flow Component OuputField Sample" --codecoverage --installationkeybypass --wait 10
```

### 作成したロック解除済みパッケージバージョンリストの確認

```
sfdx force:package:version:list --packages "Flow Component OuputField Sample"
```

### パッケージインストール用スクラッチ組織の作成

```
sfdx force:org:create --definitionfile config/project-scratch-def.json -a output_field_package_install_SCRATCH
```

### ロック解除済みパッケージのインストール

```
sfdx force:package:install --package <SubscriberPackageVersionId> -u output_field_package_install_SCRATCH --wait 10 --publishwait 10
```

### パッケージのインストール確認

```
sfdx force:org:open -u output_field_package_install_SCRATCH
```

### ロック解除済みパッケージのリリース

```
sfdx force:package:version:promote --package <SubscriberPackageVersionId>
```

### ロック解除済みパッケージバージョンの削除

```
sfdx force:package:version:delete --package <SubscriberPackageVersionId>
```

### ロック解除済みパッケージの削除

```
sfdx force:package:delete --package <PackageId>
```

## License

MIT License
[LICENSE](LICENSE)

#### 一部 `BSD 3-Clause License`　です。

- [Flow Combobox](https://unofficialsf.com/develop-custom-property-editors-quickly-with-flowcombobox/)
- [Object and Field Picker](https://unofficialsf.com/add-an-object-and-field-picklist-pair-to-your-flow/)

Flow Component Samples では、 [Flow Action and Screen Component BasePacks – UnofficialSF](https://unofficialsf.com/flow-action-and-screen-component-basepacks/) にて、 [Alex Edelstein](https://unofficialsf.com/author/alexed1000/) が公開してくれている以下サポートツールのソースコードを、CmOutputField コンポーネントのカスタムプロパティエディタ構築の際に利用してます。
該当ソースコード(`sfdx-src/managed/main/UnofficialSF`)はそのまま改変せず利用しており、当フォルダ配下は`BSD 3-Clause License`です。

License:
BSD 3-Clause License, https://github.com/alexed1/LightningFlowComponents/blob/master/LICENSE

Source:
https://github.com/alexed1/LightningFlowComponents/
