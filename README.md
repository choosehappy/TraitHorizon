# TraitHorizon

**TraitHorizon** is a Dash application designed for visualizing images along with arbitrary numerical features. It allows you to explore and interact with image data through an intuitive user interface, providing both parallel coordinate plots and a data table for analysis.

## Prerequisites

Before using the Image Features Viewer, ensure you have the following components installed:

- Python 3.x
- Dash
- Plotly
- Pandas
- Flask
- argparse

## Installation

1. Clone or download the repository containing TraitHorizon.

2. Install the required Python packages using the following command:

    ```bash
    pip install dash plotly pandas flask
    ```

## Usage

To use the Image Features Viewer tool, follow these steps:

1. Open a terminal window and navigate to the cloned TraitHorizon repository.

2. Run the application by executing the following command:

    ```bash
    python TraitHorizonUI.py path_to_assets_folder path_to_tsv_file
    ```

    Try running the following command to try our toy example:
    ```bash
    python TraitHorizonUI.py ./example_imgs example.tsv
    ```

3. Once the application is running, open a web browser and go to the provided URL (usually `http://127.0.0.1:8050/`).

## Features

### Parallel Coordinate Plot

The Image Features Viewer provides a parallel coordinate plot that displays the relationship between numerical features of the images. Each line in the plot represents an image, and you can interact with it to filter and explore the data.

### Data Table

The data table displays the image filenames, thumbnails, and corresponding numerical feature values. You can perform the following actions with the data table:

- Filter data by range using the parallel coordinate plot. Select a range on the plot, and the data table will update accordingly.
- Sort data by clicking on the column headers.
- Edit cell values directly in the table.
- Apply native filtering and sorting actions to the table (see https://dash.plotly.com/datatable/filtering for more info).
- Navigate through pages using pagination controls.

## Troubleshooting

If you encounter any issues or have questions, please refer to the official Dash and Plotly documentation for assistance.

## Contributions

Contributions to the Image Features Viewer tool are welcome. Feel free to fork the repository, make improvements, and submit pull requests.

## License

This tool is provided under the [MIT License](https://opensource.org/licenses/MIT).
