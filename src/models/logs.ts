import { Document,Schema, } from "mongoose";

export enum logModule {
    User = "USER",
    AUTH = "AUTH",
    ROUTE = "ROUTE",
    CONTENT = "CONTENT"
}

export enum logLevel {
    VERBOSE = "VERBOSE",
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR"
}