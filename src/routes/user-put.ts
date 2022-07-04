import { User } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import _ from "lodash";
import { prismaClient } from "../prisma";
const Users = Type.Object({
	user_id: Type.String(),
	email: Type.String(),
	username: Type.String(),
	password: Type.String(),
})
type Users = Static<typeof Users>;

export default async function (server: FastifyInstance) {

    server.route({
		method: 'PUT',
		url: '/user',
		schema: {
			summary: 'Creates new user + all properties are required',
			tags: ['user'],
			body: Users,
		},
		handler: async (request, reply) => {
			const user = request.body as User;
			if (!ObjectId.isValid(user.user_id)) {
				reply.badRequest('user_id should be an ObjectId!');
			} else {
				return await prismaClient.user.upsert({
					where: { user_id: user.user_id },
					create: user,
					update: _.omit(user, ['user_id']),
				});
			}
		},
	});

}