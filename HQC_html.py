from flask import render_template, Blueprint, request, current_app

html = Blueprint('html', __name__, template_folder='templates')

@html.route('/')
def index():
    return "Blank Page"

@html.route('/slickgrid/<fn>')
def slickgrid(fn):
    return render_template('index.html', fn=fn)
