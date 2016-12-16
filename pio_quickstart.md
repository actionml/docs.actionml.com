# Quickstart

Requirements:

 - A 'nix distribution like Redhat, Centos, Debian, Ubuntu, or Mac OS X. If you are running Windows we recommend a VM with `nix.
 - 16G memory for real data, 8g for very small experiments 
 - Java SE Development Kit 8

## Method 1: Scripted Install

On Linux / Mac OS X, PredictionIO can now be installed with a single command:

`bash -c "$(curl -s https://raw.githubusercontent.com/actionml/PredictionIO/master/bin/install.sh)"`

The above script will complete the installation for you including prerequisites. If you already have some prerequisites or plan a custom or clustered config use the manual install instructions. 

## Method 2: AWS All-In-One Instance

We maintain an [AWS AMI](/docs/awssetupguide) with pre-installed PredictionIO and The Universal Recommender. You can run any compatible Template on this by downloading and building it.

## Method 3: Other Installation Guides

{{> piosetupguides}}
