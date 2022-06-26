import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { reviewController } from '../controllers/carReview';
import user from './user';
import car from './cars';

const CarReview = Type.Object({
	id: Type.String({ format: 'uuid' }),
	review: Type.String(),
	ReviewScore: Type.Number(),
	date: Type.Integer(Date),
	customerId: Type.String(user),
	carId: Type.String(car)

});
type CarReview = Static<typeof CarReview>;

const GetreviewQuery = Type.Object({
	name: Type.Optional(Type.String()),
});
type GetreviewQuery = Static<typeof GetreviewQuery>;


export let reviews: CarReview[] = [];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/review',
		schema: {
			summary: 'Creates new review + all properties are required',
			tags: ['reviews'],
			body: CarReview,
		},
		handler: async (request, reply) => {
			const newReview: any = request.body;
			return reviewController(reviews, newReview);
		},
	}); 
    server.route({
		method: 'PATCH',
		url: '/review/:id',
		schema: {
			summary: 'Update a review by id + you dont need to pass all properties',
			tags: ['reviews'],
			body: Type.Partial(CarReview),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newReview: any = request.body;
			return reviewController(reviews, newReview);
		},
	});

    server.route({
		method: 'GET',
		url: '/reviews/:id',
		schema: {
			summary: 'Returns one review or null',
			tags: ['reviews'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([CarReview, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return reviews.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'DELETE',
		url: '/review/:id',
		schema: {
			summary: 'Deletes a review',
			tags: ['reviews'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			reviews = reviews.filter((c) => c.id !== id);

			return reviews;
		},
	});

	server.route({
		method: 'GET',
		url: '/reviews',
		schema: {
			summary: 'Gets all reviews',
			tags: ['reviews'],
			querystring: GetreviewQuery,
			response: {
				'2xx': Type.Array(CarReview),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetreviewQuery;

			if (query.name) {
				return reviews.filter((c) => c.review.includes(query.name ?? ''));
			} else {
				return reviews;
			}
		},
	});

}