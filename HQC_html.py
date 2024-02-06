from flask import render_template, Blueprint, request, current_app, send_file, send_from_directory


# import command to stringify a json object
import json
import os

html = Blueprint('html', __name__, template_folder='templates')

@html.route('/')
def index():
    return render_template('index.html')

@html.route('/image/<path:fn>', methods=['GET'])
def image(fn):
    # read image from file system and send over http
    img_path = os.path.join(current_app.config['assets_path'], fn)
    # return send_from_directory(current_app.config['assets_path'], fn)
    return send_file(img_path)

@html.route('/tsv', methods=['GET'])
def tsv():
    # read tsv from file system and send over http
    return send_file(current_app.config['tsv_path'])

@html.route('/hide_axes', methods=['GET'])
def hide_axes():
    return json.dumps(current_app.config['hide_axes'])