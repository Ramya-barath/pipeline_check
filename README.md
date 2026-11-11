# RallyPoint Badminton — Angular + Docker + ECR + ECS

A responsive Angular badminton-club landing page, packaged as an Nginx container and deployed to Amazon ECS Fargate by GitHub Actions.

## Architecture

GitHub `main` push → GitHub Actions → Docker build → Amazon ECR → new ECS task-definition revision → ECS service rolling deployment.

## Edit these values first

In `.github/workflows/deploy-to-ecs.yml`, set `AWS_REGION` to your AWS region. The names below are the expected resource names:
- ECR repository: `badminton-angular`
- ECS cluster: `badminton-cluster`
- ECS service: `badminton-service`
- ECS container name: `badminton-web`

The ECS task definition must use the same region and resource names. In `ecs-task-definition.json`, replace `REPLACE_WITH_ECS_TASK_EXECUTION_ROLE_ARN` with the ARN of the ECS task execution role. For the initial task-definition registration, replace `REPLACE_WITH_ECR_IMAGE_URI` with `nginx:stable-alpine` so the first ECS task can start. After the first GitHub Actions deployment, the workflow replaces this image with your own commit-tagged ECR image.

## 1. Run locally

Requirements: Node.js 22+ and npm.

```bash
npm install
npm start
```

Open http://localhost:4200.

Build and test the production bundle:

```bash
npm run build
```

## 2. Test the Docker image locally

```bash
docker build -t badminton-angular:local .
docker run --rm -p 8080:80 badminton-angular:local
```

Open http://localhost:8080.

## 3. Create AWS resources (one-time setup)

Use the AWS Console in the SAME region configured in the workflow.

1. Create an ECR private repository named `badminton-angular`.
2. Create an ECS cluster named `badminton-cluster` using AWS Fargate.
3. Create a CloudWatch log group named `/ecs/badminton`.
4. Create an ECS task execution IAM role trusted by `ecs-tasks.amazonaws.com` and attach `AmazonECSTaskExecutionRolePolicy`.
5. Replace the execution role ARN in `ecs-task-definition.json`.
6. Register `ecs-task-definition.json` as a task definition. Family: `badminton-task`; launch type compatibility: Fargate; task size: 0.25 vCPU / 0.5 GB.
7. Create an ECS service named `badminton-service` in the cluster, using the `badminton-task` task definition, Fargate launch type, and desired count 1.
8. Use a VPC with public subnets across at least two Availability Zones. For a simple learning deployment, enable public IP assignment on the service tasks and allow inbound TCP 80 from your IP (or from an Application Load Balancer security group). The task security group must allow outbound access so it can pull from ECR and send logs. For a production site, put an Application Load Balancer in front and do not expose task public IPs.
9. Create or select an ECS service role if the console asks for one.

For an internet-facing production service, create an Application Load Balancer with an HTTP listener on port 80 and target group target type `ip`, port 80, health check path `/health`. Attach the ECS service to that target group.

## 4. Configure GitHub → AWS authentication (OIDC; no AWS access keys)

Create an IAM OIDC identity provider for `https://token.actions.githubusercontent.com` with audience `sts.amazonaws.com` if it does not already exist.

Create an IAM role for GitHub Actions with this trust policy. Replace `YOUR_GITHUB_USER_OR_ORG` and `YOUR_REPOSITORY`:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USER_OR_ORG/YOUR_REPOSITORY:ref:refs/heads/main"
      }
    }
  }]
}
```

Attach a permissions policy to that role (replace `YOUR_ACCOUNT_ID` and use your configured region):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ecr:GetAuthorizationToken"],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:CompleteLayerUpload",
        "ecr:InitiateLayerUpload",
        "ecr:PutImage",
        "ecr:UploadLayerPart"
      ],
      "Resource": "arn:aws:ecr:ap-south-1:YOUR_ACCOUNT_ID:repository/badminton-angular"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:DescribeServices",
        "ecs:DescribeTaskDefinition",
        "ecs:RegisterTaskDefinition",
        "ecs:UpdateService",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
```

For tighter least-privilege, scope ECS actions and `iam:PassRole` to the exact service/task roles after your first successful deployment.

Copy the IAM role ARN and add it to GitHub:
Repository → Settings → Secrets and variables → Actions → New repository secret
- Name: `AWS_DEPLOY_ROLE_ARN`
- Value: the IAM role ARN

No AWS access key or secret key is stored in GitHub.

## 5. Push to GitHub

Create a GitHub repository, then from this project folder:

```bash
git init
git add .
git commit -m "Initial badminton Angular app and ECS pipeline"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USER_OR_ORG/YOUR_REPOSITORY.git
git push -u origin main
```

The workflow runs on every push to `main`. Each run builds a Docker image, pushes an immutable image tagged with the commit SHA to ECR, renders a new ECS task-definition revision using that image, and updates the ECS service. ECS then replaces the running task(s) and waits for service stability.

## 6. Make a change and deploy automatically

Edit any Angular file, for example `src/app/app.component.ts` or its CSS. Then:

```bash
git add .
git commit -m "Update badminton page"
git push origin main
```

Watch the run under GitHub → Actions. When it succeeds, ECS will be running the new image. Changes made locally do not deploy until committed and pushed to the `main` branch.

## Troubleshooting

- `AccessDenied` in GitHub Actions: check OIDC trust policy `sub`, repository/branch spelling, role permissions and the GitHub secret.
- `CannotPullContainerError`: check task execution role, ECR repository region, and task subnet internet/NAT connectivity or ECR VPC endpoints.
- Tasks fail health checks: check container name, port 80, `/health`, task security group and target group health-check path.
- Service does not update: confirm the workflow deployed a new task-definition revision and inspect ECS service events.
