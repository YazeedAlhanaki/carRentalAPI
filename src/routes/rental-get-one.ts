import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import { addAuthorization } from "../hooks/auth";
import { prismaClient } from "../prisma";

const Rentals = Type.Object({
	rental_id : Type.String(),
	user_id: Type.String(),
	returnDate: Type.String({format:"date-time"}),
	car_id: Type.String(),
	customer_id: Type.String()
});
type Rentals = Static<typeof Rentals>;
const RentalParams = Type.Object({
	rental_id: Type.String(),
});
type RentalParams = Static<typeof RentalParams>;



export default async function (server: FastifyInstance) {
    addAuthorization(server);

    server.route({
		method: 'GET',
		url: '/rentals/:rental_id',
		schema: {
			summary: 'Returns one car or null',
			tags: ['rental'],
			params: RentalParams,
			response: {
				'2xx': Type.Union([Rentals, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const { rental_id } = request.params as RentalParams;
			if (!ObjectId.isValid(rental_id)) {
				reply.badRequest('rental_id should be an ObjectId!');
				return;
			}

			return prismaClient.rental.findFirst({
				where: { rental_id },
			});
		},
	});
}