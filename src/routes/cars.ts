import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../prisma';
import _ from 'lodash';
import { ObjectId } from 'bson';
import Fuse from 'fuse.js'
import { Car } from '@prisma/client';


 const Car = Type.Object({
	car_id: Type.String(),
	carName: Type.String(),
	carBrand: Type.String(),
	color: Type.String(),
	capacity: Type.Number(),
	model: Type.Number(),
	price: Type.Number(),
    is_booked: Type.Boolean(),
});


const CartWithoutId = Type.Object({
	carName: Type.String(),
	carBrand: Type.String(),
	color: Type.String(),
	capacity: Type.Number(),
	model: Type.Number(),
	price: Type.Number(),
    is_booked: Type.Boolean(),
})
type CartWithoutId = Static<typeof CartWithoutId>;

const PartialcarWithoutId = Type.Partial(CartWithoutId);
type PartialcarWithoutId = Static<typeof PartialcarWithoutId>;

const CarParams = Type.Object({
	car_id: Type.String(),
});
type CarParams = Static<typeof CarParams>;

const GetCarQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetCarQuery = Static<typeof GetCarQuery>;




export default async function (server: FastifyInstance) {

	// server.route({
	// 	method: 'POST',
	// 	url: '/cars',
	// 	schema: {
	// 		summary: 'Creates new car',
	// 		tags: ['cars'],
	// 		body: CartWithoutId,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const car = request.body as CartWithoutId;
	// 		return await prismaClient.car.create({
	// 			data: car,
	// 		});
	// 	},
	// });

	/// Upsert one but all fields are required
	// server.route({
	// 	method: 'PUT',
	// 	url: '/cars',
	// 	schema: {
	// 		summary: 'Creates new car + all properties are required',
	// 		tags: ['cars'],
	// 		body: Car,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const car = request.body as Car;
	// 		if (!ObjectId.isValid(car.car_id)) {
	// 			reply.badRequest('car_id should be an ObjectId!');
	// 		} else {
	// 			return await prismaClient.car.upsert({
	// 				where: { car_id: car.car_id },
	// 				create: car,
	// 				update: _.omit(car, ['car_id']),
	// 			});
	// 		}
	// 	},
	// });

	/// Update one by id
	// server.route({
	// 	method: 'PATCH',
	// 	url: '/cars/:car_id',
	// 	schema: {
	// 		summary: 'Update a car by id + you dont need to pass all properties',
	// 		tags: ['cars'],
	// 		body: PartialcarWithoutId,
	// 		params: CarParams,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { car_id } = request.params as CarParams;
	// 		if (!ObjectId.isValid(car_id)) {
	// 			reply.badRequest('car_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		const car = request.body as PartialcarWithoutId;

	// 		return prismaClient.car.update({
	// 			where: { car_id },
	// 			data: car,
	// 		});
	// 	},
	// });

	/// Delete one by id
	// server.route({
	// 	method: 'DELETE',
	// 	url: '/cars/:car_id',
	// 	schema: {
	// 		summary: 'Deletes a car',
	// 		tags: ['cars'],
	// 		params: CarParams,
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { car_id } = request.params as CarParams;
	// 		if (!ObjectId.isValid(car_id)) {
	// 			reply.badRequest('contact_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		return prismaClient.car.delete({
	// 			where: { car_id },
	// 		});
	// 	},
	// });

	/// Get one by id
	// server.route({
	// 	method: 'GET',
	// 	url: '/cars/:car_id',
	// 	schema: {
	// 		summary: 'Returns one car or null',
	// 		tags: ['cars'],
	// 		params: CarParams,
	// 		response: {
	// 			'2xx': Type.Union([Car, Type.Null()]),
	// 		},
	// 	},
	// 	handler: async (request, reply) => {
	// 		const { car_id } = request.params as CarParams;
	// 		if (!ObjectId.isValid(car_id)) {
	// 			reply.badRequest('car_id should be an ObjectId!');
	// 			return;
	// 		}

	// 		return prismaClient.car.findFirst({
	// 			where: { car_id },
	// 		});
	// 	},
	// });

	/// Get all contacts or search by name
	// server.route({
	// 	method: 'GET',
	// 	url: '/cars',
	// 	schema: {
	// 		summary: 'Gets all cars',
	// 		tags: ['cars'],
	// 		querystring: GetCarQuery,
	// 		response: {
	// 			'2xx': Type.Array(Car),
	// 		},
	// 	},
	// 	handler: async (request, reply) => {
	// 		const query = request.query as GetCarQuery;

	// 		const cars = await prismaClient.car.findMany();
	// 		if (!query.text) return cars;

	// 		const fuse = new Fuse(cars, {
	// 			includeScore: true,
	// 			isCaseSensitive: false,
	// 			keys: ['carName'],
	// 		});


	// 		const result: Car[] = fuse.search(query.text).map((r) => r.item);
	// 		return result;
	// 	},
	// });
}
