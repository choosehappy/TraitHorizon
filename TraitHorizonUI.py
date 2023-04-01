from dash import Dash, dash_table, dcc, html
from dash.dependencies import Input, Output
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import flask
import argparse

parser = argparse.ArgumentParser(description="A dash application for visualizing images with arbitrary numerical features.")
parser.add_argument("assets_path", type=str, help="The path of the folder containing image files.")
parser.add_argument("tsv_path", type=str, help="The path of the tsv file. Each row should start with a filename (image1.png) cell, followed by a cell for each feature.")
# args = parser.parse_args()

assets_path = '/home/jackson/data/img_features_viewer/images'
tsv_path = '/home/jackson/data/img_features_viewer/sample.tsv'

# assets_path = args.assets_path
# tsv_path = args.tsv_path

# -----INITIALIZE APP-----
f_app = flask.Flask(__name__)
app = Dash(__name__, assets_folder=assets_path, server=f_app)

def get_thumbnail(path):
    try:
        asset_path = app.get_asset_url(path)
    except:
        asset_path = ''
    return f"<a href='{asset_path}'><img src='{asset_path}' style='height:1in'/></a>"

df = pd.read_csv(tsv_path, sep='\t')

refs = [get_thumbnail(ref) for ref in df.iloc[:,0]]
df['htmlimgs'] = refs

columns = [{"name": i, "id": i, "deletable": True, "selectable": True} for i in df.columns]
columns.insert(0, {"name": "image", "id": "htmlimgs", "deletable": True, "selectable": True, "presentation":"markdown"})
columns.pop(-1)
width_multiplier = 100 if len(columns) <=15 else 100 * len(columns) / 15

# Create parallel plot
fig = px.parallel_coordinates(df.iloc[:,1:])    # get all cols after the first


@app.callback(
        Output("data-table", "filter_query"),
        Input("parallel-plot-container", "restyleData"))
def update_table(restyleData):
    if restyleData != None:
        range = list(restyleData[0].values())[0][0]
        feat_num = int(list(restyleData[0].keys())[0].split(']')[0][-1])
        col_key = df.columns[1:][feat_num]

        query = f'{{{col_key}}} ge {range[0]} && {{{col_key}}} le {range[1]}'
        return query
    return ''



app.layout = html.Div(
    [   
        html.H1(id='head', children="TraitHorizon"),
        html.Div(style={"overflowX": "scroll"}, children=[
            dcc.Graph(figure=fig, id="parallel-plot-container", style={"width":f"{width_multiplier}%","maxHeight": "500px"})
        ]),
        dash_table.DataTable(
            css=[dict(selector="p", rule="margin: 0px;")],
            data=df.to_dict("records"),
            # fixed_rows={'headers': True},
            # fixed_columns={'headers': True, 'data': 1},
            columns=columns,
            markdown_options={"html": True},
            style_table={"maxHeight": "500px", "overflowX": "scroll", "overflowY": "scroll"},
            editable=True,
            filter_action="native",
            sort_action="native",
            sort_mode="multi",
            # column_selectable="single",
            # row_selectable="multi",
            # row_deletable=True,
            selected_columns=[],
            selected_rows=[],
            page_action="native",
            page_current= 0,
            page_size= 10,
            id="data-table"
        ),
    ]
)

if __name__ == "__main__":
    app.run_server(debug=True)