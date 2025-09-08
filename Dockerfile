FROM python:3.10-slim
SHELL ["/bin/bash", "-c"]

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git

# Since this is a deployment image, we copy the source code rather than mounting it.
COPY . /opt/TraitHorizon    
WORKDIR /opt/TraitHorizon

# Install uv
RUN pip install uv

# Create a virtual environment for uv and install all dependencies
RUN uv venv /opt/uv_venv
ENV PATH="/opt/uv_venv/bin:$PATH"

# We want to use uv without adhering to its .toml formatting rules
RUN uv pip install .