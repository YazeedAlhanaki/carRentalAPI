import { Rental } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../prisma';
import _ from 'lodash';
import { ObjectId } from 'bson';
import Fuse from 'fuse.js'


const Rental = Type.Object({
	rental_id : Type.String(),
	user_id: Type.String(),
	returnDate: Type.String({format:"date-time"}),
	car_id: Type.String(),
	customer_id: Type.String()
});

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

const GetRentalsQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetRentalsQuery = Static<typeof GetRentalsQuery>;



export default async function (server: FastifyInstance) {

	// server.route({
	// 	method: 'POST',
	// 	url: '/rentals',
	// 	schema: {
	// 		summary: 'Creates new rental',
	// 		tags: ['rental'],
	// 		body: RentalWithoutId,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const rental = request.body as RentalWithoutId;
	// 		return await prismaClient.rental.create({
	// 			data: rental,
	// 		});
	// 	},
	// });

	/// Upsert one but all fields are required
	// server.route({
	// 	method: 'PUT',
	// 	url: '/rentals',
	// 	schema: {
	// 		summary: 'Creates new rental + all properties are required',
	// 		tags: ['rental'],
	// 		body: Rental,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const rental = request.body as Rental;
	// 		if (!ObjectId.isValid(rental.rental_id)) {
	// 			reply.badRequest('rental_id should be an ObjectId!');
	// 		} else {
	// 			return await prismaClient.rental.upsert({
	// 				where: { rental_id: rental.rental_id },
	// 				create: rental,
	// 				update: _.omit(rental, ['rental_id']),
	// 			});
	// 		}
	// 	},
	// });

	/// Update one by id
	// server.route({
	// 	method: 'PATCH',
	// 	url: '/rentals/:rental_id',
	// 	schema: {
	// 		summary: 'Update a rental by id + you dont need to pass all properties',
	// 		tags: ['rental'],
	// 		body: PartialRentalWithoutId,
	// 		params: RentalParams,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { rental_id } = request.params as RentalParams;
	// 		if (!ObjectId.isValid(rental_id)) {
	// 			reply.badRequest('rental_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		const rental = request.body as PartialRentalWithoutId;

	// 		return prismaClient.rental.update({
	// 			where: { rental_id },
	// 			data: rental,
	// 		});
	// 	},
	// });

	/// Delete one by id
	// server.route({
	// 	method: 'DELETE',
	// 	url: '/rentals/:rental_id',
	// 	schema: {
	// 		summary: 'Deletes a rental',
	// 		tags: ['rental'],
	// 		params: RentalParams,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { rental_id } = request.params as RentalParams;
	// 		if (!ObjectId.isValid(rental_id)) {
	// 			reply.badRequest('rental_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		return prismaClient.rental.delete({
	// 			where: { rental_id },
	// 		});
	// 	},
	// });

	/// Get one by id
	// server.route({
	// 	method: 'GET',
	// 	url: '/rentals/:rental_id',
	// 	schema: {
	// 		summary: 'Returns one car or null',
	// 		tags: ['rental'],
	// 		params: RentalParams,
	// 		response: {
	// 			'2xx': Type.Union([Rental, Type.Null()]),
	// 		},
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { rental_id } = request.params as RentalParams;
	// 		if (!ObjectId.isValid(rental_id)) {
	// 			reply.badRequest('rental_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		return prismaClient.rental.findFirst({
	// 			where: { rental_id },
	// 		});
	// 	},
	// });

	/// Get all contacts or search by name
	// server.route({
	// 	method: 'GET',
	// 	url: '/rentals',
	// 	schema: {
	// 		summary: 'Gets all rentals',
	// 		tags: ['rental'],
	// 		querystring: GetRentalsQuery,
	// 		response: {
	// 			'2xx': Type.Array(Rental),
	// 		},
	// 	},
	// 	handler: async (request, reply) => {
	// 		const query = request.query as GetRentalsQuery;

	// 		const rentals = await prismaClient.rental.findMany();
	// 		if (!query.text) return rentals;

	// 		const fuse = new Fuse(rentals, {
	// 			includeScore: true,
	// 			isCaseSensitive: false,
	// 			includeMatches: true,
	// 			findAllMatches: true,
	// 			threshold: 1,
	// 			keys: ['returnDate', 'rentalDate'],
	// 		});


	// 		const result: Rental[] = fuse.search(query.text).map((r) => r.item);
	// 		return result;
	// 	},
	// });
}