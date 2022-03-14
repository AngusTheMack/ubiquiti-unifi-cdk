# Ubiquiti Unifi CDK

This package sets up the infrastructure needed for the Unifi controller to run on AWS.  

It will create the following:
* EC2 t4g.nano instance using Ubuntu 20.04
* 40Gb EBS Volume
* Elastic IP Address
* Instance Security Group with the [following rules](https://help.ui.com/hc/en-us/articles/218506997-UniFi-Ports-Used#)


## Before Creating the Stack
Create an EC2 Key-pair (follow [this guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#prepare-key-pair) if you don't know how to do that) and replace `your-key-pair-name-goes-here` with your key-pair in the [ubiquiti-cdk-stack.json](./lib/ubiquiti-cdk-stack.ts)

## Creating Stack
### CLI
Assuming you have your [AWS CDK Environment Credentials setup](https://docs.aws.amazon.com/cdk/latest/guide/environments.html), you can create the stack via the CLI as follows:
```
cdk deploy
```

## Afterwards...
This sets up the hardware needed for the controller, and the basic unifi intallation script setup by Glenn R
  * [UniFi Installation Scripts](https://community.ui.com/questions/UniFi-Installation-Scripts-or-UniFi-Easy-Update-Script-or-UniFi-Lets-Encrypt-or-UniFi-Easy-Encrypt-/ccbc7530-dd61-40a7-82ec-22b17f027776)

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
