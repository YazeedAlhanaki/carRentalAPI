import { Payment } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { addAuthorization } from "../hooks/auth";
import { prismaClient } from "../prisma";

const PaymentwithoutId = Type.Object({
    rental_id  : Type.String(),      
    paymentDate  : Type.String({format:"date-time"}), 
    paymentAmount: Type.Number()
});
type PaymentwithoutId = Static<typeof PaymentwithoutId>;


export default async function (server: FastifyInstance) {
    addAuthorization(server);

    server.route({
		method: 'POST',
		url: '/payment',
		schema: {
			summary: 'Creates new payment',
			tags: ['payment'],
			body: PaymentwithoutId,
		},
		handler: async (request, reply) => {
            addAuthorization(server);

			const payment = request.body as Payment
			
			return await prismaClient.payment.create({
				data: payment,
			})
        		},
	}); 
}