import request from 'supertest';
import { app } from '../../../../Backend/src/server';
import { login } from '../../../shared/helpers/auth';

describe('POST /auth/refresh', () => {
    it('devuelve 200 y nueva cookie', async () => {
        const { cookies } = await login();
        const res = await request(app)
            .post('/auth/refresh')
            .set('Cookie', cookies);
        expect(res.status).toBe(200);
        expect(res.headers['set-cookie']).toBeDefined();
    });
});
