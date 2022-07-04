import { CarReview } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../prisma';
import _ from 'lodash';
import { ObjectId } from 'bson';
import Fuse from 'fuse.js'
import { addAuthorization } from '../hooks/auth';


const CarReviewWithoutId = Type.Object({
	review: Type.String(),
	reviewScore: Type.Number(),
	reviewDate: Type.String({format:"date-time"}),
	user_id: Type.String(),
	car_id: Type.String()
});
type CarReviewWithoutId = Static<typeof CarReviewWithoutId>;


export default async function (server: FastifyInstance) {
    addAuthorization(server);

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
}

