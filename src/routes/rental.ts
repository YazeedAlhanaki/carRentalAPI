import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { rentalController } from '../controllers/rental';
import car from './cars';


const Rental = Type.Object({
	name : Type.String(),
	id: Type.String({ format: 'uuid' }),
	rentalDate: Type.Number(Date),
	returnDate: Type.Number(Date),
	carId: Type.String(car),
	
});
type Rental = Static<typeof Rental>;

const GetRentalQuery = Type.Object({
	name: Type.Optional(Type.String()),
});
type GetRentalQuery = Static<typeof GetRentalQuery>;

export let rentals: Rental[] = [];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/rentl',
		schema: {
			summary: 'Creates new rental + all properties are required',
			tags: ['rentals'],
			body: Rental,
		},
		handler: async (request, reply) => {
			const newRental: any = request.body;
			return rentalController(rentals, newRental);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/rental/:id',
		schema: {
			summary: 'Update a rental by id + you dont need to pass all properties',
			tags: ['rentals'],
			body: Type.Partial(Rental),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newRental: any = request.body;
			return rentalController(rentals, newRental);
		},
	});

	server.route({
		method: 'DELETE',
		url: '/rental/:id',
		schema: {
			summary: 'Deletes a rental',
			tags: ['rentals'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			rentals = rentals.filter((c) => c.id !== id);

			return rentals;
		},
	});

	server.route({
		method: 'GET',
		url: '/rental/:id',
		schema: {
			summary: 'Returns one rental or null',
			tags: ['cars'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Rental, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return rentals.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/rental',
		schema: {
			summary: 'Gets all rentals',
			tags: ['rentals'],
			querystring: GetRentalQuery,
			response: {
				'2xx': Type.Array(Rental),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetRentalQuery;

			if (query.name) {
				return rentals.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return rentals;
			}
		},
	});
}
