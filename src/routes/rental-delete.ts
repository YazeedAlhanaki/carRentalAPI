import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import { addAuthorization } from "../hooks/auth";
import { prismaClient } from "../prisma";

const RentalParams = Type.Object({
	rental_id: Type.String(),
});
type RentalParams = Static<typeof RentalParams>;



export default async function (server: FastifyInstance) {
    addAuthorization(server);

    server.route({
		method: 'DELETE',
		url: '/rentals/:rental_id',
		schema: {
			summary: 'Deletes a rental',
			tags: ['rental'],
			params: RentalParams,
		},
		handler: async (request, reply) => {
			const { rental_id } = request.params as RentalParams;
			if (!ObjectId.isValid(rental_id)) {
				reply.badRequest('rental_id should be an ObjectId!');
				return;
			}

			return prismaClient.rental.delete({
				where: { rental_id },
			});
		},
	});
}