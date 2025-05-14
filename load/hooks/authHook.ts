import { login } from '../../shared/helpers/auth';

module.exports = {
    async beforeScenario(_context: any, vars: any, ee: any, next: () => void) {
        // Realiza login y guarda las cookies para cada VU
        const { cookies } = await login();
        vars.cookies = cookies;
        next();
    }
};
