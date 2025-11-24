# Installation Guide

## Install from Docker Hub
The recommended way to install TraitHorizon is via Docker. You can run a traithorizon container with a single command:

```bash
docker run -it -p 5555:5555 -v [HOST_DIRECTORY]:[CONTAINER_DIRECTORY] histotools/traithorizon:main /bin/bash
```

```{note}
Replace `[HOST_DIRECTORY]` and `[CONTAINER_DIRECTORY]` with the appropriate paths on your host and in the container, respectively. For an example use case, you can omit the -v flag altogether to run the container without mounting any directories.
```

This will pull the latest image from the [TraitHorizon DockerHub repository](https://hub.docker.com/r/histotools/traithorizon) and start a new container with an interactive terminal for running TraitHorizon commands. Please see the {doc}`usage` section for instructions on how to use TraitHorizon.

## Install using pip
While we recommend using Docker for most users, some may prefer installing TraitHorizon from source for development or customization purposes.

```{note}
TraitHorizon has been tested using Python 3.10 and may not be compatible with other versions.
```

Follow these steps to install and set up TraitHorizon:

1. **Clone the Repository**

   Clone the TraitHorizon repository to your local machine:

   ```bash
   git clone https://github.com/choosehappy/TraitHorizon.git
   cd TraitHorizon
   ```

2. **(Optional) Set Up a Virtual Environment**

   It is recommended to use a virtual environment to manage dependencies:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**

   Install TraitHorizon

   ```bash
   pip install .
   ```

4. **Verify Installation**

   Run the following command to verify that TraitHorizon is installed correctly:

   ```bash
   traithorizon --help
   ```

   This should display the CLI usage instructions.

## Next Steps

Once installed, proceed to the {doc}`usage` section to learn how to use TraitHorizon.
