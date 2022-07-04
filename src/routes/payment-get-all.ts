import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import Fuse from "fuse.js";
import { prismaClient } from "../prisma";
import { Payment } from '@prisma/client';
import { addAuthorization } from "../hooks/auth";


const Payment = Type.Object({
	payment_id: Type.String(),           
    rental_id  : Type.String(),      
    paymentDate  : Type.String({format:"date-time"}), 
    paymentAmount: Type.Number()
});
const GetpaymentQuery = Type.Object({
	text: Type.Optional(Type.String()),
});
type GetpaymentQuery = Static<typeof GetpaymentQuery>;



export default async function (server: FastifyInstance) {
    addAuthorization(server);

	server.route({
		method: 'GET',
		url: '/payment',
		schema: {
			summary: 'Gets all payments',
			tags: ['payment'],
			querystring: GetpaymentQuery,
			response: {
				'2xx': Type.Array(Payment),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetpaymentQuery;

			const payments = await prismaClient.payment.findMany();
			if (!query.text) return payments;

			const fuse = new Fuse(payments, {
				includeScore: true,
				isCaseSensitive: false,
				includeMatches: true,
				findAllMatches: true,
				threshold: 1,
				keys: ['paymentDate', 'paymentAmount'],
			});


			const result: Payment[] = fuse.search(query.text).map((r) => r.item);
			return result;
		},
	});}