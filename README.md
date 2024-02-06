# TraitHorizon

**TraitHorizon** is a Flask application designed for visualizing images alongside arbitrary numerical features. The application pairs a parallel coordinate plot with a data table to provide an interactive interface for exploring the data.

![TraitHorizon Screenshot](TH_screenshot.png)
## Prerequisites

Before using the Image Features Viewer, ensure you have the following components installed:

- Python 3.x
- Flask

## Installation

1. Clone or download the repository containing TraitHorizon.

2. Install the required Python packages using the following command:

    ```bash
    pip install Flask
    ```

## Preparing your data
See `example.tsv` file for an example of how to format your data. The first column should be the filename of the image, and the remaining columns should be the features you want to visualize. The first row should contain the names of the columns.

See `example_with_urls.tsv` for an example of how to include URLs in your data.


## CLI
```
python3 TraitHorizon --help

usage: [-h] [--reverse_proxy] [--hide_axes HIDE_AXES [HIDE_AXES ...]] assets_path tsv_path

A dash application for visualizing images with arbitrary numerical features.

positional arguments:
  assets_path           The path of the folder containing image files.
  tsv_path              The path of the tsv file. Each row should start with a filename (image1.png) cell, followed by a cell for each feature.

optional arguments:
  -h, --help            show this help message and exit
  --reverse_proxy       Set this flag if the app is behind a reverse proxy.
  --hide_axes HIDE_AXES [HIDE_AXES ...]
                        Axes to hide from the parallel coordinates plot in addition to 'filename', 'img', and 'url'.
```

## Usage

To use the Image Features Viewer tool, follow these steps:

1. Open a terminal window and navigate to the cloned TraitHorizon repository.

2. Run the application by executing the following command:

    ```bash
    python ./ path_to_assets_folder path_to_tsv_file
    ```

    Run the following command to try TraitHorizon with our toy example:
    ```bash
    python ./ example_imgs example.tsv
    ```

3. Once the application is running, open a web browser and go to the provided URL (usually `http://127.0.0.1:5000/`).

## Proxy Configuration
If you are hosting TraitHorizon behind a reverse proxy, pass the `--reverse-proxy` flag.

## Contributions

Contributions to the Image Features Viewer tool are welcome. Feel free to fork the repository, make improvements, and submit pull requests.

## License

This tool is provided under the [MIT License](https://opensource.org/licenses/MIT).
