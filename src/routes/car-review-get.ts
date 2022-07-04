import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import Fuse from "fuse.js";
import { CarReview } from '@prisma/client';
import { prismaClient } from "../prisma";
import { addAuthorization } from "../hooks/auth";

const CarReview = Type.Object({
	review_id: Type.String(),
	review: Type.String(),
	ReviewScore: Type.Number(),
	reviewDate: Type.String({format:"date-time"}),
	user_id: Type.String(),
	car_id: Type.String()
});
const GetReviewsQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetReviewsQuery = Static<typeof GetReviewsQuery>;
export default async function (server: FastifyInstance) {
    addAuthorization(server);

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


