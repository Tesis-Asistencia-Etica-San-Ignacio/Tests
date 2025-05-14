import request from 'supertest';
import { app } from '../../../../Backend/src/server';
import { login } from '../../../shared/helpers/auth';

describe('POST /auth/login', () => {
    it('debería responder 200 y devolver cookies', async () => {
        const { cookies } = await login();
        expect(cookies).toContain('connect.sid');
    });

    it('rechaza credenciales inválidas', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'fake', password: 'wrong' });
        expect(res.status).toBe(401);
    });
});
