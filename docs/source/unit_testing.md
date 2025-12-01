# Unit Testing

This section contains the necessary information to run the unit tests for TraitHorizon. The tests are designed to ensure the functionality and reliability of the software.

## Setting Up the Environment

Before running the tests, you need to set up your environment. Please see the {doc}`installation` section for instructions.

## Running the Tests

Once your environment is set up, you can run the tests.

### Running All Tests

You can run all the tests using `pytest`. The `-vv` option increases verbosity and `--tb=long` ensures that the full traceback is shown if any test fails.

```bash
pytest -vv --tb=long
```

### Understanding the Test Structure

The tests are located in the `traithorizon/tests` directory and are organized into different files based on the functionality they test. Here are the current tests:

- `functional/test_routes.py`: Contains tests for the application's routes. These include:
  - `test_index_route`: Verifies that the index route (`/`) returns an HTML response with status code 200.
  - `test_image_route`: Checks that the `/image/<image_path>` route returns an image with status code 200.
  - `test_tsv_route`: Ensures that the `/tsv` route returns a TSV file with status code 200.
  - `test_hide_axes_route`: Validates that the `/hide_axes` route returns a JSON response with the correct `hide_axes` configuration.

### Sample Test Command

Here's an example of how to run a specific test file, for instance, the route tests:

```bash
pytest traithorizon/tests/functional/test_routes.py -vv --tb=long
```

### Output and Logs

During test execution, you will see detailed output in the terminal. This includes information about which tests passed, which failed, and any errors encountered. The `--tb=long` option ensures that full traceback information is provided, which is useful for debugging.

## Conclusion

Running unit tests is a critical part of ensuring the reliability and correctness of TraitHorizon. By following the steps outlined above, you can set up your environment and run the tests to validate the functionality of the software. For any issues or further assistance, refer to the detailed output provided by `pytest` or consult the project's documentation and support resources.