# Welcome to TraitHorizon's Documentation!

**TraitHorizon** is a Flask application designed for visualizing images alongside arbitrary numerical features. It combines a parallel coordinate plot with a data table to provide an interactive interface for exploring your data. 

Researchers and pathologists may find TraitHorizon useful for exploring digital pathology datasets, which can contain hundreds of thousands of histologic objects (e.g., renal tubules) paired with high-dimensional feature vectors. An example use case is presented in the corresponding [JOSS paper](../../paper/paper.pdf).

![TraitHorizon Screenshot](./_static/images/TH_screenshot.png)

## Key Features

- Visualize images with associated numerical features.
- Interactive parallel coordinate plots for feature exploration.
- Support for data with image URLs.

## Community Guidelines
If you encounter a bug or have a feature request, please open an issue on [GitHub Issues](../../issues). Contributions are welcome via [Pull Requests](../../pulls)—please be respectful and constructive in your interactions with others.


## License

TraitHorizon is provided under the [MIT License](https://opensource.org/licenses/MIT).

## Links
- Github: [https://github.com/choosehappy/TraitHorizon](https://github.com/choosehappy/TraitHorizon)
- Docker Hub: [https://hub.docker.com/r/histotools/traithorizon](https://hub.docker.com/r/histotools/traithorizon)

```{toctree}
:maxdepth: 2
:caption: Contents:

installation
usage
unit_testing
```
