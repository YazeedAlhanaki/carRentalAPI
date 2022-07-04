import { CarReview } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../prisma';
import _ from 'lodash';
import { ObjectId } from 'bson';
import Fuse from 'fuse.js'

const CarReview = Type.Object({
	review_id: Type.String(),
	review: Type.String(),
	ReviewScore: Type.Number(),
	reviewDate: Type.String({format:"date-time"}),
	user_id: Type.String(),
	car_id: Type.String()

});

const CarReviewWithoutId = Type.Object({
	review: Type.String(),
	reviewScore: Type.Number(),
	reviewDate: Type.String({format:"date-time"}),
	user_id: Type.String(),
	car_id: Type.String()

});
type CarReviewWithoutId = Static<typeof CarReviewWithoutId>;

const GetReviewsQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetReviewsQuery = Static<typeof GetReviewsQuery>;

export default async function (server: FastifyInstance) {

	server.route({
		method: 'POST',
		url: '/review',
		schema: {
			summary: 'Creates new review',
			tags: ['review'],
			body: CarReviewWithoutId,
		},
		handler: async (request, reply) => {
			const review = request.body as CarReviewWithoutId;
			return await prismaClient.carReview.create({
				data: review,
			});
		},
	});
	server.route({
		method: 'GET',
		url: '/reviews',
		schema: {
			summary: 'Gets all reviews',
			tags: ['review'],
			querystring: GetReviewsQuery,
			response: {
				'2xx': Type.Array(CarReview),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetReviewsQuery;

			const reviews = await prismaClient.carReview.findMany();
			if (!query.text) return reviews;

			const fuse = new Fuse(reviews, {
				includeScore: true,
				isCaseSensitive: false,
				includeMatches: true,
				findAllMatches: true,
				threshold: 1,
				keys: ['reviewDate', 'ReviewScore'],
			});


			const result: CarReview[] = fuse.search(query.text).map((r) => r.item);
			return result;
		},
	});
}

