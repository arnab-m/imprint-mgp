"""
Example of setting up CORS with Bottle.py.
"""

from bottle import Bottle, request, response, static_file, run
app = Bottle()

@app.hook('after_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

@app.route('/getXML', method=['OPTIONS', 'GET'])
def getXML():
    """
    If you are using something like Spine.js you'll need to
    handle requests for the OPTIONS method. I haven't found a
    DRY way to handle this yet. I tried setting up a hook for before_request,
    but was unsuccessful for now.
    """
    if request.method == 'OPTIONS':
        return {}
    else:
        response.status = 200
        response.body = {"<?xml version='1.0'?> <microgrid version='0.1'><model id='MicroGrid_Layout_1_phase'><component id='1' name='Sensor1' type='Sensor'></component><component id='2' name='Resistive2' type='Resistive'></component><equation><connection destid='1' id='0' srcid='2' /></equation></model></microgrid>"}
        return response

@app.route('/examples', method=['OPTIONS', 'GET'])
def examples():
    """
    If you are using something like Spine.js you'll need to
    handle requests for the OPTIONS method. I haven't found a
    DRY way to handle this yet. I tried setting up a hook for before_request,
    but was unsuccessful for now.
    """
    if request.method == 'OPTIONS':
        return {}
    else:
        return {'examples': [{
            'id': 1,
            'name': 'Foo'},{
            'id': 2,
            'name': 'Bar'}
        ]}


if __name__ == '__main__':
    from optparse import OptionParser
    parser = OptionParser()
    parser.add_option("--host", dest="host", default="localhost",
                      help="hostname or ip address", metavar="host")
    parser.add_option("--port", dest="port", default=8080,
                      help="port number", metavar="port")
    (options, args) = parser.parse_args()
    run(app, host=options.host, port=int(options.port))
