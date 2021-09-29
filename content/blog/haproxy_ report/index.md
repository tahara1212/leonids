---
title: HAProxyで負荷分散した話
date: "2020-09-20T09:26:03.284Z"
description: "多機能プロキシサーバ。ロードバランサやリバースプロキシとして利用できる。トラフィックのコントロールや、リクエストヘッダを書き換えて別サーバに渡す事ができる。"
categories: [hello world]
comments: true
image:
  feature: https://images.unsplash.com/photo-1440635592348-167b1b30296f?crop=entropy&dpr=2&fit=crop&fm=jpg&h=475&ixjsv=2.1.0&ixlib=rb-0.3.5&q=50&w=1250
  credit: thomas shellberg
  creditlink: https://unsplash.com/photos/Ki0dpxd3LGc
---

## HAProxy

多機能プロキシサーバ。ロードバランサやリバースプロキシとして利用できる。  
トラフィックのコントロールや、リクエストヘッダを書き換えて別サーバに渡す事ができる。

### LBサーバ側の手順

#### HAProxy をインストール
```Linux
yum -y install haproxy
```

  
#### 基本的な構成はデフォルトのまま。  
設定値の詳細は[こちら](https://knowledge.sakura.ad.jp/8084/) の記事を参考にした。
```Linux
vi /etc/haproxy/haproxy.cfg  
defaults
    mode                    http
    log                     global
    option                  httplog
    option                  dontlognull
    option http-server-close
    option forwardfor       except 127.0.0.0/8
    option                  redispatch
    retries                 3
    timeout http-request    10s
    timeout queue           15m
    timeout connect         10s
    timeout client          15m
    timeout server          15m
    timeout http-keep-alive 10s
    timeout check           10s
    maxconn                 3000
```

  
#### httpアクセスをhttpsにリダイレクトさせる
```Linux
frontend  http-in
    #mode tcp
    bind *:80
    reqadd X-Forwarded-Proto:\ http
    default_backend             static

frontend  https
    #mode tcp
    bind *:443 ssl crt /etc/haproxy/server.pem
    reqadd X-Forwarded-Proto:\ https
    default_backend             static

backend static
    balance     roundrobin
    appsession PHPSESSID len 32 timeout 30m request-learn
    server      webA 111.222.333.444:80 check
    server      webB 111.223.334.445:80 check
```
クライアントがHTTP通信の場合は80ポートのフロントエンドに処理が流れる。  
reqadd X-Forwarded-Proto:\ httpを指定してヘッダにhttpを加え、webサーバへと通信を流す。  

クライアントがHTTPS通信の場合は443ポートのフロントエンドに処理が流れ、ヘッダにはhttpsを指定する。  
default_backendによって分散先のwebサーバを指定する。 

SSLオフロード形式なので、LB以降のwebサーバへは80ポートで渡す。  
これにより、LBサーバ（HAProxy）にもSSL証明書ファイルを読ませる必要がある。

オプションにcheckを指定する事で、バックエンドに指定するサーバのいずれかがダウンしている場合、そのサーバへはアクセスしない冗長化の処理を行う。  
今回の設定ではHAProxyのログは出力していない。  

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