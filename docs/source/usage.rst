Usage Guide
===========

This document provides instructions for using traithorizon.

Command Line Interface (CLI)
----------------------------
.. code-block:: bash

   (venv) jackson@jackson-Precision-7670:~/research/code/TraitHorizon$ traithorizon --help
   usage: traithorizon [-h] [--reverse_proxy] [--hide_axes HIDE_AXES [HIDE_AXES ...]] assets_path tsv_path

   A dash application for visualizing images with arbitrary numerical features.

   positional arguments:
   assets_path           The path of the folder containing image files.
   tsv_path              The path of the tsv file. Each row should start with a filename (image1.png) cell, followed by a cell for each feature.

   options:
   -h, --help            show this help message and exit
   --reverse_proxy       Set this flag if the app is behind a reverse proxy.
   --hide_axes HIDE_AXES [HIDE_AXES ...]
                           Axes to hide from the parallel coordinates plot in addition to 'filename', 'img', and 'url'.


Usage Example
--------------------------------
.. code-block:: bash

   traithorizon examples/imgs examples/example.tsv


Reverse Proxy
--------------------------------
Some production environments may require running the app behind a reverse proxy.

If you are running the app behind a reverse proxy (e.g., Nginx), you may need to set the `--reverse_proxy` flag. This ensures that the app correctly handles forwarded headers and URL paths.
