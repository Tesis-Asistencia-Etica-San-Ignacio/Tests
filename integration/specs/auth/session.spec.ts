import request from 'supertest';
import { app } from '../../../../Backend/src/server';
import { login } from '../../../shared/helpers/auth';

describe('GET /auth/me', () => {
    it('responde con la sesión del admin', async () => {
        const { cookies } = await login();
        const res = await request(app)
            .get('/auth/me')
            .set('Cookie', cookies);

        expect(res.status).toBe(200);
        expect(res.body.email).toBe(process.env.ADMIN_EMAIL);
    });
});
