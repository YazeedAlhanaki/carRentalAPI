import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { request } from "http";
import { mean, method, round } from "lodash";
import { type } from "os";
import { prismaClient } from "../prisma";


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

export default async function (server: FastifyInstance) {
    server.route({
        url: '/cheapest-available-car',
        method: 'GET',
        schema: {
            summary: 'Returns the cheapest available car',
            tags: ['Cars'],
            response: {
                '2xx': Type.Union([
                    Car,
                    Type.Null()
                ])
            }
        },
        handler: async(request, reply) => {
            return prismaClient.car.findFirst({
                where: { is_booked: false },
                orderBy: { price: 'asc' }
            })
        }
    })
    
}