# Atena

A Testing Engine for APIs

## Getting Started

`node atena.js --tests-path custom_tests_path`

```
Usage: atena [options]

Options:
  -V, --version             output the version number
  -t, --tests-path <path>   Specify the tests path.
  -D, --debug               Enable debug logging.
  -p, --make-plugin <name>  Scaffold a new plugin
  -h, --help                output usage information
```

## POC requirements

* suites & tests need ability to read configuration from - configuration.yaml for each test
* suites & tests need ability to read encrypted configuration
* ability to run suites & tests in parallel
* flag for fail fast 
* flag for log level - for easy debugging
* ability to run specific test / specific suite
* version management - dependecy graph:
  * a suite can depend on an api version
  * a test can depend on an api version
  * a test can depend on a suite version
* a suite can have multiple tests
* a test can be part of multiple suites
* a test can run without beeing part of a suite
* when running tests specify api and api version
* easy run plugins(utility functions) and assertions
* engine selection: (since this is a unified platform)
  * autocannon - wrk for performance
  * chakram - for functional
* define performance test model
  * peek
  * ramp up
  * hooks
  * cool down
  * eventual assertions
  * connections
  * threads
  * duration
  * desired RPS

## FUTURE

* cli to generate test yamls from open-api standard
* cli to generate test yamls from envoy configuration
* cli to generate test yamls from gateway json configuration
