import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { StkRequest } from './models/StkRequest';
import { StkCallback } from './models/StkCallback';

export const AppDataSource = new DataSource({
    type       : "mysql",
    host       : "localhost",
    port       : Number(process.env.DB_PORT || 3306),
    username   : process.env.DB_USERNAME,
    password   : process.env.DB_PASSWORD,
    database   : process.env.DB_DATABASE,
    socketPath : process.env.DB_SOCKET,
    synchronize: process.env.NODE_ENV !== 'production',
    logging    : false,
    // dropSchema:true,
    entities      : [
        StkRequest,
        StkCallback,
    ],
    migrations    : [],
    subscribers   : [],
    namingStrategy: new SnakeNamingStrategy()
});
