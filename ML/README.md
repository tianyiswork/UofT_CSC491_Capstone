# ML

Here you'll find Proof Of Concepts and notebooks for developing the ML for TuneScout's features.

## Anaconda

In order to ensure we're all using the same environment, download Anaconda for the latest version of python 3:

```https://www.anaconda.com/download/#macos```


Once you have anaconda installed, create the conda environment based on the environment.yml file in this directory:

```conda env create -f environment.yml```

You can now activate your environment by running:

```source activate <env_name>```

If you've already created the conda environment and simply need to get the latest packages, run (with the env activated):

```conda env update -f=environment.yml```

Lastly, if you've installed a new file into the conda environment and would like to include it in shared environment, run (with the env activated):

```conda env export > environment.yml```
