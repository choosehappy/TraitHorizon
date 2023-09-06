from flask import Flask
# from flask_restless import APIManager
import argparse

from HQC_html import html

app = Flask(__name__)
app.register_blueprint(html)
app.logger_name = 'flask'

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="A dash application for visualizing images with arbitrary numerical features.")
    parser.add_argument("assets_path", type=str, help="The path of the folder containing image files.")
    parser.add_argument("tsv_path", type=str, help="The path of the tsv file. Each row should start with a filename (image1.png) cell, followed by a cell for each feature.")
    args = parser.parse_args()

    # send args to flask app
    app.config['assets_path'] = args.assets_path
    app.config['tsv_path'] = args.tsv_path
    
    app.logger.info('Starting Flask app')
    app.run(host='0.0.0.0', port=5555, debug=False)