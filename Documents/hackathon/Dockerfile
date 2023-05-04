FROM golang:1.20 as build

# コンテナ内に作業ディレクトリを作成する
WORKDIR /app

COPY slack-like-app/ .


# # 依存関係をダウンロードする
RUN go mod tidy

# # main.goをビルドする
RUN go build -o app .

# ポート番号を指定する
EXPOSE 8000

# コンテナを起動する際に実行するコマンドを指定する
CMD ["./app"]
