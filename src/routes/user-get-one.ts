import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import { prismaClient } from "../prisma";
const Users = Type.Object({
	user_id: Type.String(),
	email: Type.String(),
	username: Type.String(),
	password: Type.String(),
})
type Users = Static<typeof Users>;

const UserParams = Type.Object({
	user_id: Type.String(),
});
type UserParams = Static<typeof UserParams>;


export default async function (server: FastifyInstance) {
    server.route({
		method: 'GET',
		url: '/user/:user_id',
		schema: {
			summary: 'Returns one user or null',
			tags: ['user'],
			params: UserParams,
			response: {
				'2xx': Type.Union([Users, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const { user_id } = request.params as UserParams;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest('contact_id should be an ObjectId!');
				return;
			}

			return prismaClient.user.findFirst({
				where: { user_id },
			});
		},
	});
}