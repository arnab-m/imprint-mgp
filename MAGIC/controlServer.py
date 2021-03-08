# app.py
from flask import Flask, render_template
from flask import jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Display your index page
@app.route("/")
def index():
    return render_template('index.html')

# A function to add two numbers
@app.route("/add")
@cross_origin()
def add():
    a = request.args.get('a')
    b = request.args.get('b')
    response = jsonify({"result": a+b})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
    #return jsonify({"result": a+b})

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == "__main__":
    app.run(host='localhost', port=7070)