from flask import Flask
# from flask_restless import APIManager
import argparse

from HQC_html import html
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.register_blueprint(html)
app.logger_name = 'flask'

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="A dash application for visualizing images with arbitrary numerical features.")
    parser.add_argument("assets_path", type=str, help="The path of the folder containing image files.")
    parser.add_argument("tsv_path", type=str, help="The path of the tsv file. Each row should start with a filename (image1.png) cell, followed by a cell for each feature.")
    parser.add_argument("--reverse_proxy", action="store_true", help="Set this flag if the app is behind a reverse proxy.")
    parser.add_argument("--hide_axes", type=str, nargs='+', help="List of axes to hide from the parallel coordinates plot. Default values are [filename, gid, img, patientID]", default=["filename", "gid", "img", "patientID"])
    args = parser.parse_args()

    # send args to flask app
    app.config['assets_path'] = args.assets_path
    app.config['tsv_path'] = args.tsv_path
    app.config['hide_axes'] = args.hide_axes

    if args.reverse_proxy:
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
    
    app.logger.info('Starting Flask app')
    app.run(host='0.0.0.0', port=5555, debug=False)
