from __future__ import annotations

import os
import socket
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT=os.path.dirname(os.path.abspath(__file__))
HOST='127.0.0.1'

def choose_port():
    for port in range(8091,8101):
        with socket.socket(socket.AF_INET,socket.SOCK_STREAM) as sock:
            try:
                sock.bind((HOST,port))
            except OSError:
                continue
            return port
    raise RuntimeError('Kein freier Preview-Port zwischen 8091 und 8100 gefunden.')

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-store, max-age=0')
        self.send_header('X-LS-Connect-Preview','0.9.4')
        super().end_headers()
    def log_message(self,fmt,*args):
        print('[Preview] '+fmt%args)


def main():
    os.chdir(ROOT)
    port=choose_port()
    url=f'http://{HOST}:{port}/'
    server=ThreadingHTTPServer((HOST,port),Handler)
    print('LS Connect RC Preview v0.9.4')
    print('Adresse:',url)
    print('Fenster geöffnet lassen. Beenden mit Strg+C.')
    threading.Timer(0.8,lambda:webbrowser.open(url)).start()
    try:
        server.serve_forever(poll_interval=.25)
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__=='__main__':
    main()
