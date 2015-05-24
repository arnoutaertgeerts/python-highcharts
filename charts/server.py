__author__ = 'Arnout Aertgeerts'

import SimpleHTTPServer
import SocketServer
import os


class ChartRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def __init__(self, request, client_address, server):
        SimpleHTTPServer.SimpleHTTPRequestHandler.__init__(self, request, client_address, server)
        return

    def log_message(self, format, *args):
        pass


class ChartServer(SocketServer.TCPServer):

    def __init__(self, server_address, handler_class=ChartRequestHandler):
        SocketServer.TCPServer.__init__(self, server_address, handler_class)
        return


def run_server(path='.'):
    import threading

    address = ('localhost', 0)  # let the kernel give us a port
    server = ChartServer(address, ChartRequestHandler)
    ip, port = server.server_address  # find out what port we were given

    print 'Server running in the folder {0} at {1}:{2}'.format(os.path.abspath(os.getcwd()), ip, port)

    t = threading.Thread(target=server.serve_forever)
    t.setDaemon(True)  # don't hang on exit
    t.start()

    return 'http://{0}:{1}/{2}/'.format(ip, port, path)


address = run_server()


def url(path):
    return address + path