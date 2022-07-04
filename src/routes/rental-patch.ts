import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "bson";
import { FastifyInstance } from "fastify";
import { prismaClient } from "../prisma";
const RentalWithoutId = Type.Object({
	user_id: Type.String(),
	returnDate: Type.String({format:"date-time"}),
	car_id: Type.String(),
	customer_id: Type.String()
});
type RentalWithoutId = Static<typeof RentalWithoutId>;

const PartialRentalWithoutId = Type.Partial(RentalWithoutId);
type PartialRentalWithoutId = Static<typeof PartialRentalWithoutId>;

const RentalParams = Type.Object({
	rental_id: Type.String(),
});
type RentalParams = Static<typeof RentalParams>;


export default async function (server: FastifyInstance) {
    server.route({
		method: 'PATCH',
		url: '/rentals/:rental_id',
		schema: {
			summary: 'Update a rental by id + you dont need to pass all properties',
			tags: ['rental'],
			body: PartialRentalWithoutId,
			params: RentalParams,
		},
		handler: async (request, reply) => {
			const { rental_id } = request.params as RentalParams;
			if (!ObjectId.isValid(rental_id)) {
				reply.badRequest('rental_id should be an ObjectId!');
				return;
			}

			const rental = request.body as PartialRentalWithoutId;

			return prismaClient.rental.update({
				where: { rental_id },
				data: rental,
			});
		},
	});
}