import bottle
from bottle import request, response, static_file, run
import logging
import json
import xml.etree.ElementTree as ET
import time
from xml.dom import minidom
import socket
import http.server
import socketserver

def getComponentXmlString(component_type, component_name, parameters = None):
	if(component_type == "FeederTie"):
		Library = "Microgrid"
		ElementType = "OnePhase"
		SubType = "Components"
		Element = "Transmission"
		type_name = component_name
		type_category = component_type
	elif(name == ""):
		pass

	xml_string = ""
	xml_string += "<Library name=\"" + Library + "\">"
	xml_string += "<ElementType name=\"" + ElementType + "\">"
	xml_string += "<SubType name=\"" + SubType + "\">"
	xml_string += "<Element name=\"" + Element + "\">"
	xml_string += "<Type category=\"" + component_type + "\" name=\"" + component_name + "\">" 
	xml_string += "</Type></Element></SubType></ElementType></Library>"
	return xml_string

def processXml(xml_tree):
	xml_string = ""
	microgrid = ET.fromstring(xml_tree)
	# root = tree.getroot()
	model = microgrid.find("model")
	component_xml_string = "<?xml version='1.0'?><Architecture name=\"MicroGrid_Layout_1_phase\"><Definitions>"
	for component in model.findall("component"):
		component_type = component.get("type")
		component_name = component.get("name")
		component_xml_string += getComponentXmlString(component_type, component_name)
		pass
	
	component_xml_string+="</Definitions></Architecture>"
	with open("test.xml", "w") as f:
		f.write(component_xml_string)
	return component_xml_string

def enable_cors(fn):
	def _enable_cors():
		# set CORS headers
		response.headers['Access-Control-Allow-Origin'] = '*'
		response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
		response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
		return fn()
	return _enable_cors

app = bottle.app()

@app.hook('after_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
	
@app.route('/generateXML', method='GET')
#@enable_cors
def returnXML():
	payload = request.params['body']
	xml_string = processXml(payload)
	print(xml_string)
	response.status = 200
	response.body = xml_string
	print("")
	print(response.body)
	print("Before sleep")
	time.sleep(10000)
	print("After sleep")
	return response
	
@app.hook('after_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

@app.route('/getXML', method='GET')
#@enable_cors
def returnFile():
	return static_file('generateXml_error.txt', root='F:/ARNAB/MON/mgp/')
	#return static_file('test.xml', root='F:/ARNAB/MON/mgp/CircuitDesigner_mod/js/controller/')

#app.run(port=10002)
app.run(host='localhost', port=7777)