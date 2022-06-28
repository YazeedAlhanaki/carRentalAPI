import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { carsController } from '../controllers/cars';

const Car = Type.Object({
	id: Type.String({ format: 'uuid', $id: 'car' }),
	name: Type.String(),
	carBrand: Type.String(),
	color: Type.String(),
	capacity: Type.Number(),
	model: Type.Number(),
});
type Car = Static<typeof Car>;

const GetcarQuery = Type.Object({
	name: Type.Optional(Type.String()),
});
type GetcarQuery = Static<typeof GetcarQuery>;

export let cars: Car[] = [];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/cars',
		schema: {
			summary: 'Creates new car + all properties are required',
			tags: ['cars'],
			body: Car,
		},
		handler: async (request, reply) => {
			const newCar: any = request.body;
			return carsController(cars, newCar);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/cars/:id',
		schema: {
			summary: 'Update a car by id + you dont need to pass all properties',
			tags: ['cars'],
			body: Type.Partial(Car),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newCar: any = request.body;
			return carsController(cars, newCar);
		},
	});

	server.route({
		method: 'DELETE',
		url: '/cars/:id',
		schema: {
			summary: 'Deletes a car',
			tags: ['cars'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			cars = cars.filter((c) => c.id !== id);

			return cars;
		},
	});

	server.route({
		method: 'GET',
		url: '/cars/:id',
		schema: {
			summary: 'Returns one car or null',
			tags: ['cars'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Car, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return cars.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/cars',
		schema: {
			summary: 'Gets all cars',
			tags: ['cars'],
			querystring: GetcarQuery,
			response: {
				'2xx': Type.Array(Car),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetcarQuery;

			if (query.name) {
				return cars.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return cars;
			}
		},
	});
}
