package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	root := "/site"
	files := http.FileServer(http.Dir(root))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			path := filepath.Clean(filepath.Join(root, r.URL.Path))
			if _, err := os.Stat(path); err == nil {
				files.ServeHTTP(w, r)
				return
			}
		}
		http.ServeFile(w, r, filepath.Join(root, "index.html"))
	})

	log.Println("De Plaat website listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
