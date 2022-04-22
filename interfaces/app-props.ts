import { StackProps } from "aws-cdk-lib";

export default interface AppProps extends StackProps{
    stage: string;
    project: string;
}