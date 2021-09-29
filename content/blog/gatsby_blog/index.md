---
title: Gatsby.jsを使って10分でブログを構築する
date: "2020-09-20T09:26:03.284Z"
description: "Reactの静的サイトジェネレータ。ポートフォリオやブログ等のテンプレートが用意されており、誰でも簡単にサイトを構築できる。"
categories: [hello world]
comments: true
image:
  feature: https://images.unsplash.com/photo-1440635592348-167b1b30296f?crop=entropy&dpr=2&fit=crop&fm=jpg&h=475&ixjsv=2.1.0&ixlib=rb-0.3.5&q=50&w=1250
  credit: thomas shellberg
  creditlink: https://unsplash.com/photos/Ki0dpxd3LGc
---

## Gatsby.js

Reactの静的サイトジェネレータ。GraphQLでデータを取得し、HTMLはmarkdownから生成する。  
ポートフォリオやブログ等のテンプレートが用意されており、誰でも簡単にサイトを構築できる。


### Gatsby CLIをインストール
```Linux
npm install -g gatsby-cli
```

#### ブログ用のstarterを使用してプロジェクトを立ち上げる
starterは[公式サイト](https://www.gatsbyjs.com/starters/) に一覧で掲載されている。  
今回はleonidsというブログを選択。
```Linux
npx gatsby new leonids https://github.com/renyuanz/leonids
```
  
#### 基本的な情報を修正する
GraphQLでgatsby-config.jsファイルに記載されているmetaデータを更新する。  
今回はそこまで作り込む気はないので、サイトタイトルとブログ記事の執筆者名を変更しておく。
```gatsby-config.js
module.exports = {
  pathPrefix: "/leonids",
  siteMetadata: {
    title: `Peita`,
    author: {
      name: `@peita`,
      summary: `web dev`,
    },
    description: `A simple, fixed sidebar two columns Gatsby.js blog starter.`,
    siteUrl: `https://renyuanz.github.io/leonids`,
    social: {
      twitter: `ry_zou`,
    },
    defaultImage: "images/bg.jpeg",
  },
```

  
#### ブログ記事を書いてみる
/content/blog/配下にディレクトリを作成。  
既存のサンプルを参考に適当に記事を書いてみる。  
md形式なので改行は半角空白2つで行う。

### WEBサーバ側の手順

#### apacheの設定を変更する。
```Linux
vi /etc/httpd/conf/httpd.conf

<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot /var/www/public
    ServerName www.example.com
    RequestReadTimeout header=20 body=30

    RewriteEngine On
    RewriteCond %{HTTP:X-Forwarded-Port} !^443$
    RewriteCond %{HTTP:X-Forwarded-Proto} =http
    RewriteRule .* https://%{HTTP:Host}%{REQUEST_URI} [L,R=permanent]
</VirtualHost>
```
RewriteCond %{HTTP:X-Forwarded-Proto} =httpによって、LBサーバで付与したヘッダを確認する。  
httpが指定されている場合のみhttpsにリダイレクト。  
上記の設定によってリダイレクトループを回避する。  