from __future__ import annotations

import os
import socket
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = os.path.dirname(os.path.abspath(__file__))
PRODUCTION_ORIGIN = "https://ls-connect-online.vercel.app"
HOST = "127.0.0.1"
PORT_START = 8091
PORT_END = 8100


def choose_port() -> int:
    for port in range(PORT_START, PORT_END + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind((HOST, port))
            except OSError:
                continue
            return port
    raise RuntimeError(f"Kein freier Preview-Port zwischen {PORT_START} und {PORT_END} gefunden.")


class PreviewHandler(SimpleHTTPRequestHandler):
    server_version = "LSConnectPreview/0.9.3"

    def log_message(self, fmt: str, *args) -> None:
        print(f"[Preview] {self.address_string()} - {fmt % args}")

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("X-LS-Connect-Preview", "0.9.3")
        super().end_headers()

    def do_GET(self) -> None:
        if self.path == "/api/script" or self.path.startswith("/api/script?"):
            self.proxy_script()
            return
        super().do_GET()

    def proxy_script(self) -> None:
        target = PRODUCTION_ORIGIN + self.path
        request = Request(
            target,
            headers={
                "User-Agent": "LS-Connect-RC-Preview/0.9.3",
                "Accept": "application/javascript,text/javascript,*/*;q=0.1",
                "Cache-Control": "no-cache",
            },
            method="GET",
        )
        try:
            with urlopen(request, timeout=25) as response:
                body = response.read()
                status = getattr(response, "status", 200)
                content_type = response.headers.get("Content-Type", "application/javascript; charset=utf-8")
                self.send_response(status)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(body)))
                self.send_header("X-LS-Preview-Proxied", "production-api-script")
                self.end_headers()
                self.wfile.write(body)
        except HTTPError as error:
            body = error.read() or str(error).encode("utf-8", "replace")
            self.send_response(error.code)
            self.send_header("Content-Type", error.headers.get("Content-Type", "text/plain; charset=utf-8"))
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except (URLError, TimeoutError, OSError) as error:
            body = f"Preview-Proxy konnte Production nicht erreichen: {error}".encode("utf-8", "replace")
            self.send_response(502)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)


def main() -> None:
    os.chdir(ROOT)
    port = choose_port()
    url = f"http://{HOST}:{port}/"
    server = ThreadingHTTPServer((HOST, port), PreviewHandler)
    print("LS Connect RC Preview v0.9.3")
    print(f"Preview: {url}")
    print("/api/script wird sicher an die bestehende Production weitergeleitet.")
    print("Zum Beenden dieses Fenster mit Strg+C stoppen.")
    threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever(poll_interval=0.25)
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
