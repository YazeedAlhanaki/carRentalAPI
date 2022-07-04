import { FastifyInstance } from 'fastify';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { tokens } from './../routes/login';

export function verifyToken(token: string): { flag: boolean; userId: string } {
	const mySecret = 'secret';
	let flag = false;
	let userId = '';
	jwt.verify(token, mySecret, (err, decoded) => {
		if (err) {
			flag = false;
		}
		if ((decoded as { username: string })?.username) {
			flag = true;
		}
	});
	return { flag, userId };
}
export function addAuthorization(server: FastifyInstance) {
	server.addHook('onRequest', async (request, reply) => {
        console.log(request.headers)
		if (request.headers.authorization == undefined) {
			reply.status(400).send({ msg: "there's no token" });
		}
		const Authorization = (request.headers as any).authorization.split(' ');
		const { flag, userId } = verifyToken(Authorization[1]);
		if (flag === false) reply.code(401).send({ msg: 'unauthorized' });
	});
}
