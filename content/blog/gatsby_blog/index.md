---
title: Gatsby.jsを使って10分でブログを構築する
date: "2021-08-28T09:26:03.284Z"
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

#### フォントを変更
/src/utils/Typography.jsにフォント系の情報がある。  
デフォルトがWordpress2016となっていて日本語に対応していないので、Noto Sans JPとかに変更。
```Typography.js
import theme from "typography-theme-github"

theme.overrideThemeStyles = () => {
  return {
    a: {
      color: "var(--textLink)",
    },
    // gatsby-remark-autolink-headers - don't underline when hidden
    "a.anchor": {
      boxShadow: "none",
    },
    // gatsby-remark-autolink-headers - use theme colours for the link icon
    'a.anchor svg[aria-hidden="true"]': {
      stroke: "var(--textLink)",
    },
    hr: {
      background: "var(--hr)",
    },
  }
}

theme.googleFonts = [
  {
    name: "Noto+Sans+JP",
    styles: ["400"],
  }
]

const typography = new Typography(theme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
```

#### Netlifyにデプロイしてみる
テンプレートによっては、インストールしているモジュールの依存関係でデプロイ時にエラーになる。　　
凝ったデザインのものを使うより、シンプルなデザインのテンプレートを自分好みにカスタマイズした方が総合的には楽そう。  
今回のleonidsは問題なくデプロイできた。
