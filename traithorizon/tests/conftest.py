import pytest
from flask import Flask
from traithorizon.routes import html

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(html)
    app.config['assets_path'] = '../examples/imgs'
    app.config['tsv_path'] = '../examples/tubule_example.tsv'
    app.config['hide_axes'] = {'x': False, 'y': True}
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()
