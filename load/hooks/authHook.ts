import { login } from '../../shared/helpers/auth';

module.exports = {
    async beforeScenario(_: any, context: any, ee: any, next: () => void) {
        const { cookies } = await login();
        context.vars.cookies = cookies;
        next();
    }
};
