import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import { addAuthorization } from "../hooks/auth";
import { prismaClient } from "../prisma";
const Users = Type.Object({
	user_id: Type.String(),
	email: Type.String(),
	username: Type.String(),
	password: Type.String(),
})
const UserWithoutId = Type.Object({
	email: Type.String(),
	username: Type.String(),
	password: Type.String(),
});
type UserWithoutId = Static<typeof UserWithoutId>;
type Users = Static<typeof Users>;
const PartialUser = Type.Partial(Users);
type PartialUser = Static<typeof UserWithoutId>;

const UserParams = Type.Object({
	user_id: Type.String(),
});
type UserParams = Static<typeof UserParams>;

export default async function (server: FastifyInstance) {
    addAuthorization(server);
    server.route({
		method: 'PATCH',
		url: '/user/:user_id',
		schema: {
			summary: 'Update a user by id + you dont need to pass all properties',
			tags: ['user'],
			body: PartialUser,
			params: UserParams,
		},
		handler: async (request, reply) => {
			const { user_id } = request.params as UserParams;
			if (!ObjectId.isValid(user_id)) {
				reply.badRequest('user_id should be an ObjectId!');
				return;
			}
			const user = request.body as any;
			return prismaClient.user.update({
				where: { user_id },
				data: user,
			});
		},});}