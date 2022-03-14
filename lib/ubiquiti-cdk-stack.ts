import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2'
import * as iam from '@aws-cdk/aws-iam'
import * as fs from 'fs'

export class UbiquitiCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const defaultVpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });

    const role = new iam.Role(
      this,
      'unifi-role',
      { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') }
    )

    const securityGroup = new ec2.SecurityGroup(
      this,
      'unifi-sg',
      {
        vpc: defaultVpc,
        allowAllOutbound: true,
        securityGroupName: 'unifi-sg',
      }
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allows SSH access from Internet'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(8080),
      'Port used for device and controller communication'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv6(),
      ec2.Port.tcp(8080),
      'Port used for device and controller communication Ipv6'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(8443),
      'Port used for controller GUI/API as seen in a web browser'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv6(),
      ec2.Port.tcp(8443),
      'Port used for controller GUI/API as seen in a web browser Ipv6'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(6789),
      'Port used for UniFi mobile speed test'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv6(),
      ec2.Port.tcp(6789),
      'Port used for UniFi mobile speed test Ipv6'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(8880),
      'Port used for HTTP portal redirection'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv6(),
      ec2.Port.tcp(8880),
      'Port used for HTTP portal redirection Ipv6'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(8843),
      'Port used for HTTPS portal redirection'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv6(),
      ec2.Port.tcp(8843),
      'Port used for HTTPS portal redirection Ipv6'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcpRange(5656,5699),
      'Ports used by AP-EDU broadcasting'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv6(),
      ec2.Port.tcpRange(5656,5699),
      'Ports used by AP-EDU broadcasting Ipv6'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3478),
      'Port used for STUN'
    )

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv6(),
      ec2.Port.tcp(3478),
      'Port used for STUN Ipv6'
    )

    const instance = new ec2.Instance(this, 'unifi-controller-cdk', {
      vpc: defaultVpc,
      role: role,
      securityGroup: securityGroup,
      instanceName: 'unifi-controller-instance',
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.NANO
      ),
      machineImage: ec2.MachineImage.fromSsmParameter(
        '/aws/service/canonical/ubuntu/server/20.04/stable/current/arm64/hvm/ebs-gp2/ami-id',
      ),
      blockDevices: [
        {
          deviceName: '/dev/sda1',
          volume: ec2.BlockDeviceVolume.ebs(40),
        },
      ],
      keyName: 'your-key-pair-name-goes-here', // we will create this in the console before we deploy
    })
    
    instance.addUserData(
      fs.readFileSync('lib/install_unifi.sh', 'utf8')
    )

    let eip = new ec2.CfnEIP(this, "unifi-cdk-ip");

    new ec2.CfnEIPAssociation(this, "Ec2Association", {
      eip: eip.ref,
      instanceId: instance.instanceId
    });

    new cdk.CfnOutput(this, 'unifi-controller-instance-output', {
      value: instance.instancePublicIp,
    })

  }
}
