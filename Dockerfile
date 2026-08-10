FROM golang:1.24-alpine AS build

WORKDIR /src
COPY server.go .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/de-plaat-server server.go

FROM gcr.io/distroless/static-debian12:nonroot

WORKDIR /site
COPY --from=build /out/de-plaat-server /de-plaat-server
COPY index.html styles.css events.js robots.txt sitemap.xml ./
COPY assets/ ./assets/
COPY data/ ./data/
COPY termine/ ./termine/

EXPOSE 8080
USER nonroot:nonroot
CMD ["/de-plaat-server"]
