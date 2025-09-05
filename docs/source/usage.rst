User Guide
===========

This document provides instructions for using traithorizon.

Command Line Interface (CLI)
----------------------------

.. note::

   If you are running the app behind a reverse proxy (e.g., Nginx), you may need to set the ``--reverse_proxy`` flag. 
   This ensures that the app correctly handles forwarded headers and URL paths.


.. code-block::

   $ traithorizon --help

   usage: traithorizon [-h] [--reverse_proxy] [--hide_axes HIDE_AXES [HIDE_AXES ...]] assets_path tsv_path

   A web application for visualizing images with arbitrary numerical features.

   positional arguments:
   assets_path           The path of the folder containing image files.
   tsv_path              The path of the tsv file. Each row should start with a filename (image1.png) cell,
                           followed by a cell for each feature.

   options:
   -h, --help            show this help message and exit
   --reverse_proxy       Set this flag if the app is behind a reverse proxy.
   --hide_axes HIDE_AXES [HIDE_AXES ...]
                           Axes to hide from the parallel coordinates plot in addition to 'filename', 'img',
                           and 'url'.


Usage Example
--------------------------------
.. code-block:: bash

   traithorizon examples/imgs examples/tubule_example.tsv


TSV File Format
----------------
The TSV (Tab-Separated Values) file used by traithorizon should adhere to the following format: 

1. **Header Row**: The first row must contain column names. The first column should be labeled `filename`, followed by feature names. Each feature name should be unique.

2. **Data Rows**: Each subsequent row represents data for a single image. The first cell in each row must contain the filename of the image (e.g., `image1.png`). The remaining cells should contain numerical values corresponding to the features defined in the header row.

3. **Required Columns**:
   - `filename`: The name of the image file. This must match the actual image file in the specified `assets_path`.
   - Additional columns can represent any numerical features associated with the image.

4. **Example**:
   Below is an example of a valid TSV file:

   .. code-block:: tsv

      filename    TBM_AREA    TE_AREA    LUMEN_AREA
      image1.png  144.37      228.36     245.46
      image2.png  454.83      3436.57    280.17
      image3.png  318.03      3095.94    1315.53

   A full example TSV file can be found here: 
   `example.tsv <https://github.com/choosehappy/TraitHorizon/blob/main/traithorizon/examples/tubule_example.tsv>`_

5. **Notes**:
   - Ensure that the TSV file is properly formatted with no missing values in required columns.
   - The `filename` column must not contain duplicate entries.

Supported Numeric Formats
-----------------
We use `d3.autotype <https://d3js.org/d3-dsv#autoType>`_ to infer types while parsing the TSV file. Supported numeric formats include:
   - Integers: ``123``, ``-456``
   - Floating-point numbers: ``123.45``, ``-678.90``
   - Scientific notation: ``1.23e4``, ``-5.67E-8``

Other formats may work but may produce unexpected plotting results. We recommend excluding these columns using the ``--hide_axes`` flag.


Building Docs Locally
---------------------
To build the documentation locally, follow these steps:

.. code-block:: bash

   python3 -m pip install -r docs/requirements.txt
   sphinx-autobuild docs/source docs/_build/html

Then follow the link provided in the terminal to view the docs in your web browser.