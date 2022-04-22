const baseProps = {
    project: 'ServerlessProject',
    env: { account: '415691693642', region: 'us-east-1' },
}

const devProps = {
    ...baseProps,
    stage: "dev"
};

const prodProps = {
    ...baseProps,
    stage: "prd"
};

export const APP_PROPS ={
    devProps,
    prodProps
}
