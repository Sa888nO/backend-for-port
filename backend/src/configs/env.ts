const envConfig = {
    path: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod'
}

export default envConfig